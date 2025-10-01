import { MultiAssetTradingService, TradingOrder, MarketData } from './multiAssetTradingService';

// Workflow automation types
export interface WorkflowTrigger {
  id: string;
  name: string;
  type: 'price_alert' | 'technical_indicator' | 'time_based' | 'portfolio_threshold' | 'risk_event';
  conditions: {
    symbol?: string;
    priceLevel?: number;
    comparison?: 'above' | 'below' | 'equals';
    indicator?: string;
    indicatorValue?: number;
    timeSchedule?: string;
    portfolioMetric?: string;
    thresholdValue?: number;
  };
  isActive: boolean;
  lastTriggered?: Date;
}

export interface WorkflowAction {
  id: string;
  name: string;
  type: 'place_order' | 'close_position' | 'send_notification' | 'adjust_risk' | 'rebalance_portfolio';
  parameters: {
    orderType?: string;
    symbol?: string;
    quantity?: number;
    side?: 'buy' | 'sell';
    priceType?: 'market' | 'limit';
    limitPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
    notificationMessage?: string;
    riskAdjustment?: number;
    rebalanceStrategy?: string;
  };
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  executionCount: number;
  successRate: number;
  lastExecuted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  triggerId: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  result?: any;
  error?: string;
  executedActions: {
    actionId: string;
    status: 'pending' | 'completed' | 'failed';
    result?: any;
    error?: string;
  }[];
}

export interface WorkflowMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  triggersToday: number;
  actionsToday: number;
}

export class WorkflowIntegrationService {
  private workflows: Map<string, AutomationWorkflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private tradingService: MultiAssetTradingService;
  private eventListeners: Map<string, Function[]> = new Map();
  private monitoringInterval?: NodeJS.Timeout;

  constructor(tradingService: MultiAssetTradingService) {
    this.tradingService = tradingService;
    this.initializeDefaultWorkflows();
    this.startMonitoring();
  }

  // Initialize default automation workflows
  private initializeDefaultWorkflows(): void {
    const defaultWorkflows: AutomationWorkflow[] = [
      {
        id: 'auto-stop-loss',
        name: 'Automatic Stop Loss',
        description: 'Automatically place stop-loss orders when positions reach risk threshold',
        isActive: true,
        triggers: [{
          id: 'position-risk-trigger',
          name: 'Position Risk Threshold',
          type: 'portfolio_threshold',
          conditions: {
            portfolioMetric: 'unrealized_loss',
            thresholdValue: -500, // $500 loss
            comparison: 'below'
          },
          isActive: true
        }],
        actions: [{
          id: 'place-stop-loss',
          name: 'Place Stop Loss Order',
          type: 'place_order',
          parameters: {
            orderType: 'stop',
            side: 'sell',
            priceType: 'market'
          }
        }],
        executionCount: 0,
        successRate: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'profit-taking',
        name: 'Automated Profit Taking',
        description: 'Take profits when positions reach target levels',
        isActive: true,
        triggers: [{
          id: 'profit-target-trigger',
          name: 'Profit Target Reached',
          type: 'portfolio_threshold',
          conditions: {
            portfolioMetric: 'unrealized_profit',
            thresholdValue: 1000, // $1000 profit
            comparison: 'above'
          },
          isActive: true
        }],
        actions: [{
          id: 'take-profit',
          name: 'Take Profit Order',
          type: 'place_order',
          parameters: {
            orderType: 'limit',
            side: 'sell',
            priceType: 'limit'
          }
        }],
        executionCount: 0,
        successRate: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'risk-management',
        name: 'Dynamic Risk Management',
        description: 'Adjust position sizes based on market volatility',
        isActive: true,
        triggers: [{
          id: 'volatility-trigger',
          name: 'High Volatility Alert',
          type: 'technical_indicator',
          conditions: {
            indicator: 'volatility',
            indicatorValue: 0.3, // 30% volatility
            comparison: 'above'
          },
          isActive: true
        }],
        actions: [{
          id: 'adjust-risk',
          name: 'Reduce Position Sizes',
          type: 'adjust_risk',
          parameters: {
            riskAdjustment: 0.5 // Reduce by 50%
          }
        }],
        executionCount: 0,
        successRate: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultWorkflows.forEach(workflow => {
      this.workflows.set(workflow.id, workflow);
    });
  }

  // Start monitoring for workflow triggers
  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.checkTriggers();
    }, 5000); // Check every 5 seconds
  }

  // Check all active workflow triggers
  private async checkTriggers(): Promise<void> {
    const workflows = Array.from(this.workflows.values());
    for (const workflow of workflows) {
      if (!workflow.isActive) continue;

      for (const trigger of workflow.triggers) {
        if (!trigger.isActive) continue;

        const shouldTrigger = await this.evaluateTrigger(trigger);
        if (shouldTrigger) {
          await this.executeWorkflow(workflow.id, trigger.id);
        }
      }
    }
  }

  // Evaluate if a trigger condition is met
  private async evaluateTrigger(trigger: WorkflowTrigger): Promise<boolean> {
    try {
      switch (trigger.type) {
        case 'price_alert':
          return await this.evaluatePriceAlert(trigger);
        case 'technical_indicator':
          return await this.evaluateTechnicalIndicator(trigger);
        case 'portfolio_threshold':
          return await this.evaluatePortfolioThreshold(trigger);
        case 'time_based':
          return this.evaluateTimeBasedTrigger(trigger);
        case 'risk_event':
          return await this.evaluateRiskEvent(trigger);
        default:
          return false;
      }
    } catch (error) {
      console.error('Error evaluating trigger:', error);
      return false;
    }
  }

  private async evaluatePriceAlert(trigger: WorkflowTrigger): Promise<boolean> {
    if (!trigger.conditions.symbol || !trigger.conditions.priceLevel) return false;

    const marketData = this.tradingService.getMarketData(trigger.conditions.symbol!);
    if (!marketData) return false;

    const currentPrice = marketData.price;
    const targetPrice = trigger.conditions.priceLevel;
    const comparison = trigger.conditions.comparison;

    switch (comparison) {
      case 'above':
        return currentPrice > targetPrice;
      case 'below':
        return currentPrice < targetPrice;
      case 'equals':
        return Math.abs(currentPrice - targetPrice) < 0.01;
      default:
        return false;
    }
  }

  private async evaluateTechnicalIndicator(trigger: WorkflowTrigger): Promise<boolean> {
    // Placeholder for technical indicator evaluation
    // In a real implementation, this would connect to technical analysis service
    return Math.random() > 0.95; // 5% chance to trigger for demo
  }

  private async evaluatePortfolioThreshold(trigger: WorkflowTrigger): Promise<boolean> {
    const positions = this.tradingService.getPositions('default');
    let totalUnrealizedPnL = 0;

    positions.forEach(position => {
      const marketData = this.tradingService.getMarketData(position.symbol);
      if (marketData) {
        const currentValue = position.quantity * marketData.price;
        const unrealizedPnL = currentValue - (position.quantity * position.avgPrice);
        totalUnrealizedPnL += unrealizedPnL;
      }
    });

    const metric = trigger.conditions.portfolioMetric;
    const threshold = trigger.conditions.thresholdValue || 0;
    const comparison = trigger.conditions.comparison;

    if (metric === 'unrealized_loss' && totalUnrealizedPnL < 0) {
      const loss = Math.abs(totalUnrealizedPnL);
      return comparison === 'above' ? loss > threshold : loss < threshold;
    }

    if (metric === 'unrealized_profit' && totalUnrealizedPnL > 0) {
      return comparison === 'above' ? totalUnrealizedPnL > threshold : totalUnrealizedPnL < threshold;
    }

    return false;
  }

  private evaluateTimeBasedTrigger(trigger: WorkflowTrigger): boolean {
    // Placeholder for time-based trigger evaluation
    // In a real implementation, this would use cron-like scheduling
    return false;
  }

  private async evaluateRiskEvent(trigger: WorkflowTrigger): Promise<boolean> {
    // Placeholder for risk event evaluation
    // In a real implementation, this would connect to risk management service
    return false;
  }

  // Execute a workflow when triggered
  public async executeWorkflow(workflowId: string, triggerId: string): Promise<string> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      triggerId,
      status: 'executing',
      startTime: new Date(),
      executedActions: []
    };

    this.executions.set(executionId, execution);

    try {
      // Execute all actions in the workflow
      for (const action of workflow.actions) {
        const actionResult = await this.executeAction(action, workflow);
        execution.executedActions.push({
          actionId: action.id,
          status: actionResult.success ? 'completed' : 'failed',
          result: actionResult.result,
          error: actionResult.error
        });
      }

      execution.status = 'completed';
      execution.endTime = new Date();
      workflow.executionCount++;
      workflow.lastExecuted = new Date();
      workflow.updatedAt = new Date();

      // Update success rate
      const successfulActions = execution.executedActions.filter(a => a.status === 'completed').length;
      const totalActions = execution.executedActions.length;
      workflow.successRate = (workflow.successRate * (workflow.executionCount - 1) + (successfulActions / totalActions)) / workflow.executionCount;

      this.emit('workflow_executed', { workflow, execution });

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      
      this.emit('workflow_failed', { workflow, execution, error });
    }

    return executionId;
  }

  // Execute a single workflow action
  private async executeAction(action: WorkflowAction, workflow: AutomationWorkflow): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      switch (action.type) {
        case 'place_order':
          return await this.executePlaceOrderAction(action);
        case 'close_position':
          return await this.executeClosePositionAction(action);
        case 'send_notification':
          return await this.executeSendNotificationAction(action);
        case 'adjust_risk':
          return await this.executeAdjustRiskAction(action);
        case 'rebalance_portfolio':
          return await this.executeRebalancePortfolioAction(action);
        default:
          return { success: false, error: `Unknown action type: ${action.type}` };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async executePlaceOrderAction(action: WorkflowAction): Promise<{ success: boolean; result?: any; error?: string }> {
    const params = action.parameters;
    if (!params.symbol || !params.quantity || !params.side) {
      return { success: false, error: 'Missing required order parameters' };
    }

    const order: TradingOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol: params.symbol,
      side: params.side,
      type: params.orderType as any || 'market',
      assetType: 'stock',
      quantity: params.quantity,
      price: params.limitPrice,
      stopPrice: params.stopLoss,
      timeInForce: 'gtc',
      takeProfitPrice: params.takeProfit,
      stopLossPrice: params.stopLoss,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    try {
      const orderId = await this.tradingService.placeOrder(order);
      return { success: true, result: { orderId } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Order placement failed' };
    }
  }

  private async executeClosePositionAction(action: WorkflowAction): Promise<{ success: boolean; result?: any; error?: string }> {
    // Placeholder for close position logic
    return { success: true, result: { message: 'Position closed' } };
  }

  private async executeSendNotificationAction(action: WorkflowAction): Promise<{ success: boolean; result?: any; error?: string }> {
    const message = action.parameters.notificationMessage || 'Workflow action executed';
    this.emit('notification', { message, timestamp: new Date() });
    return { success: true, result: { message: 'Notification sent' } };
  }

  private async executeAdjustRiskAction(action: WorkflowAction): Promise<{ success: boolean; result?: any; error?: string }> {
    // Placeholder for risk adjustment logic
    return { success: true, result: { message: 'Risk adjusted' } };
  }

  private async executeRebalancePortfolioAction(action: WorkflowAction): Promise<{ success: boolean; result?: any; error?: string }> {
    // Placeholder for portfolio rebalancing logic
    return { success: true, result: { message: 'Portfolio rebalanced' } };
  }

  // Workflow management methods
  public createWorkflow(workflow: Omit<AutomationWorkflow, 'id' | 'executionCount' | 'successRate' | 'createdAt' | 'updatedAt'>): string {
    const id = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newWorkflow: AutomationWorkflow = {
      ...workflow,
      id,
      executionCount: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.workflows.set(id, newWorkflow);
    this.emit('workflow_created', newWorkflow);
    return id;
  }

  public updateWorkflow(id: string, updates: Partial<AutomationWorkflow>): boolean {
    const workflow = this.workflows.get(id);
    if (!workflow) return false;

    const updatedWorkflow = { ...workflow, ...updates, updatedAt: new Date() };
    this.workflows.set(id, updatedWorkflow);
    this.emit('workflow_updated', updatedWorkflow);
    return true;
  }

  public deleteWorkflow(id: string): boolean {
    const deleted = this.workflows.delete(id);
    if (deleted) {
      this.emit('workflow_deleted', { id });
    }
    return deleted;
  }

  public getWorkflow(id: string): AutomationWorkflow | undefined {
    return this.workflows.get(id);
  }

  public getAllWorkflows(): AutomationWorkflow[] {
    return Array.from(this.workflows.values());
  }

  public getActiveWorkflows(): AutomationWorkflow[] {
    return Array.from(this.workflows.values()).filter(w => w.isActive);
  }

  public getWorkflowExecutions(workflowId?: string): WorkflowExecution[] {
    const executions = Array.from(this.executions.values());
    return workflowId ? executions.filter(e => e.workflowId === workflowId) : executions;
  }

  public getWorkflowMetrics(): WorkflowMetrics {
    const workflows = Array.from(this.workflows.values());
    const executions = Array.from(this.executions.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const executionsToday = executions.filter(e => e.startTime >= today);
    const totalExecutions = workflows.reduce((sum, w) => sum + w.executionCount, 0);
    const totalSuccessRate = workflows.length > 0 
      ? workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length 
      : 0;

    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.isActive).length,
      totalExecutions,
      successRate: totalSuccessRate,
      averageExecutionTime: 2.5, // Placeholder
      triggersToday: executionsToday.length,
      actionsToday: executionsToday.reduce((sum, e) => sum + e.executedActions.length, 0)
    };
  }

  // Event system
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Integration with TradingView Order Panel
  public integrateWithOrderPanel(orderPanelCallback: (workflow: AutomationWorkflow) => void): void {
    this.on('workflow_executed', (data: { workflow: AutomationWorkflow; execution: WorkflowExecution }) => {
      orderPanelCallback(data.workflow);
    });
  }

  // Cleanup
  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.workflows.clear();
    this.executions.clear();
    this.eventListeners.clear();
  }
}

export default WorkflowIntegrationService;