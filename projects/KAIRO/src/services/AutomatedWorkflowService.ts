'use client';

import { toast } from 'react-hot-toast';
import balanceTrackingService from './BalanceTrackingService';

// Types for the automated workflow
export interface WorkflowConfig {
  autoDeposit: {
    enabled: boolean;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    source: 'bank' | 'card' | 'crypto';
  };
  autoInvest: {
    enabled: boolean;
    strategy: 'conservative' | 'moderate' | 'aggressive' | 'custom';
    allocation: {
      stocks: number;
      crypto: number;
      forex: number;
      commodities: number;
    };
    minBalance: number;
  };
  autoWithdraw: {
    enabled: boolean;
    profitThreshold: number;
    withdrawPercentage: number;
    destination: 'bank' | 'card' | 'crypto';
  };
}

export interface WorkflowStatus {
  isRunning: boolean;
  lastExecution: Date | null;
  nextExecution: Date | null;
  totalDeposited: number;
  totalInvested: number;
  totalWithdrawn: number;
  currentBalance: number;
  totalProfit: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'invest' | 'withdraw';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  description: string;
}

class AutomatedWorkflowService {
  private config: WorkflowConfig;
  private status: WorkflowStatus;
  private transactions: Transaction[];
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    // Load configuration from localStorage or use defaults
    this.config = this.loadConfig();
    this.status = this.loadStatus();
    this.transactions = this.loadTransactions();
    
    // Start the workflow if enabled
    if (this.isAnyWorkflowEnabled()) {
      this.startWorkflow();
    }
  }

  private loadConfig(): WorkflowConfig {
    if (typeof window === 'undefined') {
      return this.getDefaultConfig();
    }
    
    const saved = localStorage.getItem('automatedWorkflowConfig');
    return saved ? JSON.parse(saved) : this.getDefaultConfig();
  }

  private loadStatus(): WorkflowStatus {
    if (typeof window === 'undefined') {
      return this.getDefaultStatus();
    }
    
    const saved = localStorage.getItem('automatedWorkflowStatus');
    return saved ? JSON.parse(saved) : this.getDefaultStatus();
  }

  private loadTransactions(): Transaction[] {
    if (typeof window === 'undefined') {
      return [];
    }
    
    const saved = localStorage.getItem('automatedWorkflowTransactions');
    return saved ? JSON.parse(saved) : [];
  }

  private getDefaultConfig(): WorkflowConfig {
    return {
      autoDeposit: {
        enabled: false,
        amount: 100,
        frequency: 'weekly',
        source: 'bank'
      },
      autoInvest: {
        enabled: false,
        strategy: 'moderate',
        allocation: {
          stocks: 40,
          crypto: 30,
          forex: 20,
          commodities: 10
        },
        minBalance: 50
      },
      autoWithdraw: {
        enabled: false,
        profitThreshold: 500,
        withdrawPercentage: 50,
        destination: 'bank'
      }
    };
  }

  private getDefaultStatus(): WorkflowStatus {
    return {
      isRunning: false,
      lastExecution: null,
      nextExecution: null,
      totalDeposited: 0,
      totalInvested: 0,
      totalWithdrawn: 0,
      currentBalance: 1250.75, // Mock current balance
      totalProfit: 250.75 // Mock profit
    };
  }

  private saveConfig(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('automatedWorkflowConfig', JSON.stringify(this.config));
    }
  }

  private saveStatus(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('automatedWorkflowStatus', JSON.stringify(this.status));
    }
  }

  private saveTransactions(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('automatedWorkflowTransactions', JSON.stringify(this.transactions));
    }
  }

  private isAnyWorkflowEnabled(): boolean {
    return this.config.autoDeposit.enabled || 
           this.config.autoInvest.enabled || 
           this.config.autoWithdraw.enabled;
  }

  public updateConfig(newConfig: Partial<WorkflowConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    
    // Restart workflow with new config
    this.stopWorkflow();
    if (this.isAnyWorkflowEnabled()) {
      this.startWorkflow();
    }
    
    toast.success('Automated workflow configuration updated');
  }

  public getConfig(): WorkflowConfig {
    return { ...this.config };
  }

  public getStatus(): WorkflowStatus {
    return { ...this.status };
  }

  public getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  public startWorkflow(): void {
    if (this.intervalId) {
      this.stopWorkflow();
    }

    this.status.isRunning = true;
    this.status.nextExecution = this.calculateNextExecution();
    this.saveStatus();

    // Run workflow every minute (in production, this would be less frequent)
    this.intervalId = setInterval(() => {
      this.executeWorkflow();
    }, 60000); // 1 minute

    toast.success('Automated workflow started');
  }

  public stopWorkflow(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.status.isRunning = false;
    this.status.nextExecution = null;
    this.saveStatus();

    toast.success('Automated workflow stopped');
  }

  private calculateNextExecution(): Date {
    const now = new Date();
    const next = new Date(now);
    
    // For demo purposes, set next execution to 1 minute from now
    next.setMinutes(next.getMinutes() + 1);
    
    return next;
  }

  private async executeWorkflow(): Promise<void> {
    try {
      this.status.lastExecution = new Date();
      
      // Execute auto deposit
      if (this.config.autoDeposit.enabled) {
        await this.executeAutoDeposit();
      }

      // Execute auto invest
      if (this.config.autoInvest.enabled && this.status.currentBalance >= this.config.autoInvest.minBalance) {
        await this.executeAutoInvest();
      }

      // Execute auto withdraw
      if (this.config.autoWithdraw.enabled && this.status.totalProfit >= this.config.autoWithdraw.profitThreshold) {
        await this.executeAutoWithdraw();
      }

      this.status.nextExecution = this.calculateNextExecution();
      this.saveStatus();
      
    } catch (error) {
      console.error('Workflow execution failed:', error);
      toast.error('Automated workflow execution failed');
    }
  }

  private async executeAutoDeposit(): Promise<void> {
    const transaction: Transaction = {
      id: `dep_${Date.now()}`,
      type: 'deposit',
      amount: this.config.autoDeposit.amount,
      status: 'pending',
      timestamp: new Date(),
      description: `Auto deposit from ${this.config.autoDeposit.source}`
    };

    this.transactions.unshift(transaction);
    this.saveTransactions();

    // Simulate deposit processing
    setTimeout(() => {
      transaction.status = 'completed';
      this.status.totalDeposited += transaction.amount;
      this.status.currentBalance += transaction.amount;
      this.saveStatus();
      this.saveTransactions();
      
      toast.success(`Auto deposit of $${transaction.amount} completed`);
    }, 2000);
  }

  private async executeAutoInvest(): Promise<void> {
    const investAmount = Math.min(
      this.status.currentBalance - this.config.autoInvest.minBalance,
      this.status.currentBalance * 0.8 // Invest max 80% of available balance
    );

    if (investAmount <= 0) return;

    const transaction: Transaction = {
      id: `inv_${Date.now()}`,
      type: 'invest',
      amount: investAmount,
      status: 'pending',
      timestamp: new Date(),
      description: `Auto investment using ${this.config.autoInvest.strategy} strategy`
    };

    this.transactions.unshift(transaction);
    this.saveTransactions();

    // Simulate investment processing
    setTimeout(() => {
      transaction.status = 'completed';
      this.status.totalInvested += transaction.amount;
      this.status.currentBalance -= transaction.amount;
      
      // Simulate profit generation (random between 1-5%)
      const profitRate = (Math.random() * 4 + 1) / 100;
      const profit = transaction.amount * profitRate;
      this.status.totalProfit += profit;
      this.status.currentBalance += profit;
      
      this.saveStatus();
      this.saveTransactions();
      
      toast.success(`Auto investment of $${transaction.amount.toFixed(2)} completed`);
    }, 3000);
  }

  private async executeAutoWithdraw(): Promise<void> {
    const withdrawAmount = (this.status.totalProfit * this.config.autoWithdraw.withdrawPercentage) / 100;

    if (withdrawAmount <= 0) return;

    const transaction: Transaction = {
      id: `wit_${Date.now()}`,
      type: 'withdraw',
      amount: withdrawAmount,
      status: 'pending',
      timestamp: new Date(),
      description: `Auto withdrawal to ${this.config.autoWithdraw.destination}`
    };

    this.transactions.unshift(transaction);
    this.saveTransactions();

    // Simulate withdrawal processing
    setTimeout(() => {
      transaction.status = 'completed';
      this.status.totalWithdrawn += transaction.amount;
      this.status.currentBalance -= transaction.amount;
      this.status.totalProfit -= transaction.amount;
      this.saveStatus();
      this.saveTransactions();
      
      toast.success(`Auto withdrawal of $${transaction.amount.toFixed(2)} completed`);
    }, 4000);
  }

  public async manualDeposit(amount: number, source: string): Promise<void> {
    try {
      const transaction: Transaction = {
        id: `man_dep_${Date.now()}`,
        type: 'deposit',
        amount,
        status: 'pending',
        timestamp: new Date(),
        description: `Manual deposit from ${source}`
      };

      this.transactions.unshift(transaction);
      this.saveTransactions();

      // Process deposit with balance tracking
      await balanceTrackingService.processDeposit(amount);
      
      transaction.status = 'completed';
      this.status.totalDeposited += amount;
      this.status.currentBalance += amount;
      this.saveStatus();
      this.saveTransactions();
      
      toast.success(`Deposit of $${amount} completed`);
    } catch (error) {
      toast.error('Deposit failed. Please try again.');
      throw error;
    }
  }

  public async manualWithdraw(amount: number, destination: string): Promise<void> {
    try {
      if (amount > this.status.currentBalance) {
        toast.error('Insufficient balance for withdrawal');
        throw new Error('Insufficient balance');
      }

      const transaction: Transaction = {
        id: `man_wit_${Date.now()}`,
        type: 'withdraw',
        amount,
        status: 'pending',
        timestamp: new Date(),
        description: `Manual withdrawal to ${destination}`
      };

      this.transactions.unshift(transaction);
      this.saveTransactions();

      // Process withdrawal with balance tracking
      await balanceTrackingService.processWithdrawal(amount);
      
      transaction.status = 'completed';
      this.status.totalWithdrawn += amount;
      this.status.currentBalance -= amount;
      this.saveStatus();
      this.saveTransactions();
      
      toast.success(`Withdrawal of $${amount} completed`);
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
      throw error;
    }
  }
}

// Export singleton instance
export const automatedWorkflowService = new AutomatedWorkflowService();
export default automatedWorkflowService;