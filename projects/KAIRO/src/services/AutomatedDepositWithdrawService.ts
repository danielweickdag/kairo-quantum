import { logger } from '../lib/logger';
import { bankAccountIntegrationService, BankAccount, TransactionRequest, TransactionResult } from './BankAccountIntegrationService';
import balanceTrackingService from './BalanceTrackingService';

export interface AutomatedWorkflowConfig {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  isEnabled: boolean;
  bankAccountId: string;
  amount: number;
  frequency: 'manual' | 'daily' | 'weekly' | 'monthly';
  conditions?: {
    minBalance?: number;
    maxBalance?: number;
    profitThreshold?: number;
    lossThreshold?: number;
  };
  nextExecutionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  transactionId?: string;
  executedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

export interface QuickActionRequest {
  type: 'deposit' | 'withdrawal';
  amount?: number;
  bankAccountId?: string;
  saveAsWorkflow?: boolean;
  workflowConfig?: Partial<AutomatedWorkflowConfig>;
}

class AutomatedDepositWithdrawService {
  private baseUrl: string;
  private workflows: Map<string, AutomatedWorkflowConfig> = new Map();
  private executionHistory: WorkflowExecution[] = [];

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    this.loadWorkflows();
  }

  /**
   * Handle Quick Deposit button click
   */
  async handleQuickDeposit(request: QuickActionRequest): Promise<TransactionResult> {
    try {
      logger.info('Handling quick deposit request');

      // Check if user has connected bank accounts
      const bankAccounts = await bankAccountIntegrationService.getBankAccounts();
      if (bankAccounts.length === 0) {
        throw new Error('NO_BANK_ACCOUNTS');
      }

      // Use specified account or default to first verified account
      const selectedAccount = request.bankAccountId 
        ? bankAccounts.find(acc => acc.id === request.bankAccountId)
        : bankAccounts.find(acc => acc.isVerified) || bankAccounts[0];

      if (!selectedAccount) {
        throw new Error('NO_VALID_BANK_ACCOUNT');
      }

      // Determine deposit amount
      const depositAmount = request.amount || await this.getRecommendedDepositAmount(selectedAccount);

      // Create transaction request
      const transactionRequest: TransactionRequest = {
        accountId: selectedAccount.id,
        amount: depositAmount,
        type: 'deposit',
        description: 'Quick Deposit via KAIRO Platform'
      };

      // Initiate the deposit
      const result = await bankAccountIntegrationService.initiateDeposit(transactionRequest);

      // Save as automated workflow if requested
      if (request.saveAsWorkflow && request.workflowConfig) {
        await this.createAutomatedWorkflow({
          ...request.workflowConfig,
          type: 'deposit',
          bankAccountId: selectedAccount.id,
          amount: depositAmount,
          userId: this.getCurrentUserId()
        } as AutomatedWorkflowConfig);
      }

      // Log execution
      this.logWorkflowExecution({
        id: this.generateId(),
        workflowId: 'quick-deposit',
        status: result.status === 'completed' ? 'completed' : 'processing',
        amount: depositAmount,
        transactionId: result.id,
        executedAt: new Date()
      });

      return result;
    } catch (error) {
      logger.error('Error handling quick deposit:', error);
      throw error;
    }
  }

  /**
   * Handle Quick Withdraw button click
   */
  async handleQuickWithdraw(request: QuickActionRequest): Promise<TransactionResult> {
    try {
      logger.info('Handling quick withdraw request');

      // Check if user has connected bank accounts
      const bankAccounts = await bankAccountIntegrationService.getBankAccounts();
      if (bankAccounts.length === 0) {
        throw new Error('NO_BANK_ACCOUNTS');
      }

      // Use specified account or default to first verified account
      const selectedAccount = request.bankAccountId 
        ? bankAccounts.find(acc => acc.id === request.bankAccountId)
        : bankAccounts.find(acc => acc.isVerified) || bankAccounts[0];

      if (!selectedAccount) {
        throw new Error('NO_VALID_BANK_ACCOUNT');
      }

      // Get current balance
      const currentBalance = await balanceTrackingService.getCurrentBalance();
      
      // Determine withdrawal amount
      const withdrawalAmount = request.amount || await this.getRecommendedWithdrawalAmount(currentBalance.availableBalance);

      // Validate withdrawal amount
      if (withdrawalAmount > currentBalance.availableBalance) {
        throw new Error('INSUFFICIENT_BALANCE');
      }

      // Create transaction request
      const transactionRequest: TransactionRequest = {
        accountId: selectedAccount.id,
        amount: withdrawalAmount,
        type: 'withdrawal',
        description: 'Quick Withdrawal via KAIRO Platform'
      };

      // Initiate the withdrawal
      const result = await bankAccountIntegrationService.initiateWithdrawal(transactionRequest);

      // Save as automated workflow if requested
      if (request.saveAsWorkflow && request.workflowConfig) {
        await this.createAutomatedWorkflow({
          ...request.workflowConfig,
          type: 'withdrawal',
          bankAccountId: selectedAccount.id,
          amount: withdrawalAmount,
          userId: this.getCurrentUserId()
        } as AutomatedWorkflowConfig);
      }

      // Log execution
      this.logWorkflowExecution({
        id: this.generateId(),
        workflowId: 'quick-withdraw',
        status: result.status === 'completed' ? 'completed' : 'processing',
        amount: withdrawalAmount,
        transactionId: result.id,
        executedAt: new Date()
      });

      return result;
    } catch (error) {
      logger.error('Error handling quick withdraw:', error);
      throw error;
    }
  }

  /**
   * Create an automated workflow
   */
  async createAutomatedWorkflow(config: Partial<AutomatedWorkflowConfig>): Promise<AutomatedWorkflowConfig> {
    try {
      const workflow: AutomatedWorkflowConfig = {
        id: this.generateId(),
        userId: this.getCurrentUserId(),
        type: config.type || 'deposit',
        isEnabled: config.isEnabled ?? true,
        bankAccountId: config.bankAccountId || '',
        amount: config.amount || 0,
        frequency: config.frequency || 'manual',
        conditions: config.conditions,
        nextExecutionDate: this.calculateNextExecutionDate(config.frequency || 'manual'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save workflow
      this.workflows.set(workflow.id, workflow);
      await this.saveWorkflows();

      logger.info('Created automated workflow:', workflow.id);
      return workflow;
    } catch (error) {
      logger.error('Error creating automated workflow:', error);
      throw error;
    }
  }

  /**
   * Get all automated workflows for the current user
   */
  async getAutomatedWorkflows(): Promise<AutomatedWorkflowConfig[]> {
    const userId = this.getCurrentUserId();
    return Array.from(this.workflows.values()).filter(w => w.userId === userId);
  }

  /**
   * Update an automated workflow
   */
  async updateAutomatedWorkflow(workflowId: string, updates: Partial<AutomatedWorkflowConfig>): Promise<AutomatedWorkflowConfig> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date()
    };

    this.workflows.set(workflowId, updatedWorkflow);
    await this.saveWorkflows();

    return updatedWorkflow;
  }

  /**
   * Delete an automated workflow
   */
  async deleteAutomatedWorkflow(workflowId: string): Promise<boolean> {
    const deleted = this.workflows.delete(workflowId);
    if (deleted) {
      await this.saveWorkflows();
    }
    return deleted;
  }

  /**
   * Execute scheduled workflows
   */
  async executeScheduledWorkflows(): Promise<void> {
    const now = new Date();
    const userId = this.getCurrentUserId();
    
    const dueWorkflows = Array.from(this.workflows.values()).filter(w => 
      w.userId === userId &&
      w.isEnabled &&
      w.frequency !== 'manual' &&
      w.nextExecutionDate &&
      w.nextExecutionDate <= now
    );

    for (const workflow of dueWorkflows) {
      try {
        await this.executeWorkflow(workflow);
      } catch (error) {
        logger.error(`Error executing workflow ${workflow.id}:`, error);
      }
    }
  }

  /**
   * Execute a specific workflow
   */
  private async executeWorkflow(workflow: AutomatedWorkflowConfig): Promise<void> {
    try {
      // Check conditions if any
      if (workflow.conditions && !await this.checkWorkflowConditions(workflow.conditions)) {
        logger.info(`Workflow ${workflow.id} conditions not met, skipping execution`);
        return;
      }

      const request: QuickActionRequest = {
        type: workflow.type,
        amount: workflow.amount,
        bankAccountId: workflow.bankAccountId
      };

      let result: TransactionResult;
      if (workflow.type === 'deposit') {
        result = await this.handleQuickDeposit(request);
      } else {
        result = await this.handleQuickWithdraw(request);
      }

      // Update next execution date
      workflow.nextExecutionDate = this.calculateNextExecutionDate(workflow.frequency);
      this.workflows.set(workflow.id, workflow);
      await this.saveWorkflows();

      logger.info(`Workflow ${workflow.id} executed successfully`);
    } catch (error) {
      logger.error(`Error executing workflow ${workflow.id}:`, error);
      throw error;
    }
  }

  /**
   * Check if workflow conditions are met
   */
  private async checkWorkflowConditions(conditions: AutomatedWorkflowConfig['conditions']): Promise<boolean> {
    if (!conditions) return true;

    const currentBalance = await balanceTrackingService.getCurrentBalance();

    if (conditions.minBalance && currentBalance.availableBalance < conditions.minBalance) {
      return false;
    }

    if (conditions.maxBalance && currentBalance.availableBalance > conditions.maxBalance) {
      return false;
    }

    // Add more condition checks as needed
    return true;
  }

  /**
   * Get recommended deposit amount based on account balance
   */
  private async getRecommendedDepositAmount(bankAccount: BankAccount): Promise<number> {
    const balance = await bankAccountIntegrationService.getAccountBalance(bankAccount.id);
    if (balance?.available) {
      // Recommend 10% of available balance, minimum $100, maximum $5000
      return Math.min(Math.max(balance.available * 0.1, 100), 5000);
    }
    return 500; // Default amount
  }

  /**
   * Get recommended withdrawal amount based on trading balance
   */
  private async getRecommendedWithdrawalAmount(availableBalance: number): Promise<number> {
    // Recommend 50% of available balance, minimum $50
    return Math.max(availableBalance * 0.5, 50);
  }

  /**
   * Calculate next execution date based on frequency
   */
  private calculateNextExecutionDate(frequency: AutomatedWorkflowConfig['frequency']): Date | undefined {
    if (frequency === 'manual') return undefined;

    const now = new Date();
    switch (frequency) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      default:
        return undefined;
    }
  }

  /**
   * Log workflow execution
   */
  private logWorkflowExecution(execution: WorkflowExecution): void {
    this.executionHistory.push(execution);
    // Keep only last 100 executions
    if (this.executionHistory.length > 100) {
      this.executionHistory = this.executionHistory.slice(-100);
    }
  }

  /**
   * Load workflows from storage
   */
  private async loadWorkflows(): Promise<void> {
    try {
      const stored = localStorage.getItem('automatedWorkflows');
      if (stored) {
        const workflows = JSON.parse(stored) as AutomatedWorkflowConfig[];
        workflows.forEach(w => this.workflows.set(w.id, w));
      }
    } catch (error) {
      logger.error('Error loading workflows:', error);
    }
  }

  /**
   * Save workflows to storage
   */
  private async saveWorkflows(): Promise<void> {
    try {
      const workflows = Array.from(this.workflows.values());
      localStorage.setItem('automatedWorkflows', JSON.stringify(workflows));
    } catch (error) {
      logger.error('Error saving workflows:', error);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string {
    return localStorage.getItem('userId') || 'demo-user';
  }
}

export const automatedDepositWithdrawService = new AutomatedDepositWithdrawService();
export default AutomatedDepositWithdrawService;