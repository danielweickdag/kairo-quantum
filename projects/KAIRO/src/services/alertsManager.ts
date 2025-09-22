import { TradingSignal, AlertConfiguration } from './types';

export interface AlertChannel {
  type: 'PUSH' | 'EMAIL' | 'SMS' | 'WEBHOOK';
  enabled: boolean;
  config: {
    endpoint?: string;
    apiKey?: string;
    phoneNumber?: string;
    emailAddress?: string;
    webhookUrl?: string;
  };
}

export interface AlertRule {
  id: string;
  name: string;
  conditions: {
    minConfidence?: number;
    maxRiskReward?: number;
    minRiskReward?: number;
    markets?: string[];
    symbols?: string[];
    signalTypes?: ('BUY' | 'SELL')[];
    patterns?: string[];
  };
  channels: AlertChannel[];
  enabled: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  throttle: {
    enabled: boolean;
    maxAlertsPerHour: number;
    cooldownMinutes: number;
  };
}

export interface AlertHistory {
  id: string;
  ruleId: string;
  signalId: string;
  timestamp: Date;
  channel: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  message: string;
  error?: string;
}

/**
 * GainzAlgo V2 Real-time Alerts and Notifications Manager
 * Supports push notifications, email, SMS, and webhooks
 */
export class AlertsManager {
  private alertRules: Map<string, AlertRule> = new Map();
  private alertHistory: AlertHistory[] = [];
  private throttleTracker: Map<string, { count: number; lastReset: Date }> = new Map();
  private isInitialized = false;

  constructor() {
    this.initializeDefaultRules();
  }

  async initialize(): Promise<void> {
    console.log('GainzAlgo V2 Alerts Manager initializing...');
    
    // Initialize notification services
    await this.initializePushNotifications();
    await this.initializeEmailService();
    await this.initializeSMSService();
    
    this.isInitialized = true;
    console.log('Alerts Manager initialized with multi-channel support');
  }

  /**
   * Process trading signal and trigger alerts based on rules
   */
  async processSignalAlerts(signal: TradingSignal): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Alerts Manager not initialized, skipping alert processing');
      return;
    }

    try {
      // Check each alert rule
      for (const [ruleId, rule] of Array.from(this.alertRules.entries())) {
        if (!rule.enabled) continue;

        // Check if signal matches rule conditions
        if (this.matchesAlertConditions(signal, rule)) {
          // Check throttling
          if (this.isThrottled(ruleId, rule)) {
            console.log(`Alert rule ${rule.name} is throttled, skipping`);
            continue;
          }

          // Send alerts through configured channels
          await this.sendAlerts(signal, rule);
          
          // Update throttle tracker
          this.updateThrottleTracker(ruleId);
        }
      }
    } catch (error) {
      console.error('Error processing signal alerts:', error);
    }
  }

  /**
   * Add or update alert rule
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule);
    console.log(`Alert rule '${rule.name}' added/updated`);
  }

  /**
   * Remove alert rule
   */
  removeAlertRule(ruleId: string): boolean {
    const removed = this.alertRules.delete(ruleId);
    if (removed) {
      console.log(`Alert rule ${ruleId} removed`);
    }
    return removed;
  }

  /**
   * Get all alert rules
   */
  getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values());
  }

  /**
   * Get alert history with optional filtering
   */
  getAlertHistory(limit = 100, ruleId?: string): AlertHistory[] {
    let history = this.alertHistory;
    
    if (ruleId) {
      history = history.filter(alert => alert.ruleId === ruleId);
    }
    
    return history
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Send test alert to verify channel configuration
   */
  async sendTestAlert(channel: AlertChannel): Promise<boolean> {
    try {
      const testMessage = 'GainzAlgo V2 Test Alert - Your notification system is working!';
      
      switch (channel.type) {
        case 'PUSH':
          return await this.sendPushNotification(testMessage, 'Test Alert');
        case 'EMAIL':
          return await this.sendEmailAlert(testMessage, 'GainzAlgo V2 Test Alert', channel.config.emailAddress!);
        case 'SMS':
          return await this.sendSMSAlert(testMessage, channel.config.phoneNumber!);
        case 'WEBHOOK':
          return await this.sendWebhookAlert({ message: testMessage, type: 'TEST' }, channel.config.webhookUrl!);
        default:
          return false;
      }
    } catch (error) {
      console.error('Test alert failed:', error);
      return false;
    }
  }

  /**
   * Initialize default alert rules
   */
  private initializeDefaultRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'high_confidence_signals',
        name: 'High Confidence Signals (85%+)',
        conditions: {
          minConfidence: 0.85,
          minRiskReward: 2.0
        },
        channels: [
          {
            type: 'PUSH',
            enabled: true,
            config: {}
          }
        ],
        enabled: true,
        priority: 'HIGH',
        throttle: {
          enabled: true,
          maxAlertsPerHour: 10,
          cooldownMinutes: 5
        }
      },
      {
        id: 'gainzalgo_patterns',
        name: 'GainzAlgo Pattern Detected',
        conditions: {
          patterns: ['GainzAlgo_Golden_Cross_Pro', 'GainzAlgo_Breakout_King', 'GainzAlgo_Reversal_Master']
        },
        channels: [
          {
            type: 'PUSH',
            enabled: true,
            config: {}
          },
          {
            type: 'EMAIL',
            enabled: false,
            config: {
              emailAddress: 'trader@example.com'
            }
          }
        ],
        enabled: true,
        priority: 'CRITICAL',
        throttle: {
          enabled: true,
          maxAlertsPerHour: 5,
          cooldownMinutes: 10
        }
      },
      {
        id: 'crypto_opportunities',
        name: 'Crypto Trading Opportunities',
        conditions: {
          markets: ['CRYPTO'],
          minConfidence: 0.75,
          minRiskReward: 1.8
        },
        channels: [
          {
            type: 'PUSH',
            enabled: true,
            config: {}
          }
        ],
        enabled: true,
        priority: 'MEDIUM',
        throttle: {
          enabled: true,
          maxAlertsPerHour: 15,
          cooldownMinutes: 3
        }
      }
    ];

    defaultRules.forEach(rule => this.alertRules.set(rule.id, rule));
  }

  /**
   * Check if signal matches alert rule conditions
   */
  private matchesAlertConditions(signal: TradingSignal, rule: AlertRule): boolean {
    const { conditions } = rule;

    // Check confidence
    if (conditions.minConfidence && signal.confidence < conditions.minConfidence) {
      return false;
    }

    // Check risk-reward ratio
    if (conditions.minRiskReward && signal.riskReward < conditions.minRiskReward) {
      return false;
    }
    if (conditions.maxRiskReward && signal.riskReward > conditions.maxRiskReward) {
      return false;
    }

    // Check markets
    if (conditions.markets && !conditions.markets.includes(signal.market)) {
      return false;
    }

    // Check symbols
    if (conditions.symbols && !conditions.symbols.includes(signal.symbol)) {
      return false;
    }

    // Check signal types
    if (conditions.signalTypes && signal.signal !== 'HOLD' && !conditions.signalTypes.includes(signal.signal as 'BUY' | 'SELL')) {
      return false;
    }

    // Check patterns
    if (conditions.patterns && signal.gainzAlgoFeatures && 'patternDetected' in signal.gainzAlgoFeatures) {
      const patternDetected = (signal.gainzAlgoFeatures as any).patternDetected;
      if (patternDetected && !conditions.patterns.includes(patternDetected)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if alert rule is throttled
   */
  private isThrottled(ruleId: string, rule: AlertRule): boolean {
    if (!rule.throttle.enabled) return false;

    const tracker = this.throttleTracker.get(ruleId);
    if (!tracker) return false;

    const now = new Date();
    const hoursSinceReset = (now.getTime() - tracker.lastReset.getTime()) / (1000 * 60 * 60);

    // Reset counter if more than an hour has passed
    if (hoursSinceReset >= 1) {
      this.throttleTracker.set(ruleId, { count: 0, lastReset: now });
      return false;
    }

    return tracker.count >= rule.throttle.maxAlertsPerHour;
  }

  /**
   * Update throttle tracker
   */
  private updateThrottleTracker(ruleId: string): void {
    const tracker = this.throttleTracker.get(ruleId) || { count: 0, lastReset: new Date() };
    tracker.count++;
    this.throttleTracker.set(ruleId, tracker);
  }

  /**
   * Send alerts through all configured channels
   */
  private async sendAlerts(signal: TradingSignal, rule: AlertRule): Promise<void> {
    const message = this.formatAlertMessage(signal, rule);
    const title = `GainzAlgo V2 - ${rule.name}`;

    for (const channel of rule.channels) {
      if (!channel.enabled) continue;

      try {
        let success = false;
        
        switch (channel.type) {
          case 'PUSH':
            success = await this.sendPushNotification(message, title);
            break;
          case 'EMAIL':
            success = await this.sendEmailAlert(message, title, channel.config.emailAddress!);
            break;
          case 'SMS':
            success = await this.sendSMSAlert(message, channel.config.phoneNumber!);
            break;
          case 'WEBHOOK':
            success = await this.sendWebhookAlert({
              signal,
              rule: rule.name,
              message,
              timestamp: new Date().toISOString()
            }, channel.config.webhookUrl!);
            break;
        }

        // Record alert history
        this.recordAlertHistory({
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          ruleId: rule.id,
          signalId: signal.id,
          timestamp: new Date(),
          channel: channel.type,
          status: success ? 'SENT' : 'FAILED',
          message
        });

      } catch (error) {
        console.error(`Failed to send ${channel.type} alert:`, error);
        this.recordAlertHistory({
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          ruleId: rule.id,
          signalId: signal.id,
          timestamp: new Date(),
          channel: channel.type,
          status: 'FAILED',
          message,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  }

  /**
   * Format alert message
   */
  private formatAlertMessage(signal: TradingSignal, rule: AlertRule): string {
    const patternDetected = signal.gainzAlgoFeatures && 'patternDetected' in signal.gainzAlgoFeatures 
      ? (signal.gainzAlgoFeatures as any).patternDetected 
      : 'NONE';
    const pattern = patternDetected !== 'NONE' 
      ? ` | Pattern: ${patternDetected}` 
      : '';
    
    return `🚀 ${signal.signal} ${signal.symbol} (${signal.market})\n` +
           `💪 Confidence: ${(signal.confidence * 100).toFixed(1)}%\n` +
           `📊 Risk/Reward: 1:${signal.riskReward.toFixed(1)}\n` +
           `💰 Entry: $${signal.entryPrice.toFixed(4)}\n` +
           `🛡️ Stop Loss: $${signal.stopLoss.toFixed(4)}\n` +
           `🎯 Take Profit: $${signal.takeProfit.toFixed(4)}\n` +
           `⏰ Timeframe: ${signal.timeframe}${pattern}\n` +
           `🎲 Win Probability: ${(signal.winProbability * 100).toFixed(1)}%`;
  }

  /**
   * Record alert in history
   */
  private recordAlertHistory(alert: AlertHistory): void {
    this.alertHistory.push(alert);
    
    // Keep only last 1000 alerts
    if (this.alertHistory.length > 1000) {
      this.alertHistory = this.alertHistory.slice(-1000);
    }
  }

  // Notification service implementations (placeholders for real implementations)
  
  private async initializePushNotifications(): Promise<void> {
    // Initialize push notification service (Firebase, OneSignal, etc.)
    console.log('Push notifications service initialized');
  }

  private async initializeEmailService(): Promise<void> {
    // Initialize email service (SendGrid, AWS SES, etc.)
    console.log('Email service initialized');
  }

  private async initializeSMSService(): Promise<void> {
    // Initialize SMS service (Twilio, AWS SNS, etc.)
    console.log('SMS service initialized');
  }

  private async sendPushNotification(message: string, title: string): Promise<boolean> {
    // Implement push notification sending
    console.log(`📱 PUSH: ${title} - ${message}`);
    return true; // Simulate success
  }

  private async sendEmailAlert(message: string, subject: string, email: string): Promise<boolean> {
    // Implement email sending
    console.log(`📧 EMAIL to ${email}: ${subject} - ${message}`);
    return true; // Simulate success
  }

  private async sendSMSAlert(message: string, phoneNumber: string): Promise<boolean> {
    // Implement SMS sending
    console.log(`📱 SMS to ${phoneNumber}: ${message}`);
    return true; // Simulate success
  }

  private async sendWebhookAlert(payload: any, webhookUrl: string): Promise<boolean> {
    // Implement webhook sending
    console.log(`🔗 WEBHOOK to ${webhookUrl}:`, payload);
    return true; // Simulate success
  }
}

export default AlertsManager;