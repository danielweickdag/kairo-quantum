'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

// Risk Management Types
export interface RiskParameters {
  maxPositionSize: number; // Maximum position size as percentage of account
  maxDailyLoss: number; // Maximum daily loss as percentage
  maxDrawdown: number; // Maximum drawdown as percentage
  stopLossPercentage: number; // Default stop loss percentage
  takeProfitRatio: number; // Take profit to stop loss ratio
  maxOpenPositions: number; // Maximum number of open positions
  riskPerTrade: number; // Risk per trade as percentage of account
  correlationLimit: number; // Maximum correlation between positions
}

export interface RiskAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: Date;
  symbol?: string;
  action?: 'reduce_position' | 'close_position' | 'stop_trading' | 'review_risk';
  acknowledged: boolean;
}

export interface PositionRisk {
  symbol: string;
  currentRisk: number; // Current risk as percentage of account
  maxRisk: number; // Maximum allowed risk
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  correlationRisk: number;
  liquidationPrice?: number;
}

export interface AccountRisk {
  totalRisk: number; // Total risk across all positions
  dailyPnL: number;
  dailyPnLPercentage: number;
  currentDrawdown: number;
  maxDrawdownReached: number;
  marginUsed: number;
  marginAvailable: number;
  riskScore: number; // 0-100 risk score
}

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  condition: (account: AccountRisk, positions: PositionRisk[]) => boolean;
  action: 'alert' | 'reduce_positions' | 'stop_trading' | 'close_all';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

class RiskManagementSystem {
  private parameters: RiskParameters;
  private alerts: RiskAlert[];
  private rules: RiskRule[] = [];
  private subscribers: ((alerts: RiskAlert[]) => void)[];
  private accountBalance: number;
  private dailyStartBalance: number;
  private maxDrawdownValue: number;

  constructor() {
    this.parameters = {
      maxPositionSize: 10, // 10% of account
      maxDailyLoss: 5, // 5% daily loss limit
      maxDrawdown: 15, // 15% maximum drawdown
      stopLossPercentage: 2, // 2% stop loss
      takeProfitRatio: 2, // 2:1 risk reward ratio
      maxOpenPositions: 5,
      riskPerTrade: 1, // 1% risk per trade
      correlationLimit: 0.7 // 70% correlation limit
    };
    
    this.alerts = [];
    this.subscribers = [];
    this.accountBalance = 10000; // Default balance
    this.dailyStartBalance = 10000;
    this.maxDrawdownValue = 0;
    
    this.initializeRiskRules();
    this.startDailyReset();
  }

  private initializeRiskRules(): void {
    this.rules = [
      {
        id: 'daily_loss_limit',
        name: 'Daily Loss Limit',
        description: 'Triggers when daily loss exceeds the maximum allowed percentage',
        condition: (account) => Math.abs(account.dailyPnLPercentage) > this.parameters.maxDailyLoss,
        action: 'stop_trading',
        severity: 'critical',
        enabled: true
      },
      {
        id: 'max_drawdown',
        name: 'Maximum Drawdown',
        description: 'Triggers when account drawdown exceeds the maximum allowed',
        condition: (account) => account.currentDrawdown > this.parameters.maxDrawdown,
        action: 'reduce_positions',
        severity: 'critical',
        enabled: true
      },
      {
        id: 'position_size_limit',
        name: 'Position Size Limit',
        description: 'Triggers when a single position exceeds maximum size',
        condition: (account, positions) => positions.some(p => p.currentRisk > this.parameters.maxPositionSize),
        action: 'reduce_positions',
        severity: 'high',
        enabled: true
      },
      {
        id: 'correlation_risk',
        name: 'High Correlation Risk',
        description: 'Triggers when positions have high correlation',
        condition: (account, positions) => positions.some(p => p.correlationRisk > this.parameters.correlationLimit),
        action: 'alert',
        severity: 'medium',
        enabled: true
      },
      {
        id: 'margin_warning',
        name: 'High Margin Usage',
        description: 'Triggers when margin usage exceeds 80%',
        condition: (account) => account.marginUsed / (account.marginUsed + account.marginAvailable) > 0.8,
        action: 'alert',
        severity: 'medium',
        enabled: true
      },
      {
        id: 'max_positions',
        name: 'Maximum Positions',
        description: 'Triggers when number of open positions exceeds limit',
        condition: (account, positions) => positions.length > this.parameters.maxOpenPositions,
        action: 'alert',
        severity: 'medium',
        enabled: true
      }
    ];
  }

  private startDailyReset(): void {
    // Reset daily tracking at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.resetDailyTracking();
      // Set up daily interval
      setInterval(() => this.resetDailyTracking(), 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }

  private resetDailyTracking(): void {
    this.dailyStartBalance = this.accountBalance;
    this.createAlert({
      type: 'info',
      message: 'Daily risk tracking reset',
      action: 'review_risk'
    });
  }

  private createAlert(alertData: Partial<RiskAlert>): void {
    const alert: RiskAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: alertData.type || 'info',
      message: alertData.message || 'Risk alert triggered',
      timestamp: new Date(),
      symbol: alertData.symbol,
      action: alertData.action,
      acknowledged: false
    };

    this.alerts.unshift(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100);
    }

    // Show toast notification
    const toastMessage = alertData.symbol 
      ? `${alertData.symbol}: ${alert.message}`
      : alert.message;

    switch (alert.type) {
      case 'critical':
        toast.error(toastMessage, { duration: 10000 });
        break;
      case 'warning':
        toast.error(toastMessage, { duration: 5000 });
        break;
      default:
        toast(toastMessage, { duration: 3000 });
    }

    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.alerts));
  }

  // Public Methods
  public updateAccountBalance(balance: number): void {
    this.accountBalance = balance;
    
    // Update max drawdown
    const currentDrawdown = ((this.dailyStartBalance - balance) / this.dailyStartBalance) * 100;
    if (currentDrawdown > this.maxDrawdownValue) {
      this.maxDrawdownValue = currentDrawdown;
    }
  }

  public calculatePositionRisk(symbol: string, entryPrice: number, size: number, stopLoss?: number): PositionRisk {
    const positionValue = entryPrice * size;
    const currentRisk = (positionValue / this.accountBalance) * 100;
    
    const defaultStopLoss = stopLoss || entryPrice * (1 - this.parameters.stopLossPercentage / 100);
    const defaultTakeProfit = entryPrice + (entryPrice - defaultStopLoss) * this.parameters.takeProfitRatio;
    
    const riskAmount = Math.abs(entryPrice - defaultStopLoss) * size;
    const rewardAmount = Math.abs(defaultTakeProfit - entryPrice) * size;
    const riskRewardRatio = rewardAmount / riskAmount;
    
    // Calculate correlation risk (simplified)
    const correlationRisk = this.calculateCorrelationRisk(symbol);
    
    return {
      symbol,
      currentRisk,
      maxRisk: this.parameters.maxPositionSize,
      stopLoss: defaultStopLoss,
      takeProfit: defaultTakeProfit,
      riskRewardRatio,
      correlationRisk
    };
  }

  private calculateCorrelationRisk(symbol: string): number {
    // Simplified correlation calculation
    // In a real implementation, this would use historical price data
    const correlationMap: { [key: string]: { [key: string]: number } } = {
      'BTCUSDT': { 'ETHUSDT': 0.8, 'ADAUSDT': 0.7 },
      'ETHUSDT': { 'BTCUSDT': 0.8, 'ADAUSDT': 0.6 },
      'AAPL': { 'MSFT': 0.6, 'GOOGL': 0.5 },
      'TSLA': { 'AAPL': 0.3, 'MSFT': 0.2 }
    };
    
    const correlations = correlationMap[symbol] || {};
    return Math.max(...Object.values(correlations), 0);
  }

  public calculateAccountRisk(positions: PositionRisk[]): AccountRisk {
    const totalRisk = positions.reduce((sum, pos) => sum + pos.currentRisk, 0);
    const dailyPnL = this.accountBalance - this.dailyStartBalance;
    const dailyPnLPercentage = (dailyPnL / this.dailyStartBalance) * 100;
    const currentDrawdown = this.maxDrawdownValue;
    
    // Calculate risk score (0-100)
    let riskScore = 0;
    riskScore += Math.min(totalRisk / this.parameters.maxPositionSize * 20, 20); // Position size risk
    riskScore += Math.min(Math.abs(dailyPnLPercentage) / this.parameters.maxDailyLoss * 30, 30); // Daily loss risk
    riskScore += Math.min(currentDrawdown / this.parameters.maxDrawdown * 30, 30); // Drawdown risk
    riskScore += Math.min(positions.length / this.parameters.maxOpenPositions * 20, 20); // Position count risk
    
    return {
      totalRisk,
      dailyPnL,
      dailyPnLPercentage,
      currentDrawdown,
      maxDrawdownReached: this.maxDrawdownValue,
      marginUsed: totalRisk * this.accountBalance / 100, // Simplified
      marginAvailable: this.accountBalance - (totalRisk * this.accountBalance / 100),
      riskScore: Math.min(riskScore, 100)
    };
  }

  public checkRiskRules(accountRisk: AccountRisk, positionRisks: PositionRisk[]): void {
    this.rules.forEach(rule => {
      if (!rule.enabled) return;
      
      if (rule.condition(accountRisk, positionRisks)) {
        this.createAlert({
          type: rule.severity === 'critical' ? 'critical' : 'warning',
          message: `${rule.name}: ${rule.description}`,
          action: rule.action as any
        });
      }
    });
  }

  public validateOrder(symbol: string, size: number, price: number, stopLoss?: number): {
    valid: boolean;
    reason?: string;
    suggestedSize?: number;
  } {
    const positionRisk = this.calculatePositionRisk(symbol, price, size, stopLoss);
    
    // Check position size
    if (positionRisk.currentRisk > this.parameters.maxPositionSize) {
      const maxSize = (this.parameters.maxPositionSize / 100) * this.accountBalance / price;
      return {
        valid: false,
        reason: `Position size exceeds maximum allowed (${this.parameters.maxPositionSize}%)`,
        suggestedSize: Math.floor(maxSize * 100) / 100
      };
    }
    
    // Check risk per trade
    const riskAmount = Math.abs(price - (stopLoss || price * 0.98)) * size;
    const riskPercentage = (riskAmount / this.accountBalance) * 100;
    
    if (riskPercentage > this.parameters.riskPerTrade) {
      const maxSize = (this.parameters.riskPerTrade / 100) * this.accountBalance / Math.abs(price - (stopLoss || price * 0.98));
      return {
        valid: false,
        reason: `Risk per trade exceeds maximum allowed (${this.parameters.riskPerTrade}%)`,
        suggestedSize: Math.floor(maxSize * 100) / 100
      };
    }
    
    return { valid: true };
  }

  public getOptimalPositionSize(symbol: string, entryPrice: number, stopLoss: number): number {
    const riskAmount = (this.parameters.riskPerTrade / 100) * this.accountBalance;
    const priceRisk = Math.abs(entryPrice - stopLoss);
    return riskAmount / priceRisk;
  }

  public acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.notifySubscribers();
    }
  }

  public updateRiskParameters(newParameters: Partial<RiskParameters>): void {
    this.parameters = { ...this.parameters, ...newParameters };
    this.createAlert({
      type: 'info',
      message: 'Risk parameters updated',
      action: 'review_risk'
    });
  }

  public getRiskParameters(): RiskParameters {
    return { ...this.parameters };
  }

  public getAlerts(): RiskAlert[] {
    return [...this.alerts];
  }

  public getUnacknowledgedAlerts(): RiskAlert[] {
    return this.alerts.filter(alert => !alert.acknowledged);
  }

  public subscribe(callback: (alerts: RiskAlert[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  public clearAlerts(): void {
    this.alerts = [];
    this.notifySubscribers();
  }

  public exportRiskReport(): {
    parameters: RiskParameters;
    alerts: RiskAlert[];
    timestamp: Date;
  } {
    return {
      parameters: this.parameters,
      alerts: this.alerts,
      timestamp: new Date()
    };
  }
}

// Singleton instance
export const riskManagementSystem = new RiskManagementSystem();

// React Hooks
export function useRiskManagement() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [parameters, setParameters] = useState<RiskParameters>(riskManagementSystem.getRiskParameters());

  useEffect(() => {
    const unsubscribe = riskManagementSystem.subscribe(setAlerts);
    setAlerts(riskManagementSystem.getAlerts());
    return unsubscribe;
  }, []);

  const updateParameters = useCallback((newParams: Partial<RiskParameters>) => {
    riskManagementSystem.updateRiskParameters(newParams);
    setParameters(riskManagementSystem.getRiskParameters());
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    riskManagementSystem.acknowledgeAlert(alertId);
  }, []);

  const validateOrder = useCallback((symbol: string, size: number, price: number, stopLoss?: number) => {
    return riskManagementSystem.validateOrder(symbol, size, price, stopLoss);
  }, []);

  const calculatePositionRisk = useCallback((symbol: string, entryPrice: number, size: number, stopLoss?: number) => {
    return riskManagementSystem.calculatePositionRisk(symbol, entryPrice, size, stopLoss);
  }, []);

  const getOptimalPositionSize = useCallback((symbol: string, entryPrice: number, stopLoss: number) => {
    return riskManagementSystem.getOptimalPositionSize(symbol, entryPrice, stopLoss);
  }, []);

  return {
    alerts,
    parameters,
    updateParameters,
    acknowledgeAlert,
    validateOrder,
    calculatePositionRisk,
    getOptimalPositionSize,
    unacknowledgedAlerts: alerts.filter(a => !a.acknowledged),
    clearAlerts: () => riskManagementSystem.clearAlerts()
  };
}

export default riskManagementSystem;