import { EventEmitter } from 'events';
import { TradingSignal, MarketData, TradeResult, PerformanceMetrics } from './types';
import { PortfolioSnapshot, PortfolioAlert } from './portfolioTracker';

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK' | 'DISCORD' | 'SLACK' | 'TELEGRAM';
  enabled: boolean;
  config: {
    [key: string]: any;
  };
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rateLimiting: {
    maxPerHour: number;
    maxPerDay: number;
    cooldownMinutes: number;
  };
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: AlertCondition[];
  actions: AlertAction[];
  channels: string[]; // Channel IDs
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  cooldownMinutes: number;
  maxTriggersPerDay: number;
  tags: string[];
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface AlertCondition {
  type: 'SIGNAL_CONFIDENCE' | 'PRICE_CHANGE' | 'VOLUME_SPIKE' | 'DRAWDOWN' | 'PNL_THRESHOLD' | 
        'WIN_RATE' | 'PROFIT_FACTOR' | 'POSITION_SIZE' | 'MARGIN_CALL' | 'CUSTOM';
  operator: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'NOT_EQUALS' | 'BETWEEN' | 'CONTAINS';
  value: number | string | { min: number; max: number };
  timeframe?: string; // For time-based conditions
  symbol?: string; // For symbol-specific conditions
  market?: string; // For market-specific conditions
}

export interface AlertAction {
  type: 'NOTIFY' | 'PAUSE_TRADING' | 'CLOSE_POSITIONS' | 'ADJUST_RISK' | 'LOG' | 'WEBHOOK';
  config: {
    [key: string]: any;
  };
}

export interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
  data: any;
  channels: string[];
  status: 'PENDING' | 'SENT' | 'FAILED' | 'ACKNOWLEDGED';
  deliveryStatus: {
    [channelId: string]: {
      status: 'PENDING' | 'SENT' | 'FAILED';
      timestamp?: Date;
      error?: string;
      retryCount: number;
    };
  };
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

export interface AlertTemplate {
  id: string;
  name: string;
  type: 'SIGNAL' | 'TRADE' | 'PORTFOLIO' | 'RISK' | 'SYSTEM';
  title: string;
  message: string;
  variables: string[]; // Available template variables
  channels: string[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AlertMetrics {
  totalAlerts: number;
  alertsByPriority: { [priority: string]: number };
  alertsByChannel: { [channel: string]: number };
  deliveryRate: number;
  averageDeliveryTime: number;
  failedDeliveries: number;
  acknowledgedAlerts: number;
  topTriggeredRules: { ruleId: string; ruleName: string; count: number }[];
  recentAlerts: Alert[];
}

export class AdvancedAlertSystem extends EventEmitter {
  private channels: Map<string, NotificationChannel> = new Map();
  private rules: Map<string, AlertRule> = new Map();
  private alerts: Alert[] = [];
  private templates: Map<string, AlertTemplate> = new Map();
  
  private isRunning: boolean = false;
  private processingQueue: Alert[] = [];
  private rateLimitTracking: Map<string, { count: number; lastReset: Date }> = new Map();
  private deliveryMetrics: Map<string, { sent: number; failed: number; totalTime: number }> = new Map();
  
  constructor() {
    super();
    this.initializeDefaultChannels();
    this.initializeDefaultRules();
    this.initializeDefaultTemplates();
    
    console.log('Advanced Alert System initialized');
  }

  /**
   * Initialize default notification channels
   */
  private initializeDefaultChannels(): void {
    // Email channel
    this.addChannel({
      id: 'email_default',
      name: 'Email Notifications',
      type: 'EMAIL',
      enabled: true,
      config: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT || '587'),
        smtpUser: process.env.SMTP_USER || '',
        smtpPass: process.env.SMTP_PASS || '',
        fromEmail: process.env.FROM_EMAIL || 'alerts@kairo.trading',
        toEmail: process.env.TO_EMAIL || ''
      },
      priority: 'MEDIUM',
      rateLimiting: {
        maxPerHour: 50,
        maxPerDay: 200,
        cooldownMinutes: 1
      }
    });
    
    // Discord webhook
    this.addChannel({
      id: 'discord_default',
      name: 'Discord Alerts',
      type: 'DISCORD',
      enabled: true,
      config: {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
        username: 'KAIRO Trading Bot',
        avatarUrl: 'https://kairo.trading/logo.png'
      },
      priority: 'HIGH',
      rateLimiting: {
        maxPerHour: 100,
        maxPerDay: 500,
        cooldownMinutes: 0
      }
    });
    
    // Webhook channel
    this.addChannel({
      id: 'webhook_default',
      name: 'Custom Webhook',
      type: 'WEBHOOK',
      enabled: false,
      config: {
        url: process.env.WEBHOOK_URL || '',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WEBHOOK_TOKEN || ''}`
        }
      },
      priority: 'MEDIUM',
      rateLimiting: {
        maxPerHour: 200,
        maxPerDay: 1000,
        cooldownMinutes: 0
      }
    });
    
    // Push notification channel
    this.addChannel({
      id: 'push_default',
      name: 'Push Notifications',
      type: 'PUSH',
      enabled: true,
      config: {
        serviceKey: process.env.PUSH_SERVICE_KEY || '',
        deviceTokens: (process.env.PUSH_DEVICE_TOKENS || '').split(',').filter(t => t.length > 0)
      },
      priority: 'HIGH',
      rateLimiting: {
        maxPerHour: 100,
        maxPerDay: 300,
        cooldownMinutes: 0
      }
    });
    
    console.log(`Initialized ${this.channels.size} notification channels`);
  }

  /**
   * Initialize default alert rules
   */
  private initializeDefaultRules(): void {
    // High confidence signal alert
    this.addRule({
      id: 'high_confidence_signal',
      name: 'High Confidence Trading Signal',
      description: 'Alert when a high confidence trading signal is generated',
      enabled: true,
      conditions: [
        {
          type: 'SIGNAL_CONFIDENCE',
          operator: 'GREATER_THAN',
          value: 0.85
        }
      ],
      actions: [
        {
          type: 'NOTIFY',
          config: {
            template: 'high_confidence_signal'
          }
        }
      ],
      channels: ['discord_default', 'push_default'],
      priority: 'HIGH',
      cooldownMinutes: 5,
      maxTriggersPerDay: 50,
      tags: ['signals', 'high-confidence'],
      createdAt: new Date(),
      triggerCount: 0
    });
    
    // Drawdown warning
    this.addRule({
      id: 'drawdown_warning',
      name: 'Portfolio Drawdown Warning',
      description: 'Alert when portfolio drawdown exceeds threshold',
      enabled: true,
      conditions: [
        {
          type: 'DRAWDOWN',
          operator: 'GREATER_THAN',
          value: 10
        }
      ],
      actions: [
        {
          type: 'NOTIFY',
          config: {
            template: 'drawdown_warning'
          }
        },
        {
          type: 'ADJUST_RISK',
          config: {
            action: 'reduce_position_sizes',
            percentage: 50
          }
        }
      ],
      channels: ['email_default', 'discord_default', 'push_default'],
      priority: 'CRITICAL',
      cooldownMinutes: 30,
      maxTriggersPerDay: 10,
      tags: ['risk', 'drawdown'],
      createdAt: new Date(),
      triggerCount: 0
    });
    
    // Profit target reached
    this.addRule({
      id: 'profit_target',
      name: 'Profit Target Reached',
      description: 'Alert when daily profit target is reached',
      enabled: true,
      conditions: [
        {
          type: 'PNL_THRESHOLD',
          operator: 'GREATER_THAN',
          value: 5, // 5% daily profit
          timeframe: '1d'
        }
      ],
      actions: [
        {
          type: 'NOTIFY',
          config: {
            template: 'profit_target_reached'
          }
        }
      ],
      channels: ['discord_default', 'push_default'],
      priority: 'MEDIUM',
      cooldownMinutes: 60,
      maxTriggersPerDay: 5,
      tags: ['profit', 'target'],
      createdAt: new Date(),
      triggerCount: 0
    });
    
    // Large position alert
    this.addRule({
      id: 'large_position',
      name: 'Large Position Alert',
      description: 'Alert when a position exceeds size threshold',
      enabled: true,
      conditions: [
        {
          type: 'POSITION_SIZE',
          operator: 'GREATER_THAN',
          value: 10 // 10% of portfolio
        }
      ],
      actions: [
        {
          type: 'NOTIFY',
          config: {
            template: 'large_position_alert'
          }
        }
      ],
      channels: ['email_default', 'discord_default'],
      priority: 'MEDIUM',
      cooldownMinutes: 15,
      maxTriggersPerDay: 20,
      tags: ['position', 'risk'],
      createdAt: new Date(),
      triggerCount: 0
    });
    
    console.log(`Initialized ${this.rules.size} alert rules`);
  }

  /**
   * Initialize default alert templates
   */
  private initializeDefaultTemplates(): void {
    this.addTemplate({
      id: 'high_confidence_signal',
      name: 'High Confidence Signal',
      type: 'SIGNAL',
      title: '🚀 High Confidence Signal: {{symbol}}',
      message: `**High Confidence Trading Signal Detected**

📊 **Symbol:** {symbol}
📈 **Signal:** {signal}
🎯 **Confidence:** {confidence}%
💰 **Entry Price:** \${entryPrice}
🛡️ **Stop Loss:** \${stopLoss}
🎯 **Take Profit:** \${takeProfit}
⚡ **Risk/Reward:** {riskReward}
🕒 **Time:** {timestamp}

*GainzAlgo V2 - Targeting 75%+ Win Rate*`,
      variables: ['symbol', 'signal', 'confidence', 'entryPrice', 'stopLoss', 'takeProfit', 'riskReward', 'timestamp'],
      channels: ['discord_default', 'push_default'],
      priority: 'HIGH'
    });
    
    this.addTemplate({
      id: 'drawdown_warning',
      name: 'Drawdown Warning',
      type: 'RISK',
      title: '⚠️ Portfolio Drawdown Alert',
      message: `**Portfolio Drawdown Warning**

📉 **Current Drawdown:** {drawdown}%
💰 **Portfolio Value:** \${portfolioValue}
📊 **Total P&L:** {totalPnL}%
🔴 **Peak Value:** \${peakValue}

⚠️ **Risk management measures have been activated.**

*Please review your positions and consider reducing risk exposure.*`,
      variables: ['drawdown', 'portfolioValue', 'totalPnL', 'peakValue'],
      channels: ['email_default', 'discord_default', 'push_default'],
      priority: 'CRITICAL'
    });
    
    this.addTemplate({
      id: 'profit_target_reached',
      name: 'Profit Target Reached',
      type: 'PORTFOLIO',
      title: '🎉 Daily Profit Target Achieved!',
      message: `**Congratulations! Daily Profit Target Reached**

💰 **Daily P&L:** +{dailyPnL}%
📈 **Portfolio Value:** \${portfolioValue}
🎯 **Target:** {target}%
📊 **Win Rate Today:** {winRate}%
🏆 **Profit Factor:** {profitFactor}

*Excellent trading performance! Consider taking profits or reducing risk.*`,
      variables: ['dailyPnL', 'portfolioValue', 'target', 'winRate', 'profitFactor'],
      channels: ['discord_default', 'push_default'],
      priority: 'MEDIUM'
    });
    
    this.addTemplate({
      id: 'large_position_alert',
      name: 'Large Position Alert',
      type: 'RISK',
      title: '📊 Large Position Alert: {symbol}',
      message: `**Large Position Size Detected**

📊 **Symbol:** {symbol}
💰 **Position Size:** {positionSize}% of portfolio
📈 **Position Value:** \${positionValue}
🔄 **Side:** {side}
📉 **Unrealized P&L:** {unrealizedPnL}%

⚠️ **This position exceeds the recommended size threshold.**`,
      variables: ['symbol', 'positionSize', 'positionValue', 'side', 'unrealizedPnL'],
      channels: ['email_default', 'discord_default'],
      priority: 'MEDIUM'
    });
    
    this.addTemplate({
      id: 'trade_executed',
      name: 'Trade Executed',
      type: 'TRADE',
      title: '✅ Trade Executed: {{symbol}}',
      message: `**Trade Execution Confirmation**

📊 **Symbol:** {symbol}
🔄 **Action:** {action}
💰 **Price:** \${price}
📏 **Quantity:** {quantity}
💵 **Value:** \${value}
🕒 **Time:** {timestamp}

*Trade has been successfully executed.*`,
      variables: ['symbol', 'action', 'price', 'quantity', 'value', 'timestamp'],
      channels: ['discord_default'],
      priority: 'LOW'
    });
    
    console.log(`Initialized ${this.templates.size} alert templates`);
  }

  /**
   * Start the alert system
   */
  start(): void {
    if (this.isRunning) {
      console.log('Alert system already running');
      return;
    }
    
    this.isRunning = true;
    console.log('🚨 Advanced Alert System started');
    
    // Start processing queue
    this.startQueueProcessor();
    
    // Start rate limit reset timer
    this.startRateLimitReset();
    
    this.emit('systemStarted', { timestamp: new Date() });
  }

  /**
   * Stop the alert system
   */
  stop(): void {
    this.isRunning = false;
    console.log('⏹️ Advanced Alert System stopped');
    this.emit('systemStopped', { timestamp: new Date() });
  }

  /**
   * Process trading signal for alerts
   */
  async processSignal(signal: TradingSignal): Promise<void> {
    if (!this.isRunning) return;
    
    console.log(`🔍 Processing signal for alerts: ${signal.symbol} ${signal.signal}`);
    
    // Check all rules against the signal
    for (const rule of Array.from(this.rules.values())) {
      if (!rule.enabled) continue;
      
      if (await this.evaluateRule(rule, { type: 'signal', data: signal })) {
        await this.triggerAlert(rule, signal, 'signal');
      }
    }
  }

  /**
   * Process trade result for alerts
   */
  async processTrade(trade: TradeResult): Promise<void> {
    if (!this.isRunning) return;
    
    console.log(`🔍 Processing trade for alerts: ${trade.signal.symbol}`);
    
    // Check all rules against the trade
    for (const rule of Array.from(this.rules.values())) {
      if (!rule.enabled) continue;
      
      if (await this.evaluateRule(rule, { type: 'trade', data: trade })) {
        await this.triggerAlert(rule, trade, 'trade');
      }
    }
  }

  /**
   * Process portfolio snapshot for alerts
   */
  async processPortfolio(snapshot: PortfolioSnapshot): Promise<void> {
    if (!this.isRunning) return;
    
    // Check all rules against the portfolio
    for (const rule of Array.from(this.rules.values())) {
      if (!rule.enabled) continue;
      
      if (await this.evaluateRule(rule, { type: 'portfolio', data: snapshot })) {
        await this.triggerAlert(rule, snapshot, 'portfolio');
      }
    }
  }

  /**
   * Evaluate rule conditions
   */
  private async evaluateRule(rule: AlertRule, context: { type: string; data: any }): Promise<boolean> {
    // Check cooldown
    if (rule.lastTriggered) {
      const cooldownMs = rule.cooldownMinutes * 60 * 1000;
      if (Date.now() - rule.lastTriggered.getTime() < cooldownMs) {
        return false;
      }
    }
    
    // Check daily trigger limit
    const today = new Date().toDateString();
    const todayTriggers = this.alerts.filter(alert => 
      alert.ruleId === rule.id && 
      alert.timestamp.toDateString() === today
    ).length;
    
    if (todayTriggers >= rule.maxTriggersPerDay) {
      return false;
    }
    
    // Evaluate all conditions
    for (const condition of rule.conditions) {
      if (!await this.evaluateCondition(condition, context)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Evaluate individual condition
   */
  private async evaluateCondition(condition: AlertCondition, context: { type: string; data: any }): Promise<boolean> {
    const { type, data } = context;
    
    switch (condition.type) {
      case 'SIGNAL_CONFIDENCE':
        if (type === 'signal') {
          return this.compareValues(data.confidence * 100, condition.operator, condition.value);
        }
        break;
        
      case 'PRICE_CHANGE':
        if (type === 'signal' || type === 'trade') {
          const changePercent = Math.abs(data.change24h || 0);
          return this.compareValues(changePercent, condition.operator, condition.value);
        }
        break;
        
      case 'DRAWDOWN':
        if (type === 'portfolio') {
          return this.compareValues(data.drawdown, condition.operator, condition.value);
        }
        break;
        
      case 'PNL_THRESHOLD':
        if (type === 'portfolio') {
          const pnlPercent = condition.timeframe === '1d' ? data.dailyPnL / data.totalValue * 100 : data.totalPnLPercent;
          return this.compareValues(Math.abs(pnlPercent), condition.operator, condition.value);
        }
        break;
        
      case 'POSITION_SIZE':
        if (type === 'portfolio') {
          const maxPositionPercent = Math.max(...data.positions.map((p: any) => (p.value / data.totalValue) * 100));
          return this.compareValues(maxPositionPercent, condition.operator, condition.value);
        }
        break;
        
      case 'WIN_RATE':
        if (type === 'portfolio') {
          return this.compareValues(data.riskMetrics.winRate, condition.operator, condition.value);
        }
        break;
        
      case 'PROFIT_FACTOR':
        if (type === 'portfolio') {
          return this.compareValues(data.riskMetrics.profitFactor, condition.operator, condition.value);
        }
        break;
    }
    
    return false;
  }

  /**
   * Compare values based on operator
   */
  private compareValues(actual: number, operator: string, expected: number | string | { min: number; max: number }): boolean {
    switch (operator) {
      case 'GREATER_THAN':
        return actual > (expected as number);
      case 'LESS_THAN':
        return actual < (expected as number);
      case 'EQUALS':
        return actual === (expected as number);
      case 'NOT_EQUALS':
        return actual !== (expected as number);
      case 'BETWEEN':
        const range = expected as { min: number; max: number };
        return actual >= range.min && actual <= range.max;
      default:
        return false;
    }
  }

  /**
   * Trigger alert
   */
  private async triggerAlert(rule: AlertRule, data: any, dataType: string): Promise<void> {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get template
    const template = this.getTemplateForRule(rule, dataType);
    
    // Generate alert content
    const { title, message } = this.generateAlertContent(template, data, dataType);
    
    // Create alert
    const alert: Alert = {
      id: alertId,
      ruleId: rule.id,
      ruleName: rule.name,
      title,
      message,
      priority: rule.priority,
      timestamp: new Date(),
      data,
      channels: rule.channels,
      status: 'PENDING',
      deliveryStatus: {}
    };
    
    // Initialize delivery status for each channel
    rule.channels.forEach(channelId => {
      alert.deliveryStatus[channelId] = {
        status: 'PENDING',
        retryCount: 0
      };
    });
    
    // Add to alerts history
    this.alerts.push(alert);
    
    // Limit alerts history
    if (this.alerts.length > 10000) {
      this.alerts = this.alerts.slice(-5000);
    }
    
    // Update rule trigger info
    rule.lastTriggered = new Date();
    rule.triggerCount++;
    
    // Add to processing queue
    this.processingQueue.push(alert);
    
    console.log(`🚨 Alert triggered: ${rule.name} (${alert.id})`);
    this.emit('alertTriggered', { alert, rule });
  }

  /**
   * Get template for rule
   */
  private getTemplateForRule(rule: AlertRule, dataType: string): AlertTemplate {
    // Try to get template from rule action config
    const notifyAction = rule.actions.find(action => action.type === 'NOTIFY');
    if (notifyAction?.config?.template) {
      const template = this.templates.get(notifyAction.config.template);
      if (template) return template;
    }
    
    // Fallback to default template based on data type
    const defaultTemplateId = dataType === 'signal' ? 'high_confidence_signal' : 
                             dataType === 'trade' ? 'trade_executed' : 
                             'drawdown_warning';
    
    const template = this.templates.get(defaultTemplateId);
    if (template) return template;
    
    // Fallback to first available template
    const firstTemplate = Array.from(this.templates.values())[0];
    return firstTemplate || {
      id: 'default',
      name: 'Default Template',
      type: 'SYSTEM',
      title: 'Alert: {{title}}',
      message: '{{message}}',
      variables: [],
      channels: [],
      priority: 'MEDIUM'
    };
  }

  /**
   * Generate alert content from template
   */
  private generateAlertContent(template: AlertTemplate, data: any, dataType: string): { title: string; message: string } {
    let title = template.title;
    let message = template.message;
    
    // Replace template variables
    const variables = this.extractVariables(data, dataType);
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      title = title.replace(new RegExp(placeholder, 'g'), String(value));
      message = message.replace(new RegExp(placeholder, 'g'), String(value));
    }
    
    return { title, message };
  }

  /**
   * Extract variables from data
   */
  private extractVariables(data: any, dataType: string): { [key: string]: any } {
    const variables: { [key: string]: any } = {};
    
    if (dataType === 'signal') {
      variables.symbol = data.symbol || 'UNKNOWN';
      variables.signal = data.signal || 'UNKNOWN';
      variables.confidence = ((data.confidence || 0) * 100).toFixed(1);
      variables.entryPrice = (data.entryPrice || 0).toFixed(4);
      variables.stopLoss = (data.stopLoss || 0).toFixed(4);
      variables.takeProfit = (data.takeProfit || 0).toFixed(4);
      variables.riskReward = (data.riskReward || 0).toFixed(2);
      variables.timestamp = (data.timestamp || new Date()).toLocaleString();
    } else if (dataType === 'trade') {
      variables.symbol = data.signal?.symbol || 'UNKNOWN';
      variables.action = data.signal?.signal || 'UNKNOWN';
      variables.price = (data.entryPrice || 0).toFixed(4);
      variables.quantity = data.quantity || 0;
      variables.value = ((data.entryPrice || 0) * (data.quantity || 0)).toFixed(2);
      variables.timestamp = (data.entryTime || new Date()).toLocaleString();
    } else if (dataType === 'portfolio') {
      variables.drawdown = (data.drawdown || 0).toFixed(2);
      variables.portfolioValue = (data.totalValue || 0).toFixed(2);
      variables.totalPnL = (data.totalPnLPercent || 0).toFixed(2);
      variables.dailyPnL = ((data.dailyPnL || 0) / (data.totalValue || 1) * 100).toFixed(2);
      variables.winRate = (data.riskMetrics?.winRate || 0).toFixed(1);
      variables.profitFactor = (data.riskMetrics?.profitFactor || 0).toFixed(2);
    }
    
    return variables;
  }

  /**
   * Start queue processor
   */
  private startQueueProcessor(): void {
    const processQueue = async () => {
      if (!this.isRunning) return;
      
      while (this.processingQueue.length > 0) {
        const alert = this.processingQueue.shift();
        if (alert) {
          await this.deliverAlert(alert);
        }
      }
      
      // Process again in 1 second
      setTimeout(processQueue, 1000);
    };
    
    processQueue();
  }

  /**
   * Deliver alert to all channels
   */
  private async deliverAlert(alert: Alert): Promise<void> {
    console.log(`📤 Delivering alert: ${alert.title}`);
    
    const deliveryPromises = alert.channels.map(async (channelId) => {
      const channel = this.channels.get(channelId);
      if (!channel || !channel.enabled) {
        alert.deliveryStatus[channelId].status = 'FAILED';
        alert.deliveryStatus[channelId].error = 'Channel not found or disabled';
        return;
      }
      
      // Check rate limiting
      if (!this.checkRateLimit(channelId)) {
        alert.deliveryStatus[channelId].status = 'FAILED';
        alert.deliveryStatus[channelId].error = 'Rate limit exceeded';
        return;
      }
      
      try {
        const startTime = Date.now();
        await this.sendToChannel(channel, alert);
        const deliveryTime = Date.now() - startTime;
        
        alert.deliveryStatus[channelId].status = 'SENT';
        alert.deliveryStatus[channelId].timestamp = new Date();
        
        // Update metrics
        this.updateDeliveryMetrics(channelId, true, deliveryTime);
        
        console.log(`✅ Alert delivered to ${channel.name}`);
        
      } catch (error) {
        alert.deliveryStatus[channelId].status = 'FAILED';
        alert.deliveryStatus[channelId].error = error instanceof Error ? error.message : 'Unknown error';
        alert.deliveryStatus[channelId].retryCount++;
        
        // Update metrics
        this.updateDeliveryMetrics(channelId, false, 0);
        
        console.error(`❌ Failed to deliver alert to ${channel.name}:`, error);
      }
    });
    
    await Promise.all(deliveryPromises);
    
    // Update alert status
    const allSent = Object.values(alert.deliveryStatus).every(status => status.status === 'SENT');
    const anyFailed = Object.values(alert.deliveryStatus).some(status => status.status === 'FAILED');
    
    alert.status = allSent ? 'SENT' : anyFailed ? 'FAILED' : 'PENDING';
    
    this.emit('alertDelivered', { alert });
  }

  /**
   * Send alert to specific channel
   */
  private async sendToChannel(channel: NotificationChannel, alert: Alert): Promise<void> {
    switch (channel.type) {
      case 'EMAIL':
        await this.sendEmail(channel, alert);
        break;
      case 'DISCORD':
        await this.sendDiscord(channel, alert);
        break;
      case 'WEBHOOK':
        await this.sendWebhook(channel, alert);
        break;
      case 'PUSH':
        await this.sendPush(channel, alert);
        break;
      case 'SMS':
        await this.sendSMS(channel, alert);
        break;
      case 'SLACK':
        await this.sendSlack(channel, alert);
        break;
      case 'TELEGRAM':
        await this.sendTelegram(channel, alert);
        break;
      default:
        throw new Error(`Unsupported channel type: ${channel.type}`);
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(channel: NotificationChannel, alert: Alert): Promise<void> {
    // Mock email sending - replace with actual email service
    console.log(`📧 Sending email: ${alert.title}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In real implementation, use nodemailer or similar
    /*
    const transporter = nodemailer.createTransporter({
      host: channel.config.smtpHost,
      port: channel.config.smtpPort,
      auth: {
        user: channel.config.smtpUser,
        pass: channel.config.smtpPass
      }
    });
    
    await transporter.sendMail({
      from: channel.config.fromEmail,
      to: channel.config.toEmail,
      subject: alert.title,
      text: alert.message,
      html: alert.message.replace(/\n/g, '<br>')
    });
    */
  }

  /**
   * Send Discord notification
   */
  private async sendDiscord(channel: NotificationChannel, alert: Alert): Promise<void> {
    if (!channel.config.webhookUrl) {
      throw new Error('Discord webhook URL not configured');
    }
    
    const embed = {
      title: alert.title,
      description: alert.message,
      color: this.getPriorityColor(alert.priority),
      timestamp: alert.timestamp.toISOString(),
      footer: {
        text: 'KAIRO Trading Bot'
      }
    };
    
    const payload = {
      username: channel.config.username || 'KAIRO Trading Bot',
      avatar_url: channel.config.avatarUrl,
      embeds: [embed]
    };
    
    const response = await fetch(channel.config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Send webhook notification
   */
  private async sendWebhook(channel: NotificationChannel, alert: Alert): Promise<void> {
    if (!channel.config.url) {
      throw new Error('Webhook URL not configured');
    }
    
    const payload = {
      alert: {
        id: alert.id,
        title: alert.title,
        message: alert.message,
        priority: alert.priority,
        timestamp: alert.timestamp.toISOString(),
        data: alert.data
      }
    };
    
    const response = await fetch(channel.config.url, {
      method: channel.config.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...channel.config.headers
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Send push notification
   */
  private async sendPush(channel: NotificationChannel, alert: Alert): Promise<void> {
    // Mock push notification - replace with actual push service
    console.log(`📱 Sending push notification: ${alert.title}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // In real implementation, use Firebase Cloud Messaging or similar
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(channel: NotificationChannel, alert: Alert): Promise<void> {
    // Mock SMS sending - replace with actual SMS service
    console.log(`📱 Sending SMS: ${alert.title}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In real implementation, use Twilio or similar
  }

  /**
   * Send Slack notification
   */
  private async sendSlack(channel: NotificationChannel, alert: Alert): Promise<void> {
    // Mock Slack sending - replace with actual Slack API
    console.log(`💬 Sending Slack message: ${alert.title}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Send Telegram notification
   */
  private async sendTelegram(channel: NotificationChannel, alert: Alert): Promise<void> {
    // Mock Telegram sending - replace with actual Telegram Bot API
    console.log(`📨 Sending Telegram message: ${alert.title}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Get priority color for Discord embeds
   */
  private getPriorityColor(priority: string): number {
    switch (priority) {
      case 'LOW': return 0x00ff00; // Green
      case 'MEDIUM': return 0xffff00; // Yellow
      case 'HIGH': return 0xff8000; // Orange
      case 'CRITICAL': return 0xff0000; // Red
      default: return 0x808080; // Gray
    }
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(channelId: string): boolean {
    const channel = this.channels.get(channelId);
    if (!channel) return false;
    
    const now = new Date();
    const tracking = this.rateLimitTracking.get(channelId);
    
    if (!tracking) {
      this.rateLimitTracking.set(channelId, { count: 1, lastReset: now });
      return true;
    }
    
    // Reset hourly count
    const hoursSinceReset = (now.getTime() - tracking.lastReset.getTime()) / (1000 * 60 * 60);
    if (hoursSinceReset >= 1) {
      tracking.count = 1;
      tracking.lastReset = now;
      return true;
    }
    
    // Check limits
    if (tracking.count >= channel.rateLimiting.maxPerHour) {
      return false;
    }
    
    tracking.count++;
    return true;
  }

  /**
   * Update delivery metrics
   */
  private updateDeliveryMetrics(channelId: string, success: boolean, deliveryTime: number): void {
    let metrics = this.deliveryMetrics.get(channelId);
    if (!metrics) {
      metrics = { sent: 0, failed: 0, totalTime: 0 };
      this.deliveryMetrics.set(channelId, metrics);
    }
    
    if (success) {
      metrics.sent++;
      metrics.totalTime += deliveryTime;
    } else {
      metrics.failed++;
    }
  }

  /**
   * Start rate limit reset timer
   */
  private startRateLimitReset(): void {
    setInterval(() => {
      if (!this.isRunning) return;
      
      const now = new Date();
      for (const [channelId, tracking] of Array.from(this.rateLimitTracking.entries())) {
        const hoursSinceReset = (now.getTime() - tracking.lastReset.getTime()) / (1000 * 60 * 60);
        if (hoursSinceReset >= 1) {
          tracking.count = 0;
          tracking.lastReset = now;
        }
      }
    }, 60000); // Check every minute
  }

  // Public API methods

  /**
   * Add notification channel
   */
  addChannel(channel: NotificationChannel): void {
    this.channels.set(channel.id, channel);
    console.log(`Added notification channel: ${channel.name} (${channel.type})`);
    this.emit('channelAdded', channel);
  }

  /**
   * Remove notification channel
   */
  removeChannel(channelId: string): boolean {
    const removed = this.channels.delete(channelId);
    if (removed) {
      console.log(`Removed notification channel: ${channelId}`);
      this.emit('channelRemoved', { channelId });
    }
    return removed;
  }

  /**
   * Update notification channel
   */
  updateChannel(channelId: string, updates: Partial<NotificationChannel>): boolean {
    const channel = this.channels.get(channelId);
    if (!channel) return false;
    
    Object.assign(channel, updates);
    console.log(`Updated notification channel: ${channelId}`);
    this.emit('channelUpdated', channel);
    return true;
  }

  /**
   * Get notification channels
   */
  getChannels(): NotificationChannel[] {
    return Array.from(this.channels.values());
  }

  /**
   * Add alert rule
   */
  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
    console.log(`Added alert rule: ${rule.name}`);
    this.emit('ruleAdded', rule);
  }

  /**
   * Remove alert rule
   */
  removeRule(ruleId: string): boolean {
    const removed = this.rules.delete(ruleId);
    if (removed) {
      console.log(`Removed alert rule: ${ruleId}`);
      this.emit('ruleRemoved', { ruleId });
    }
    return removed;
  }

  /**
   * Update alert rule
   */
  updateRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) return false;
    
    Object.assign(rule, updates);
    console.log(`Updated alert rule: ${ruleId}`);
    this.emit('ruleUpdated', rule);
    return true;
  }

  /**
   * Get alert rules
   */
  getRules(): AlertRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Add alert template
   */
  addTemplate(template: AlertTemplate): void {
    this.templates.set(template.id, template);
    console.log(`Added alert template: ${template.name}`);
    this.emit('templateAdded', template);
  }

  /**
   * Remove alert template
   */
  removeTemplate(templateId: string): boolean {
    const removed = this.templates.delete(templateId);
    if (removed) {
      console.log(`Removed alert template: ${templateId}`);
      this.emit('templateRemoved', { templateId });
    }
    return removed;
  }

  /**
   * Get alert templates
   */
  getTemplates(): AlertTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get alerts
   */
  getAlerts(limit?: number, filter?: { priority?: string; status?: string; ruleId?: string }): Alert[] {
    let filteredAlerts = [...this.alerts];
    
    if (filter) {
      if (filter.priority) {
        filteredAlerts = filteredAlerts.filter(alert => alert.priority === filter.priority);
      }
      if (filter.status) {
        filteredAlerts = filteredAlerts.filter(alert => alert.status === filter.status);
      }
      if (filter.ruleId) {
        filteredAlerts = filteredAlerts.filter(alert => alert.ruleId === filter.ruleId);
      }
    }
    
    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? filteredAlerts.slice(0, limit) : filteredAlerts;
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string, acknowledgedBy?: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;
    
    alert.status = 'ACKNOWLEDGED';
    alert.acknowledgedAt = new Date();
    alert.acknowledgedBy = acknowledgedBy;
    
    console.log(`Alert acknowledged: ${alertId}`);
    this.emit('alertAcknowledged', alert);
    return true;
  }

  /**
   * Test channel
   */
  async testChannel(channelId: string): Promise<boolean> {
    const channel = this.channels.get(channelId);
    if (!channel) return false;
    
    const testAlert: Alert = {
      id: 'test_alert',
      ruleId: 'test_rule',
      ruleName: 'Test Rule',
      title: '🧪 Test Alert',
      message: 'This is a test alert to verify channel configuration.',
      priority: 'LOW',
      timestamp: new Date(),
      data: {},
      channels: [channelId],
      status: 'PENDING',
      deliveryStatus: {
        [channelId]: {
          status: 'PENDING',
          retryCount: 0
        }
      }
    };
    
    try {
      await this.sendToChannel(channel, testAlert);
      console.log(`✅ Test alert sent successfully to ${channel.name}`);
      return true;
    } catch (error) {
      console.error(`❌ Test alert failed for ${channel.name}:`, error);
      return false;
    }
  }

  /**
   * Get alert metrics
   */
  getMetrics(): AlertMetrics {
    const totalAlerts = this.alerts.length;
    const alertsByPriority: { [priority: string]: number } = {};
    const alertsByChannel: { [channel: string]: number } = {};
    
    // Calculate metrics
    this.alerts.forEach(alert => {
      // Priority breakdown
      alertsByPriority[alert.priority] = (alertsByPriority[alert.priority] || 0) + 1;
      
      // Channel breakdown
      alert.channels.forEach(channelId => {
        const channel = this.channels.get(channelId);
        if (channel) {
          alertsByChannel[channel.name] = (alertsByChannel[channel.name] || 0) + 1;
        }
      });
    });
    
    // Calculate delivery rate
    const sentAlerts = this.alerts.filter(alert => alert.status === 'SENT').length;
    const deliveryRate = totalAlerts > 0 ? (sentAlerts / totalAlerts) * 100 : 0;
    
    // Calculate average delivery time
    let totalDeliveryTime = 0;
    let deliveryCount = 0;
    
    Array.from(this.deliveryMetrics.values()).forEach(metrics => {
      if (metrics.sent > 0) {
        totalDeliveryTime += metrics.totalTime;
        deliveryCount += metrics.sent;
      }
    });
    
    const averageDeliveryTime = deliveryCount > 0 ? totalDeliveryTime / deliveryCount : 0;
    
    // Failed deliveries
    const failedDeliveries = Array.from(this.deliveryMetrics.values())
      .reduce((total, metrics) => total + metrics.failed, 0);
    
    // Acknowledged alerts
    const acknowledgedAlerts = this.alerts.filter(alert => alert.status === 'ACKNOWLEDGED').length;
    
    // Top triggered rules
    const ruleStats = new Map<string, { name: string; count: number }>();
    this.alerts.forEach(alert => {
      const existing = ruleStats.get(alert.ruleId);
      if (existing) {
        existing.count++;
      } else {
        ruleStats.set(alert.ruleId, { name: alert.ruleName, count: 1 });
      }
    });
    
    const topTriggeredRules = Array.from(ruleStats.entries())
      .map(([ruleId, stats]) => ({ ruleId, ruleName: stats.name, count: stats.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Recent alerts
    const recentAlerts = this.getAlerts(20);
    
    return {
      totalAlerts,
      alertsByPriority,
      alertsByChannel,
      deliveryRate,
      averageDeliveryTime,
      failedDeliveries,
      acknowledgedAlerts,
      topTriggeredRules,
      recentAlerts
    };
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      channelsCount: this.channels.size,
      rulesCount: this.rules.size,
      templatesCount: this.templates.size,
      queueSize: this.processingQueue.length,
      totalAlerts: this.alerts.length,
      enabledChannels: Array.from(this.channels.values()).filter(c => c.enabled).length,
      enabledRules: Array.from(this.rules.values()).filter(r => r.enabled).length
    };
  }

  /**
   * Export system data
   */
  exportData() {
    return {
      channels: Array.from(this.channels.values()),
      rules: Array.from(this.rules.values()),
      templates: Array.from(this.templates.values()),
      alerts: this.alerts,
      metrics: this.getMetrics(),
      status: this.getStatus(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stop();
    this.channels.clear();
    this.rules.clear();
    this.templates.clear();
    this.alerts = [];
    this.processingQueue = [];
    this.rateLimitTracking.clear();
    this.deliveryMetrics.clear();
    this.removeAllListeners();
    console.log('Advanced Alert System destroyed');
  }
}