'use client';

export interface AlertPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  tradingAlerts: boolean;
  priceAlerts: boolean;
  portfolioAlerts: boolean;
  newsAlerts: boolean;
  systemAlerts: boolean;
  soundEnabled: boolean;
  alertFrequency: 'immediate' | 'hourly' | 'daily';
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export type AlertCategory = 'price' | 'portfolio' | 'news' | 'technical' | 'risk' | 'trading';

export interface Alert {
  id: string;
  type: 'price' | 'portfolio' | 'trading' | 'news' | 'system' | 'risk';
  category?: AlertCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  symbol?: string;
  targetPrice?: number;
  currentPrice?: number;
  threshold?: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
  userId: string;
  conditions: AlertCondition[];
  recurring?: boolean;
  cooldownMinutes?: number;
}

export interface AlertCondition {
  id: string;
  type: 'price_above' | 'price_below' | 'volume_spike' | 'percentage_change' | 'portfolio_value' | 'profit_loss' | 'rsi' | 'macd';
  value: number;
  operator: '>' | '<' | '>=' | '<=' | '==';
  timeframe?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  symbol?: string;
}

export interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  type: Alert['type'];
  category?: AlertCategory;
  defaultConditions: Omit<AlertCondition, 'id'>[];
  isCustom: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  isPopular?: boolean;
}

class AlertService {
  private alerts: Alert[] = [];
  private preferences: AlertPreferences | null = null;
  private templates: AlertTemplate[] = [];
  private listeners: ((alerts: Alert[]) => void)[] = [];

  constructor() {
    this.initializeDefaultTemplates();
    this.loadUserPreferences();
  }

  // Initialize default alert templates
  private initializeDefaultTemplates() {
    this.templates = [
      // Price Alerts
      {
        id: 'price-breakout',
        name: 'Price Breakout Alert',
        description: 'Alert when price breaks above or below a key level',
        type: 'price',
        category: 'price',
        defaultConditions: [
          { type: 'price_above', value: 0, operator: '>', timeframe: '1m' }
        ],
        isCustom: false,
        priority: 'medium',
        isPopular: true
      },
      {
        id: 'price-below-target',
        name: 'Price Below Target',
        description: 'Alert when price goes below a specific value',
        type: 'price',
        category: 'price',
        defaultConditions: [
          { type: 'price_below', value: 0, operator: '<', timeframe: '1m' }
        ],
        isCustom: false,
        priority: 'high',
        isPopular: true
      },
      {
        id: 'price-change-percent',
        name: 'Price Change %',
        description: 'Alert when price changes by a percentage',
        type: 'price',
        category: 'price',
        defaultConditions: [
          { type: 'percentage_change', value: 5, operator: '>', timeframe: '5m' }
        ],
        isCustom: false,
        priority: 'medium'
      },
      
      // Portfolio Alerts
      {
        id: 'portfolio-loss',
        name: 'Portfolio Loss Alert',
        description: 'Alert when portfolio value drops by a certain percentage',
        type: 'portfolio',
        category: 'portfolio',
        defaultConditions: [
          { type: 'percentage_change', value: -5, operator: '<=', timeframe: '1d' }
        ],
        isCustom: false,
        priority: 'critical',
        isPopular: true
      },
      {
        id: 'profit-loss-threshold',
        name: 'Profit/Loss Threshold',
        description: 'Alert when profit or loss reaches a threshold',
        type: 'portfolio',
        category: 'portfolio',
        defaultConditions: [
          { type: 'profit_loss', value: -500, operator: '<', timeframe: '1h' }
        ],
        isCustom: false,
        priority: 'critical'
      },
      
      // Technical Analysis Alerts
      {
        id: 'rsi-overbought',
        name: 'RSI Overbought',
        description: 'Alert when RSI indicates overbought conditions',
        type: 'trading',
        category: 'technical',
        defaultConditions: [
          { type: 'rsi', value: 70, operator: '>', timeframe: '1h' }
        ],
        isCustom: false,
        priority: 'medium'
      },
      {
        id: 'rsi-oversold',
        name: 'RSI Oversold',
        description: 'Alert when RSI indicates oversold conditions',
        type: 'trading',
        category: 'technical',
        defaultConditions: [
          { type: 'rsi', value: 30, operator: '<', timeframe: '1h' }
        ],
        isCustom: false,
        priority: 'medium'
      },
      
      // Volume and Trading Alerts
      {
        id: 'volume-spike',
        name: 'Volume Spike Alert',
        description: 'Alert when trading volume increases significantly',
        type: 'trading',
        category: 'trading',
        defaultConditions: [
          { type: 'volume_spike', value: 200, operator: '>', timeframe: '5m' }
        ],
        isCustom: false,
        priority: 'medium',
        isPopular: true
      },
      
      // Risk Management Alerts
      {
        id: 'risk-threshold',
        name: 'Risk Threshold Alert',
        description: 'Alert when risk exposure exceeds safe limits',
        type: 'risk',
        category: 'risk',
        defaultConditions: [
          { type: 'portfolio_value', value: 10000, operator: '>', timeframe: '1h' }
        ],
        isCustom: false,
        priority: 'critical'
      },
      {
        id: 'stop-loss-trigger',
        name: 'Stop Loss Trigger',
        description: 'Alert when stop loss conditions are met',
        type: 'risk',
        category: 'risk',
        defaultConditions: [
          { type: 'price_below', value: 0, operator: '<', timeframe: '1m' }
        ],
        isCustom: false,
        priority: 'critical'
      },
      
      // News Alerts
      {
        id: 'market-news',
        name: 'Market News Alert',
        description: 'Alert for important market news',
        type: 'news',
        category: 'news',
        defaultConditions: [
          { type: 'percentage_change', value: 0, operator: '>', timeframe: '1d' }
        ],
        isCustom: false,
        priority: 'low'
      }
    ];
  }

  // Load user preferences from storage
  private loadUserPreferences() {
    try {
      const stored = localStorage.getItem('alertPreferences');
      if (stored) {
        this.preferences = JSON.parse(stored);
      } else {
        this.preferences = this.getDefaultPreferences();
        this.savePreferences();
      }
    } catch (error) {
      console.error('Failed to load alert preferences:', error);
      this.preferences = this.getDefaultPreferences();
    }
  }

  // Get default preferences
  private getDefaultPreferences(): AlertPreferences {
    return {
      id: 'default',
      userId: 'current-user',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      tradingAlerts: true,
      priceAlerts: true,
      portfolioAlerts: true,
      newsAlerts: false,
      systemAlerts: true,
      soundEnabled: true,
      alertFrequency: 'immediate',
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      }
    };
  }

  // Save preferences to storage
  private savePreferences() {
    if (this.preferences) {
      localStorage.setItem('alertPreferences', JSON.stringify(this.preferences));
    }
  }

  // Subscribe to alert updates
  subscribe(callback: (alerts: Alert[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.alerts));
  }

  // Get user preferences
  getPreferences(): AlertPreferences | null {
    return this.preferences;
  }

  // Update user preferences
  updatePreferences(updates: Partial<AlertPreferences>) {
    if (this.preferences) {
      this.preferences = { ...this.preferences, ...updates };
      this.savePreferences();
    }
  }

  // Create a new alert
  createAlert(alertData: Omit<Alert, 'id' | 'createdAt' | 'isActive'>): Alert {
    const alert: Alert = {
      ...alertData,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      isActive: true,
      category: alertData.category || 'trading', // Default category
      recurring: alertData.recurring || false,
      cooldownMinutes: alertData.cooldownMinutes || 0
    };

    this.alerts.push(alert);
    this.notifyListeners();
    return alert;
  }

  // Get all alerts
  getAlerts(): Alert[] {
    return this.alerts;
  }

  // Get active alerts
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.isActive);
  }

  // Get alerts by type
  getAlertsByType(type: Alert['type']): Alert[] {
    return this.alerts.filter(alert => alert.type === type);
  }

  // Update alert
  updateAlert(id: string, updates: Partial<Alert>) {
    const index = this.alerts.findIndex(alert => alert.id === id);
    if (index !== -1) {
      this.alerts[index] = { ...this.alerts[index], ...updates };
      this.notifyListeners();
    }
  }

  // Delete alert
  deleteAlert(id: string) {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.notifyListeners();
  }

  // Toggle alert active state
  toggleAlert(id: string) {
    const alert = this.alerts.find(alert => alert.id === id);
    if (alert) {
      alert.isActive = !alert.isActive;
      this.notifyListeners();
    }
  }

  // Check if alerts should be triggered (mock implementation)
  checkAlertConditions(marketData: { symbol: string; price: number; volume: number }) {
    const activeAlerts = this.getActiveAlerts();
    
    activeAlerts.forEach(alert => {
      if (alert.symbol === marketData.symbol) {
        alert.conditions.forEach(condition => {
          let shouldTrigger = false;

          switch (condition.type) {
            case 'price_above':
              shouldTrigger = marketData.price > condition.value;
              break;
            case 'price_below':
              shouldTrigger = marketData.price < condition.value;
              break;
            case 'volume_spike':
              shouldTrigger = marketData.volume > condition.value;
              break;
          }

          if (shouldTrigger && !alert.triggeredAt) {
            this.triggerAlert(alert);
          }
        });
      }
    });
  }

  // Trigger an alert
  private triggerAlert(alert: Alert) {
    if (!alert.isActive) return;
    
    // Check cooldown period
    if (alert.triggeredAt && alert.cooldownMinutes) {
      const timeSinceLastTrigger = Date.now() - alert.triggeredAt.getTime();
      const cooldownMs = alert.cooldownMinutes * 60 * 1000;
      if (timeSinceLastTrigger < cooldownMs) {
        return; // Still in cooldown period
      }
    }
    
    alert.triggeredAt = new Date();
    
    // Send notification based on user preferences and alert priority
    if (this.preferences) {
      if (this.preferences.pushNotifications) {
        this.sendPushNotification(alert);
      }
      
      if (this.preferences.emailNotifications && (alert.priority === 'high' || alert.priority === 'critical')) {
        this.sendEmailNotification(alert);
      }
      
      if (this.preferences.soundEnabled) {
        this.playAlertSound(alert.priority);
      }
    }

    // Deactivate non-recurring alerts after triggering
    if (!alert.recurring) {
      alert.isActive = false;
    }

    this.notifyListeners();
  }

  // Send push notification
  private sendPushNotification(alert: Alert) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(alert.title, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: alert.id
      });
    }
  }

  // Send email notification (mock)
  private sendEmailNotification(alert: Alert) {
    console.log('Email notification sent:', alert.title);
    // In a real implementation, this would call an API endpoint
  }

  // Play alert sound
  private playAlertSound(priority: Alert['priority']) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different priorities
      const frequencies = {
        low: 440,
        medium: 554,
        high: 659,
        critical: 880
      };

      oscillator.frequency.setValueAtTime(frequencies[priority], audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play alert sound:', error);
    }
  }

  // Get alert templates
  getTemplates(): AlertTemplate[] {
    return this.templates;
  }

  getTemplatesByCategory(category: Alert['type']): AlertTemplate[] {
    return this.templates.filter(template => template.type === category);
  }

  getTemplatesByAlertCategory(category: AlertCategory): AlertTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  getPopularTemplates(): AlertTemplate[] {
    return this.templates.filter(template => template.isPopular === true);
  }

  getAlertsByCategory(category: AlertCategory): Alert[] {
    return this.alerts.filter(alert => alert.category === category);
  }

  getAlertsByPriority(priority: Alert['priority']): Alert[] {
    return this.alerts.filter(alert => alert.priority === priority);
  }

  getCriticalAlerts(): Alert[] {
    return this.getAlertsByPriority('critical').filter(alert => alert.isActive);
  }

  // Create alert from template
  createAlertFromTemplate(templateId: string, symbol: string, customValues: Record<string, number>): Alert | null {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return null;

    const conditions: AlertCondition[] = template.defaultConditions.map(condition => ({
      ...condition,
      id: `condition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      value: customValues[condition.type] || condition.value
    }));

    return this.createAlert({
      type: template.type,
      priority: 'medium',
      title: `${template.name} - ${symbol}`,
      message: `${template.description} for ${symbol}`,
      symbol,
      userId: 'current-user',
      conditions
    });
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Enable alerts (main function for the button)
  async enableAlerts(): Promise<boolean> {
    try {
      // Request notification permission
      const hasPermission = await this.requestNotificationPermission();
      
      if (hasPermission) {
        // Update preferences to enable notifications
        this.updatePreferences({
          pushNotifications: true,
          tradingAlerts: true,
          priceAlerts: true,
          portfolioAlerts: true,
          systemAlerts: true
        });

        // Show success notification
        this.sendPushNotification({
          id: 'welcome',
          type: 'system',
          priority: 'medium',
          title: 'Alerts Enabled!',
          message: 'You will now receive real-time trading alerts and notifications.',
          userId: 'current-user',
          conditions: [],
          isActive: true,
          createdAt: new Date()
        });

        return true;
      } else {
        console.warn('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Failed to enable alerts:', error);
      return false;
    }
  }
}

// Export singleton instance
export const alertService = new AlertService();
export default alertService;