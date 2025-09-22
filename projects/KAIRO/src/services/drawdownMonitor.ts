import { TradingSignal } from './multiMarketTradingEngine';
import { TradeResult } from './profitFactorTracker';

export interface DrawdownMetrics {
  currentDrawdown: number; // Current drawdown percentage
  maxDrawdown: number; // Maximum drawdown ever recorded
  peakEquity: number; // Highest equity point
  currentEquity: number; // Current equity value
  drawdownDuration: number; // Days in current drawdown
  maxDrawdownDuration: number; // Longest drawdown period
  recoveryFactor: number; // How quickly we recover from drawdowns
  underwaterCurve: number[]; // Historical drawdown curve
  lastPeakDate: Date; // When we last hit a new equity high
  lastUpdateTime: Date;
}

export interface DrawdownAlert {
  type: 'DRAWDOWN_WARNING' | 'DRAWDOWN_CRITICAL' | 'DRAWDOWN_RECOVERY' | 'NEW_EQUITY_HIGH';
  message: string;
  currentDrawdown: number;
  threshold: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
  recommendedActions: string[];
  autoActions?: {
    reducePositionSize?: boolean;
    pauseTrading?: boolean;
    tightenStops?: boolean;
    increaseMinConfidence?: boolean;
  };
}

export interface DrawdownConfig {
  maxAllowedDrawdown: number; // Default 0.05 (5%)
  warningThreshold: number; // Default 0.03 (3%)
  criticalThreshold: number; // Default 0.045 (4.5%)
  autoStopThreshold: number; // Default 0.06 (6%)
  recoveryThreshold: number; // Default 0.01 (1% recovery to resume)
  monitoringInterval: number; // Minutes between checks
  enableAutoActions: boolean;
  alertChannels: {
    console: boolean;
    email?: boolean;
    webhook?: boolean;
    sms?: boolean;
  };
  riskReductionSteps: {
    at3Percent: {
      reducePositionSize: number; // 0.8 = reduce to 80%
      increaseMinConfidence: number; // 0.85 = require 85% confidence
    };
    at4Percent: {
      reducePositionSize: number; // 0.6 = reduce to 60%
      increaseMinConfidence: number; // 0.90 = require 90% confidence
      tightenStops: boolean;
    };
    at5Percent: {
      pauseTrading: boolean;
      emergencyExit: boolean;
    };
  };
}

export interface EquityPoint {
  timestamp: Date;
  equity: number;
  drawdown: number;
  isNewHigh: boolean;
}

export class DrawdownMonitor {
  private metrics: DrawdownMetrics;
  private config: DrawdownConfig;
  private alerts: DrawdownAlert[] = [];
  private equityHistory: EquityPoint[] = [];
  private isInitialized = false;
  private monitoringTimer?: NodeJS.Timeout;
  private tradingPaused = false;
  private currentPositionSizeMultiplier = 1.0;
  private currentMinConfidence = 0.75;
  private lastAlertTime = new Map<string, Date>();

  constructor(config?: Partial<DrawdownConfig>) {
    this.config = {
      maxAllowedDrawdown: 0.05, // 5%
      warningThreshold: 0.03, // 3%
      criticalThreshold: 0.045, // 4.5%
      autoStopThreshold: 0.06, // 6%
      recoveryThreshold: 0.01, // 1%
      monitoringInterval: 5, // 5 minutes
      enableAutoActions: true,
      alertChannels: {
        console: true,
        email: false,
        webhook: false,
        sms: false
      },
      riskReductionSteps: {
        at3Percent: {
          reducePositionSize: 0.8,
          increaseMinConfidence: 0.85
        },
        at4Percent: {
          reducePositionSize: 0.6,
          increaseMinConfidence: 0.90,
          tightenStops: true
        },
        at5Percent: {
          pauseTrading: true,
          emergencyExit: true
        }
      },
      ...config
    };

    this.metrics = {
      currentDrawdown: 0,
      maxDrawdown: 0,
      peakEquity: 10000, // Starting equity
      currentEquity: 10000,
      drawdownDuration: 0,
      maxDrawdownDuration: 0,
      recoveryFactor: 0,
      underwaterCurve: [],
      lastPeakDate: new Date(),
      lastUpdateTime: new Date()
    };
  }

  /**
   * Initialize the drawdown monitoring system
   */
  async initialize(initialEquity: number = 10000): Promise<void> {
    console.log('GainzAlgo V2 Drawdown Monitor initializing...');
    
    this.metrics.peakEquity = initialEquity;
    this.metrics.currentEquity = initialEquity;
    this.metrics.lastPeakDate = new Date();
    
    // Add initial equity point
    this.equityHistory.push({
      timestamp: new Date(),
      equity: initialEquity,
      drawdown: 0,
      isNewHigh: true
    });
    
    // Start monitoring timer
    this.startMonitoring();
    
    this.isInitialized = true;
    console.log(`Drawdown Monitor initialized - Max allowed: ${(this.config.maxAllowedDrawdown * 100).toFixed(1)}%`);
  }

  /**
   * Update equity and calculate drawdown
   */
  async updateEquity(newEquity: number): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Drawdown Monitor not initialized');
      return;
    }

    const previousEquity = this.metrics.currentEquity;
    this.metrics.currentEquity = newEquity;
    
    // Check for new equity high
    if (newEquity > this.metrics.peakEquity) {
      this.metrics.peakEquity = newEquity;
      this.metrics.lastPeakDate = new Date();
      this.metrics.currentDrawdown = 0;
      this.metrics.drawdownDuration = 0;
      
      // Reset risk parameters on recovery
      if (this.tradingPaused) {
        await this.resumeTrading();
      }
      
      await this.createAlert({
        type: 'NEW_EQUITY_HIGH',
        message: `New equity high reached: $${newEquity.toFixed(2)}`,
        currentDrawdown: 0,
        threshold: 0,
        severity: 'LOW',
        timestamp: new Date(),
        recommendedActions: ['Continue current strategy', 'Consider taking partial profits']
      });
    } else {
      // Calculate current drawdown
      this.metrics.currentDrawdown = (this.metrics.peakEquity - newEquity) / this.metrics.peakEquity;
      this.metrics.maxDrawdown = Math.max(this.metrics.maxDrawdown, this.metrics.currentDrawdown);
      
      // Update drawdown duration
      const daysSincePeak = (Date.now() - this.metrics.lastPeakDate.getTime()) / (1000 * 60 * 60 * 24);
      this.metrics.drawdownDuration = daysSincePeak;
      this.metrics.maxDrawdownDuration = Math.max(this.metrics.maxDrawdownDuration, daysSincePeak);
    }
    
    // Add to equity history
    this.equityHistory.push({
      timestamp: new Date(),
      equity: newEquity,
      drawdown: this.metrics.currentDrawdown,
      isNewHigh: newEquity > this.metrics.peakEquity
    });
    
    // Keep only last 1000 points
    if (this.equityHistory.length > 1000) {
      this.equityHistory = this.equityHistory.slice(-1000);
    }
    
    // Update underwater curve
    this.metrics.underwaterCurve.push(this.metrics.currentDrawdown);
    if (this.metrics.underwaterCurve.length > 1000) {
      this.metrics.underwaterCurve = this.metrics.underwaterCurve.slice(-1000);
    }
    
    this.metrics.lastUpdateTime = new Date();
    
    // Check for alerts
    await this.checkDrawdownAlerts();
    
    console.log(`💧 Equity updated: $${newEquity.toFixed(2)} | Drawdown: ${(this.metrics.currentDrawdown * 100).toFixed(2)}%`);
  }

  /**
   * Process trade result and update equity
   */
  async processTradeResult(tradeResult: TradeResult): Promise<void> {
    const newEquity = this.metrics.currentEquity + tradeResult.netPnl;
    await this.updateEquity(newEquity);
  }

  /**
   * Get current drawdown metrics
   */
  getMetrics(): DrawdownMetrics {
    return { ...this.metrics };
  }

  /**
   * Get active alerts
   */
  getAlerts(): DrawdownAlert[] {
    return [...this.alerts];
  }

  /**
   * Check if trading should be paused
   */
  isTradingPaused(): boolean {
    return this.tradingPaused;
  }

  /**
   * Get current position size multiplier
   */
  getPositionSizeMultiplier(): number {
    return this.currentPositionSizeMultiplier;
  }

  /**
   * Get current minimum confidence requirement
   */
  getMinConfidenceRequirement(): number {
    return this.currentMinConfidence;
  }

  /**
   * Check if signal meets current risk criteria
   */
  shouldAcceptSignal(signal: TradingSignal): {
    accept: boolean;
    reason?: string;
    adjustedConfidence?: number;
    adjustedPositionSize?: number;
  } {
    if (this.tradingPaused) {
      return {
        accept: false,
        reason: 'Trading paused due to drawdown'
      };
    }
    
    if (signal.confidence < this.currentMinConfidence) {
      return {
        accept: false,
        reason: `Signal confidence ${(signal.confidence * 100).toFixed(1)}% below required ${(this.currentMinConfidence * 100).toFixed(1)}%`
      };
    }
    
    return {
      accept: true,
      adjustedConfidence: signal.confidence,
      adjustedPositionSize: this.currentPositionSizeMultiplier
    };
  }

  /**
   * Start monitoring timer
   */
  private startMonitoring(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
    }
    
    this.monitoringTimer = setInterval(async () => {
      await this.performPeriodicCheck();
    }, this.config.monitoringInterval * 60 * 1000);
  }

  /**
   * Perform periodic drawdown check
   */
  private async performPeriodicCheck(): Promise<void> {
    // Calculate recovery factor
    if (this.equityHistory.length > 10) {
      const recentRecoveries = this.equityHistory
        .slice(-10)
        .filter(point => point.isNewHigh).length;
      this.metrics.recoveryFactor = recentRecoveries / 10;
    }
    
    // Check for stale data
    const timeSinceUpdate = Date.now() - this.metrics.lastUpdateTime.getTime();
    if (timeSinceUpdate > 30 * 60 * 1000) { // 30 minutes
      console.warn('⚠️  Drawdown monitor: No equity updates for 30 minutes');
    }
  }

  /**
   * Check for drawdown alerts
   */
  private async checkDrawdownAlerts(): Promise<void> {
    const currentDrawdownPercent = this.metrics.currentDrawdown * 100;
    
    // Critical threshold (near max allowed)
    if (this.metrics.currentDrawdown >= this.config.criticalThreshold) {
      await this.createAlert({
        type: 'DRAWDOWN_CRITICAL',
        message: `CRITICAL: Drawdown ${currentDrawdownPercent.toFixed(2)}% approaching maximum allowed ${(this.config.maxAllowedDrawdown * 100).toFixed(1)}%`,
        currentDrawdown: this.metrics.currentDrawdown,
        threshold: this.config.criticalThreshold,
        severity: 'CRITICAL',
        timestamp: new Date(),
        recommendedActions: [
          'Immediate risk reduction required',
          'Consider emergency position exit',
          'Review strategy parameters',
          'Pause new trades until recovery'
        ],
        autoActions: {
          reducePositionSize: true,
          pauseTrading: false, // Don't auto-pause yet
          tightenStops: true,
          increaseMinConfidence: true
        }
      });
      
      // Apply 4% risk reduction
      await this.applyRiskReduction('4percent');
    }
    // Warning threshold
    else if (this.metrics.currentDrawdown >= this.config.warningThreshold) {
      await this.createAlert({
        type: 'DRAWDOWN_WARNING',
        message: `WARNING: Drawdown ${currentDrawdownPercent.toFixed(2)}% above warning threshold`,
        currentDrawdown: this.metrics.currentDrawdown,
        threshold: this.config.warningThreshold,
        severity: 'HIGH',
        timestamp: new Date(),
        recommendedActions: [
          'Monitor positions closely',
          'Reduce position sizes',
          'Increase signal confidence requirements',
          'Review recent losing trades'
        ],
        autoActions: {
          reducePositionSize: true,
          increaseMinConfidence: true
        }
      });
      
      // Apply 3% risk reduction
      await this.applyRiskReduction('3percent');
    }
    
    // Auto-stop threshold
    if (this.metrics.currentDrawdown >= this.config.autoStopThreshold) {
      await this.createAlert({
        type: 'DRAWDOWN_CRITICAL',
        message: `EMERGENCY: Drawdown ${currentDrawdownPercent.toFixed(2)}% exceeded maximum threshold - TRADING PAUSED`,
        currentDrawdown: this.metrics.currentDrawdown,
        threshold: this.config.autoStopThreshold,
        severity: 'CRITICAL',
        timestamp: new Date(),
        recommendedActions: [
          'Trading automatically paused',
          'Emergency review required',
          'Strategy recalibration needed',
          'Risk management overhaul'
        ],
        autoActions: {
          pauseTrading: true,
          reducePositionSize: true
        }
      });
      
      await this.pauseTrading();
    }
  }

  /**
   * Create and process alert
   */
  private async createAlert(alert: DrawdownAlert): Promise<void> {
    // Prevent spam alerts
    const lastAlert = this.lastAlertTime.get(alert.type);
    if (lastAlert && Date.now() - lastAlert.getTime() < 5 * 60 * 1000) { // 5 minutes
      return;
    }
    
    this.alerts.push(alert);
    this.lastAlertTime.set(alert.type, new Date());
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }
    
    // Log alert
    const emoji = alert.severity === 'CRITICAL' ? '🚨' : alert.severity === 'HIGH' ? '⚠️' : 'ℹ️';
    console.log(`${emoji} DRAWDOWN ALERT: ${alert.message}`);
    
    // Execute auto actions if enabled
    if (this.config.enableAutoActions && alert.autoActions) {
      await this.executeAutoActions(alert.autoActions);
    }
  }

  /**
   * Apply risk reduction measures
   */
  private async applyRiskReduction(level: '3percent' | '4percent' | '5percent'): Promise<void> {
    switch (level) {
      case '3percent':
        this.currentPositionSizeMultiplier = this.config.riskReductionSteps.at3Percent.reducePositionSize;
        this.currentMinConfidence = this.config.riskReductionSteps.at3Percent.increaseMinConfidence;
        break;
      case '4percent':
        this.currentPositionSizeMultiplier = this.config.riskReductionSteps.at4Percent.reducePositionSize;
        this.currentMinConfidence = this.config.riskReductionSteps.at4Percent.increaseMinConfidence;
        break;
      case '5percent':
        if (this.config.riskReductionSteps.at5Percent.pauseTrading) {
          await this.pauseTrading();
        }
        break;
    }
    
    console.log(`🛡️  Risk reduction applied (${level}): Position size ${(this.currentPositionSizeMultiplier * 100).toFixed(0)}%, Min confidence ${(this.currentMinConfidence * 100).toFixed(0)}%`);
  }

  /**
   * Execute automatic actions
   */
  private async executeAutoActions(actions: NonNullable<DrawdownAlert['autoActions']>): Promise<void> {
    if (actions.pauseTrading) {
      await this.pauseTrading();
    }
    
    if (actions.reducePositionSize) {
      // Already handled in applyRiskReduction
    }
    
    if (actions.increaseMinConfidence) {
      // Already handled in applyRiskReduction
    }
    
    if (actions.tightenStops) {
      console.log('🎯 Auto-action: Tightening stop losses');
      // This would integrate with position management
    }
  }

  /**
   * Pause trading due to drawdown
   */
  private async pauseTrading(): Promise<void> {
    this.tradingPaused = true;
    console.log('🛑 Trading PAUSED due to drawdown threshold breach');
  }

  /**
   * Resume trading after recovery
   */
  private async resumeTrading(): Promise<void> {
    if (this.metrics.currentDrawdown <= this.config.recoveryThreshold) {
      this.tradingPaused = false;
      this.currentPositionSizeMultiplier = 1.0;
      this.currentMinConfidence = 0.75;
      
      console.log('✅ Trading RESUMED - Drawdown recovered');
      
      await this.createAlert({
        type: 'DRAWDOWN_RECOVERY',
        message: 'Trading resumed - drawdown recovered below threshold',
        currentDrawdown: this.metrics.currentDrawdown,
        threshold: this.config.recoveryThreshold,
        severity: 'LOW',
        timestamp: new Date(),
        recommendedActions: ['Monitor performance closely', 'Gradually increase position sizes']
      });
    }
  }

  /**
   * Get drawdown statistics
   */
  getDrawdownStats(): {
    current: number;
    maximum: number;
    duration: number;
    maxDuration: number;
    recoveryFactor: number;
    isHealthy: boolean;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  } {
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    
    if (this.metrics.currentDrawdown >= this.config.autoStopThreshold) {
      riskLevel = 'CRITICAL';
    } else if (this.metrics.currentDrawdown >= this.config.criticalThreshold) {
      riskLevel = 'HIGH';
    } else if (this.metrics.currentDrawdown >= this.config.warningThreshold) {
      riskLevel = 'MEDIUM';
    }
    
    return {
      current: this.metrics.currentDrawdown,
      maximum: this.metrics.maxDrawdown,
      duration: this.metrics.drawdownDuration,
      maxDuration: this.metrics.maxDrawdownDuration,
      recoveryFactor: this.metrics.recoveryFactor,
      isHealthy: this.metrics.currentDrawdown < this.config.warningThreshold,
      riskLevel
    };
  }

  /**
   * Export drawdown data
   */
  exportDrawdownData() {
    return {
      config: this.config,
      metrics: this.metrics,
      alerts: this.alerts,
      equityHistory: this.equityHistory,
      stats: this.getDrawdownStats(),
      status: {
        tradingPaused: this.tradingPaused,
        positionSizeMultiplier: this.currentPositionSizeMultiplier,
        minConfidenceRequirement: this.currentMinConfidence
      }
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
    }
    console.log('Drawdown Monitor destroyed');
  }
}