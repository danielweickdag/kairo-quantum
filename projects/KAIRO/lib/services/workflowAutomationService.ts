import { EventEmitter } from 'events';
import { logger } from '../../src/lib/logger';

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  name: string;
  config: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
}

export interface AutomatedWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  steps: WorkflowStep[];
  createdAt: Date;
  lastExecuted?: Date;
  executionCount: number;
  successRate: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  steps: WorkflowStep[];
  error?: string;
}

export interface WorkflowTriggerEvent {
  type: 'price_change' | 'time_based' | 'manual' | 'dashboard_action';
  data: Record<string, any>;
  timestamp: Date;
}

class WorkflowAutomationService extends EventEmitter {
  private workflows: Map<string, AutomatedWorkflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private isInitialized = false;

  constructor() {
    super();
    this.initializeDefaultWorkflows();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing Workflow Automation Service');
    
    // Set up event listeners for cross-page communication
    this.setupEventListeners();
    
    this.isInitialized = true;
    this.emit('service:initialized');
  }

  private setupEventListeners(): void {
    // Listen for dashboard events
    this.on('dashboard:workflow:trigger', this.handleDashboardTrigger.bind(this));
    this.on('trading:order:placed', this.handleTradingEvent.bind(this));
    this.on('market:price:change', this.handleMarketEvent.bind(this));
  }

  private initializeDefaultWorkflows(): void {
    const defaultWorkflows: AutomatedWorkflow[] = [
      {
        id: 'auto-stop-loss',
        name: 'Automatic Stop Loss',
        description: 'Automatically place stop loss orders when positions are opened',
        isActive: true,
        steps: [
          {
            id: 'trigger-position-open',
            type: 'trigger',
            name: 'Position Opened',
            config: { eventType: 'position:opened' },
            status: 'pending'
          },
          {
            id: 'calculate-stop-loss',
            type: 'action',
            name: 'Calculate Stop Loss Price',
            config: { riskPercentage: 2 },
            status: 'pending'
          },
          {
            id: 'place-stop-loss',
            type: 'action',
            name: 'Place Stop Loss Order',
            config: { orderType: 'stop_loss' },
            status: 'pending'
          }
        ],
        createdAt: new Date(),
        executionCount: 0,
        successRate: 100
      },
      {
        id: 'profit-taking',
        name: 'Automated Profit Taking',
        description: 'Take profits at predefined levels',
        isActive: false,
        steps: [
          {
            id: 'trigger-profit-target',
            type: 'trigger',
            name: 'Profit Target Reached',
            config: { profitPercentage: 5 },
            status: 'pending'
          },
          {
            id: 'partial-close',
            type: 'action',
            name: 'Close Partial Position',
            config: { closePercentage: 50 },
            status: 'pending'
          }
        ],
        createdAt: new Date(),
        executionCount: 0,
        successRate: 95
      }
    ];

    defaultWorkflows.forEach(workflow => {
      this.workflows.set(workflow.id, workflow);
    });
  }

  // Workflow Management
  createWorkflow(workflow: Omit<AutomatedWorkflow, 'id' | 'createdAt' | 'executionCount' | 'successRate'>): string {
    const id = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWorkflow: AutomatedWorkflow = {
      ...workflow,
      id,
      createdAt: new Date(),
      executionCount: 0,
      successRate: 100
    };

    this.workflows.set(id, newWorkflow);
    this.emit('workflow:created', newWorkflow);
    logger.info(`Created workflow: ${newWorkflow.name}`);
    
    return id;
  }

  getWorkflow(id: string): AutomatedWorkflow | undefined {
    return this.workflows.get(id);
  }

  getAllWorkflows(): AutomatedWorkflow[] {
    return Array.from(this.workflows.values());
  }

  getActiveWorkflows(): AutomatedWorkflow[] {
    return this.getAllWorkflows().filter(w => w.isActive);
  }

  updateWorkflow(id: string, updates: Partial<AutomatedWorkflow>): boolean {
    const workflow = this.workflows.get(id);
    if (!workflow) return false;

    const updatedWorkflow = { ...workflow, ...updates };
    this.workflows.set(id, updatedWorkflow);
    this.emit('workflow:updated', updatedWorkflow);
    
    return true;
  }

  deleteWorkflow(id: string): boolean {
    const deleted = this.workflows.delete(id);
    if (deleted) {
      this.emit('workflow:deleted', id);
      logger.info(`Deleted workflow: ${id}`);
    }
    return deleted;
  }

  // Workflow Execution
  async executeWorkflow(workflowId: string, triggerData?: Record<string, any>): Promise<string> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    if (!workflow.isActive) {
      throw new Error(`Workflow is not active: ${workflowId}`);
    }

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: 'running',
      startTime: new Date(),
      steps: workflow.steps.map(step => ({ ...step, status: 'pending' }))
    };

    this.executions.set(executionId, execution);
    this.emit('workflow:execution:started', execution);
    logger.info(`Started workflow execution: ${workflowId}`);

    try {
      await this.runWorkflowSteps(execution, triggerData);
      
      execution.status = 'completed';
      execution.endTime = new Date();
      
      // Update workflow statistics
      workflow.executionCount++;
      workflow.lastExecuted = new Date();
      
      this.emit('workflow:execution:completed', execution);
      logger.info(`Completed workflow execution: ${executionId}`);
      
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      
      workflow.executionCount++;
      workflow.successRate = Math.max(0, workflow.successRate - 5);
      
      this.emit('workflow:execution:failed', execution);
      logger.error(`Failed workflow execution: ${executionId}`, error);
    }

    return executionId;
  }

  private async runWorkflowSteps(execution: WorkflowExecution, triggerData?: Record<string, any>): Promise<void> {
    for (const step of execution.steps) {
      step.status = 'running';
      this.emit('workflow:step:started', { execution, step });

      try {
        const result = await this.executeStep(step, triggerData);
        step.result = result;
        step.status = 'completed';
        this.emit('workflow:step:completed', { execution, step });
      } catch (error) {
        step.status = 'failed';
        this.emit('workflow:step:failed', { execution, step, error });
        throw error;
      }
    }
  }

  private async executeStep(step: WorkflowStep, triggerData?: Record<string, any>): Promise<any> {
    switch (step.type) {
      case 'trigger':
        return this.executeTriggerStep(step, triggerData);
      case 'condition':
        return this.executeConditionStep(step, triggerData);
      case 'action':
        return this.executeActionStep(step, triggerData);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private async executeTriggerStep(step: WorkflowStep, triggerData?: Record<string, any>): Promise<any> {
    // Trigger steps are usually already satisfied when workflow is executed
    return { triggered: true, data: triggerData };
  }

  private async executeConditionStep(step: WorkflowStep, triggerData?: Record<string, any>): Promise<any> {
    // Implement condition logic based on step.config
    return { conditionMet: true };
  }

  private async executeActionStep(step: WorkflowStep, triggerData?: Record<string, any>): Promise<any> {
    // Implement action logic based on step.config
    switch (step.config.orderType) {
      case 'stop_loss':
        return this.placeStopLossOrder(step.config, triggerData);
      case 'take_profit':
        return this.takeProfitOrder(step.config, triggerData);
      default:
        return { actionExecuted: true };
    }
  }

  private async placeStopLossOrder(config: Record<string, any>, triggerData?: Record<string, any>): Promise<any> {
    // Simulate placing a stop loss order
    const stopLossPrice = triggerData?.entryPrice * (1 - (config.riskPercentage || 2) / 100);
    
    this.emit('trading:order:place', {
      type: 'stop_loss',
      price: stopLossPrice,
      symbol: triggerData?.symbol,
      quantity: triggerData?.quantity
    });

    return { orderPlaced: true, stopLossPrice };
  }

  private async takeProfitOrder(config: Record<string, any>, triggerData?: Record<string, any>): Promise<any> {
    // Simulate taking profit
    const closeQuantity = (triggerData?.quantity || 0) * (config.closePercentage || 100) / 100;
    
    this.emit('trading:order:place', {
      type: 'market',
      side: 'sell',
      symbol: triggerData?.symbol,
      quantity: closeQuantity
    });

    return { orderPlaced: true, closedQuantity: closeQuantity };
  }

  // Event Handlers
  private async handleDashboardTrigger(event: WorkflowTriggerEvent): Promise<void> {
    logger.info(`Dashboard workflow trigger received: ${JSON.stringify(event)}`);
    
    // Find workflows that should be triggered by this event
    const activeWorkflows = this.getActiveWorkflows();
    
    for (const workflow of activeWorkflows) {
      const triggerStep = workflow.steps.find(step => step.type === 'trigger');
      if (triggerStep && this.shouldTriggerWorkflow(triggerStep, event)) {
        await this.executeWorkflow(workflow.id, event.data);
      }
    }
  }

  private async handleTradingEvent(event: any): Promise<void> {
    logger.info('Trading event received', event);
    
    // Trigger relevant workflows based on trading events
    if (event.type === 'position:opened') {
      const triggerEvent: WorkflowTriggerEvent = {
        type: 'manual',
        data: event,
        timestamp: new Date()
      };
      await this.handleDashboardTrigger(triggerEvent);
    }
  }

  private async handleMarketEvent(event: any): Promise<void> {
    // Handle market-based triggers
    const triggerEvent: WorkflowTriggerEvent = {
      type: 'price_change',
      data: event,
      timestamp: new Date()
    };
    await this.handleDashboardTrigger(triggerEvent);
  }

  private shouldTriggerWorkflow(triggerStep: WorkflowStep, event: WorkflowTriggerEvent): boolean {
    // Implement trigger matching logic
    return triggerStep.config.eventType === event.type || 
           triggerStep.config.eventType === 'position:opened';
  }

  // Cross-page Communication
  triggerFromDashboard(workflowId: string, data?: Record<string, any>): void {
    const event: WorkflowTriggerEvent = {
      type: 'dashboard_action',
      data: { workflowId, ...data },
      timestamp: new Date()
    };
    
    this.emit('dashboard:workflow:trigger', event);
    this.emit('page:navigate', { to: '/trading', workflow: workflowId });
  }

  connectPages(): void {
    // Establish connection between dashboard and trading pages
    this.emit('pages:connected');
    logger.info('Pages connected for workflow automation');
  }

  // Execution Queries
  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id);
  }

  getWorkflowExecutions(workflowId: string): WorkflowExecution[] {
    return Array.from(this.executions.values())
      .filter(exec => exec.workflowId === workflowId);
  }

  getRecentExecutions(limit: number = 10): WorkflowExecution[] {
    return Array.from(this.executions.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  // Statistics
  getWorkflowStats(workflowId: string): { executionCount: number; successRate: number; lastExecuted?: Date } {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return { executionCount: 0, successRate: 0 };
    }

    return {
      executionCount: workflow.executionCount,
      successRate: workflow.successRate,
      lastExecuted: workflow.lastExecuted
    };
  }
}

// Create singleton instance
export const workflowAutomationService = new WorkflowAutomationService();

// Initialize on import
workflowAutomationService.initialize().catch(error => {
  logger.error('Failed to initialize workflow automation service', error);
});

export default workflowAutomationService;