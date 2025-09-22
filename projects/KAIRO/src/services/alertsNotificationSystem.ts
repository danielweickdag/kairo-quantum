import { TradingSignal } from './multiMarketTradingEngine';
import { SignalMetrics } from './signalGenerator';

export interface AlertPreferences {
  userId: string;
  pushNotifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  signalTypes: {
    buy: boolean;
    sell: boolean;
    stopLoss: boolean;
    takeProfit: boolean;
    riskWarning: boolean;
  };
  markets: {
    stocks: boolean;
    crypto: boolean;
    forex: boolean;
  };
  minimumConfidence: number; // 0-100
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    timezone: string;
  };
  maxAlertsPerHour: number;
}

export interface AlertMessage {
  id: string;
  userId: string;
  type: 'SIGNAL' | 'RISK_WARNING' | 'MARKET_UPDATE' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  channels: ('PUSH' | 'EMAIL' | 'SMS')[];
  status: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED';
  retryCount: number;
  maxRetries: number;
}

export interface NotificationChannel {
  type: 'PUSH' | 'EMAIL' | 'SMS';
  enabled: boolean;
  config: any;
  rateLimit: number; // messages per hour
  currentCount: number;
  lastReset: Date;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export interface SMSConfig {
  provider: 'TWILIO' | 'AWS_SNS' | 'NEXMO';
  accountSid?: string;
  authToken?: string;
  fromNumber?: string;
  region?: string;
}

export interface PushConfig {
  provider: 'FCM' | 'APNS' | 'WEB_PUSH';
  serverKey?: string;
  vapidKeys?: {
    publicKey: string;
    privateKey: string;
  };
}

export class AlertsNotificationSystem {
  private alertQueue: AlertMessage[] = [];
  private userPreferences: Map<string, AlertPreferences> = new Map();
  private notificationChannels: Map<string, NotificationChannel> = new Map();
  private alertHistory: Map<string, AlertMessage[]> = new Map();
  private rateLimitCounters: Map<string, { count: number; resetTime: Date }> = new Map();
  private processingInterval: NodeJS.Timeout | null = null;

  constructor(
    private emailConfig: EmailConfig,
    private smsConfig: SMSConfig,
    private pushConfig: PushConfig
  ) {
    this.initializeChannels();
    this.startProcessing();
  }

  /**
   * Initialize notification channels
   */
  private initializeChannels(): void {
    this.notificationChannels.set('PUSH', {
      type: 'PUSH',
      enabled: true,
      config: this.pushConfig,
      rateLimit: 100, // 100 push notifications per hour
      currentCount: 0,
      lastReset: new Date()
    });

    this.notificationChannels.set('EMAIL', {
      type: 'EMAIL',
      enabled: true,
      config: this.emailConfig,
      rateLimit: 50, // 50 emails per hour
      currentCount: 0,
      lastReset: new Date()
    });

    this.notificationChannels.set('SMS', {
      type: 'SMS',
      enabled: true,
      config: this.smsConfig,
      rateLimit: 20, // 20 SMS per hour
      currentCount: 0,
      lastReset: new Date()
    });
  }

  /**
   * Start the alert processing loop
   */
  private startProcessing(): void {
    this.processingInterval = setInterval(() => {
      this.processAlertQueue();
      this.resetRateLimitCounters();
    }, 5000); // Process every 5 seconds
  }

  /**
   * Set user alert preferences
   */
  setUserPreferences(userId: string, preferences: AlertPreferences): void {
    this.userPreferences.set(userId, preferences);
    console.log(`Alert preferences updated for user ${userId}`);
  }

  /**
   * Get user alert preferences
   */
  getUserPreferences(userId: string): AlertPreferences | null {
    return this.userPreferences.get(userId) || null;
  }

  /**
   * Send trading signal alert
   */
  async sendSignalAlert(
    userId: string,
    signal: TradingSignal,
    metrics: SignalMetrics
  ): Promise<void> {
    const preferences = this.userPreferences.get(userId);
    if (!preferences) {
      console.warn(`No alert preferences found for user ${userId}`);
      return;
    }

    // Check if user wants alerts for this signal type
    const signalTypeEnabled = this.isSignalTypeEnabled(signal.signal, preferences);
    if (!signalTypeEnabled) {
      return;
    }

    // Check if user wants alerts for this market
    const marketEnabled = preferences.markets[signal.market.toLowerCase() as keyof typeof preferences.markets];
    if (!marketEnabled) {
      return;
    }

    // Check confidence threshold
    if (signal.confidence < preferences.minimumConfidence) {
      return;
    }

    // Check quiet hours
    if (this.isQuietHours(preferences)) {
      return;
    }

    // Check rate limits
    if (!this.checkRateLimit(userId, preferences.maxAlertsPerHour)) {
      return;
    }

    const alertMessage = this.createSignalAlertMessage(userId, signal, metrics, preferences);
    this.queueAlert(alertMessage);
  }

  /**
   * Send risk warning alert
   */
  async sendRiskWarning(
    userId: string,
    riskType: 'HIGH_DRAWDOWN' | 'POSITION_SIZE' | 'MARKET_VOLATILITY' | 'STOP_LOSS_HIT',
    details: any
  ): Promise<void> {
    const preferences = this.userPreferences.get(userId);
    if (!preferences || !preferences.signalTypes.riskWarning) {
      return;
    }

    const alertMessage: AlertMessage = {
      id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'RISK_WARNING',
      priority: 'HIGH',
      title: this.getRiskWarningTitle(riskType),
      message: this.getRiskWarningMessage(riskType, details),
      data: { riskType, details },
      timestamp: new Date(),
      channels: this.getEnabledChannels(preferences),
      status: 'PENDING',
      retryCount: 0,
      maxRetries: 3
    };

    this.queueAlert(alertMessage);
  }

  /**
   * Send market update alert
   */
  async sendMarketUpdate(
    userId: string,
    market: string,
    updateType: 'MAJOR_MOVE' | 'NEWS_EVENT' | 'VOLATILITY_SPIKE',
    details: any
  ): Promise<void> {
    const preferences = this.userPreferences.get(userId);
    if (!preferences) {
      return;
    }

    const alertMessage: AlertMessage = {
      id: `market_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'MARKET_UPDATE',
      priority: 'MEDIUM',
      title: `${market} Market Update`,
      message: this.getMarketUpdateMessage(updateType, details),
      data: { market, updateType, details },
      timestamp: new Date(),
      channels: this.getEnabledChannels(preferences),
      status: 'PENDING',
      retryCount: 0,
      maxRetries: 2
    };

    this.queueAlert(alertMessage);
  }

  /**
   * Send system alert
   */
  async sendSystemAlert(
    userId: string,
    alertType: 'MAINTENANCE' | 'OUTAGE' | 'UPDATE' | 'SECURITY',
    message: string
  ): Promise<void> {
    const preferences = this.userPreferences.get(userId);
    if (!preferences) {
      return;
    }

    const alertMessage: AlertMessage = {
      id: `system_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'SYSTEM',
      priority: alertType === 'SECURITY' ? 'CRITICAL' : 'MEDIUM',
      title: `System ${alertType}`,
      message,
      timestamp: new Date(),
      channels: this.getEnabledChannels(preferences),
      status: 'PENDING',
      retryCount: 0,
      maxRetries: 3
    };

    this.queueAlert(alertMessage);
  }

  /**
   * Create signal alert message
   */
  private createSignalAlertMessage(
    userId: string,
    signal: TradingSignal,
    metrics: SignalMetrics,
    preferences: AlertPreferences
  ): AlertMessage {
    const title = `${signal.signal.toUpperCase()} Signal: ${signal.symbol}`;
    const message = this.formatSignalMessage(signal, metrics);
    
    return {
      id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'SIGNAL',
      priority: signal.confidence >= 80 ? 'HIGH' : 'MEDIUM',
      title,
      message,
      data: { signal, metrics },
      timestamp: new Date(),
      channels: this.getEnabledChannels(preferences),
      status: 'PENDING',
      retryCount: 0,
      maxRetries: 2
    };
  }

  /**
   * Format signal message for notifications
   */
  private formatSignalMessage(signal: TradingSignal, metrics: SignalMetrics): string {
    const action = signal.signal.toUpperCase();
    const confidence = Math.round(signal.confidence);
    const price = signal.entryPrice.toFixed(signal.market === 'FOREX' ? 5 : 2);
    const stopLoss = signal.stopLoss?.toFixed(signal.market === 'FOREX' ? 5 : 2);
    const takeProfit = signal.takeProfit?.toFixed(signal.market === 'FOREX' ? 5 : 2);
    
    let message = `${action} ${signal.symbol} at ${price}\n`;
    message += `Confidence: ${confidence}%\n`;
    
    if (stopLoss) {
      message += `Stop Loss: ${stopLoss}\n`;
    }
    
    if (takeProfit) {
      message += `Take Profit: ${takeProfit}\n`;
    }
    
    if (metrics.accuracy) {
      message += `Win Rate: ${Math.round(metrics.accuracy * 100)}%\n`;
    }
    
    if (metrics.profitFactor) {
      message += `Profit Factor: ${metrics.profitFactor.toFixed(2)}\n`;
    }
    
    message += `Market: ${signal.market}`;
    
    return message;
  }

  /**
   * Check if signal type is enabled for user
   */
  private isSignalTypeEnabled(signalType: string, preferences: AlertPreferences): boolean {
    switch (signalType.toLowerCase()) {
      case 'buy':
        return preferences.signalTypes.buy;
      case 'sell':
        return preferences.signalTypes.sell;
      case 'stop_loss':
        return preferences.signalTypes.stopLoss;
      case 'take_profit':
        return preferences.signalTypes.takeProfit;
      default:
        return true;
    }
  }

  /**
   * Check if current time is within quiet hours
   */
  private isQuietHours(preferences: AlertPreferences): boolean {
    if (!preferences.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      timeZone: preferences.quietHours.timezone
    }).substring(0, 5);

    const startTime = preferences.quietHours.startTime;
    const endTime = preferences.quietHours.endTime;

    // Handle overnight quiet hours (e.g., 22:00 to 06:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }
    
    // Handle same-day quiet hours (e.g., 12:00 to 14:00)
    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * Check rate limit for user
   */
  private checkRateLimit(userId: string, maxAlertsPerHour: number): boolean {
    const key = `rate_limit_${userId}`;
    const now = new Date();
    const counter = this.rateLimitCounters.get(key);

    if (!counter || now.getTime() - counter.resetTime.getTime() > 3600000) {
      // Reset counter if more than 1 hour has passed
      this.rateLimitCounters.set(key, {
        count: 1,
        resetTime: now
      });
      return true;
    }

    if (counter.count >= maxAlertsPerHour) {
      return false;
    }

    counter.count++;
    return true;
  }

  /**
   * Get enabled notification channels for user
   */
  private getEnabledChannels(preferences: AlertPreferences): ('PUSH' | 'EMAIL' | 'SMS')[] {
    const channels: ('PUSH' | 'EMAIL' | 'SMS')[] = [];
    
    if (preferences.pushNotifications) {
      channels.push('PUSH');
    }
    
    if (preferences.emailAlerts) {
      channels.push('EMAIL');
    }
    
    if (preferences.smsAlerts) {
      channels.push('SMS');
    }
    
    return channels;
  }

  /**
   * Queue alert for processing
   */
  private queueAlert(alert: AlertMessage): void {
    this.alertQueue.push(alert);
    console.log(`Alert queued: ${alert.id} for user ${alert.userId}`);
  }

  /**
   * Process alert queue
   */
  private async processAlertQueue(): Promise<void> {
    if (this.alertQueue.length === 0) {
      return;
    }

    const alertsToProcess = this.alertQueue.splice(0, 10); // Process up to 10 alerts at a time
    
    for (const alert of alertsToProcess) {
      try {
        await this.processAlert(alert);
      } catch (error) {
        console.error(`Error processing alert ${alert.id}:`, error);
        this.handleAlertFailure(alert);
      }
    }
  }

  /**
   * Process individual alert
   */
  private async processAlert(alert: AlertMessage): Promise<void> {
    const results = await Promise.allSettled(
      alert.channels.map(channel => this.sendToChannel(alert, channel))
    );

    const allSuccessful = results.every(result => result.status === 'fulfilled');
    
    if (allSuccessful) {
      alert.status = 'SENT';
      this.addToHistory(alert);
      console.log(`Alert ${alert.id} sent successfully`);
    } else {
      alert.status = 'FAILED';
      this.handleAlertFailure(alert);
    }
  }

  /**
   * Send alert to specific channel
   */
  private async sendToChannel(alert: AlertMessage, channel: 'PUSH' | 'EMAIL' | 'SMS'): Promise<void> {
    const channelConfig = this.notificationChannels.get(channel);
    
    if (!channelConfig || !channelConfig.enabled) {
      throw new Error(`Channel ${channel} is not enabled`);
    }

    // Check channel rate limit
    if (!this.checkChannelRateLimit(channel)) {
      throw new Error(`Channel ${channel} rate limit exceeded`);
    }

    switch (channel) {
      case 'PUSH':
        await this.sendPushNotification(alert);
        break;
      case 'EMAIL':
        await this.sendEmailNotification(alert);
        break;
      case 'SMS':
        await this.sendSMSNotification(alert);
        break;
    }

    // Increment channel counter
    channelConfig.currentCount++;
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(alert: AlertMessage): Promise<void> {
    // Implement push notification logic here
    // This would integrate with FCM, APNS, or Web Push
    console.log(`Sending push notification for alert ${alert.id}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock success
    console.log(`Push notification sent for alert ${alert.id}`);
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(alert: AlertMessage): Promise<void> {
    // Implement email sending logic here
    // This would integrate with SMTP or email service providers
    console.log(`Sending email notification for alert ${alert.id}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock success
    console.log(`Email notification sent for alert ${alert.id}`);
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(alert: AlertMessage): Promise<void> {
    // Implement SMS sending logic here
    // This would integrate with Twilio, AWS SNS, or other SMS providers
    console.log(`Sending SMS notification for alert ${alert.id}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock success
    console.log(`SMS notification sent for alert ${alert.id}`);
  }

  /**
   * Check channel rate limit
   */
  private checkChannelRateLimit(channel: 'PUSH' | 'EMAIL' | 'SMS'): boolean {
    const channelConfig = this.notificationChannels.get(channel);
    if (!channelConfig) {
      return false;
    }

    const now = new Date();
    const hoursSinceReset = (now.getTime() - channelConfig.lastReset.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceReset >= 1) {
      // Reset counter
      channelConfig.currentCount = 0;
      channelConfig.lastReset = now;
      return true;
    }

    return channelConfig.currentCount < channelConfig.rateLimit;
  }

  /**
   * Handle alert failure
   */
  private handleAlertFailure(alert: AlertMessage): void {
    if (alert.retryCount < alert.maxRetries) {
      alert.retryCount++;
      alert.status = 'PENDING';
      
      // Re-queue with delay
      setTimeout(() => {
        this.alertQueue.push(alert);
      }, 5000 * alert.retryCount); // Exponential backoff
      
      console.log(`Alert ${alert.id} queued for retry (attempt ${alert.retryCount})`);
    } else {
      alert.status = 'FAILED';
      this.addToHistory(alert);
      console.error(`Alert ${alert.id} failed after ${alert.maxRetries} retries`);
    }
  }

  /**
   * Add alert to history
   */
  private addToHistory(alert: AlertMessage): void {
    const userHistory = this.alertHistory.get(alert.userId) || [];
    userHistory.push(alert);
    
    // Keep only last 100 alerts per user
    if (userHistory.length > 100) {
      userHistory.splice(0, userHistory.length - 100);
    }
    
    this.alertHistory.set(alert.userId, userHistory);
  }

  /**
   * Reset rate limit counters
   */
  private resetRateLimitCounters(): void {
    const now = new Date();
    
    this.rateLimitCounters.forEach((counter, key) => {
      if (now.getTime() - counter.resetTime.getTime() > 3600000) {
        counter.count = 0;
        counter.resetTime = now;
      }
    });
  }

  /**
   * Get risk warning title
   */
  private getRiskWarningTitle(riskType: string): string {
    switch (riskType) {
      case 'HIGH_DRAWDOWN':
        return 'High Drawdown Warning';
      case 'POSITION_SIZE':
        return 'Position Size Alert';
      case 'MARKET_VOLATILITY':
        return 'Market Volatility Warning';
      case 'STOP_LOSS_HIT':
        return 'Stop Loss Triggered';
      default:
        return 'Risk Warning';
    }
  }

  /**
   * Get risk warning message
   */
  private getRiskWarningMessage(riskType: string, details: any): string {
    switch (riskType) {
      case 'HIGH_DRAWDOWN':
        return `Your account drawdown has reached ${details.drawdown}%. Consider reducing position sizes.`;
      case 'POSITION_SIZE':
        return `Position size for ${details.symbol} exceeds recommended risk level (${details.riskPercent}%).`;
      case 'MARKET_VOLATILITY':
        return `High volatility detected in ${details.market}. Exercise caution with new positions.`;
      case 'STOP_LOSS_HIT':
        return `Stop loss triggered for ${details.symbol} at ${details.price}. Loss: ${details.loss}.`;
      default:
        return 'Risk warning detected. Please review your positions.';
    }
  }

  /**
   * Get market update message
   */
  private getMarketUpdateMessage(updateType: string, details: any): string {
    switch (updateType) {
      case 'MAJOR_MOVE':
        return `${details.symbol} moved ${details.percentage}% in the last ${details.timeframe}.`;
      case 'NEWS_EVENT':
        return `Market-moving news detected: ${details.headline}`;
      case 'VOLATILITY_SPIKE':
        return `Volatility spike detected. Current VIX: ${details.vix}`;
      default:
        return 'Market update available.';
    }
  }

  /**
   * Get alert history for user
   */
  getAlertHistory(userId: string, limit: number = 50): AlertMessage[] {
    const history = this.alertHistory.get(userId) || [];
    return history.slice(-limit).reverse(); // Return most recent first
  }

  /**
   * Get alert statistics
   */
  getAlertStats(userId: string): {
    totalSent: number;
    totalFailed: number;
    byType: Record<string, number>;
    byChannel: Record<string, number>;
  } {
    const history = this.alertHistory.get(userId) || [];
    
    const stats = {
      totalSent: 0,
      totalFailed: 0,
      byType: {} as Record<string, number>,
      byChannel: {} as Record<string, number>
    };

    history.forEach(alert => {
      if (alert.status === 'SENT' || alert.status === 'DELIVERED') {
        stats.totalSent++;
      } else if (alert.status === 'FAILED') {
        stats.totalFailed++;
      }

      stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;
      
      alert.channels.forEach(channel => {
        stats.byChannel[channel] = (stats.byChannel[channel] || 0) + 1;
      });
    });

    return stats;
  }

  /**
   * Stop the notification system
   */
  stop(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    
    console.log('Alerts notification system stopped');
  }
}

export default AlertsNotificationSystem;