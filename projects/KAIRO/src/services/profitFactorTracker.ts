import { TradingSignal } from './multiMarketTradingEngine';
import { TradeEntry } from './tradeLoggingSystem';

export interface ProfitFactorMetrics {
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  expectancy: number;
  sharpeRatio: number;
  calmarRatio: number;
  lastUpdated: Date;
}

export interface ProfitFactorAlert {
  type: 'PROFIT_FACTOR_LOW' | 'PROFIT_FACTOR_HIGH' | 'WIN_RATE_LOW' | 'EXPECTANCY_NEGATIVE';
  message: string;
  currentValue: number;
  targetValue: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: Date;
  recommendations: string[];
}

export interface TradeResult {
  signalId: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercentage: number;
  entryTime: Date;
  exitTime: Date;
  holdingPeriod: number; // in minutes
  signal: 'BUY' | 'SELL';
  isWin: boolean;
  riskReward: number;
  commission: number;
  slippage: number;
  netPnl: number;
}

export interface ProfitFactorConfig {
  targetProfitFactor: number; // Default 1.6
  minWinRate: number; // Default 0.65 (65%)
  alertThresholds: {
    profitFactorLow: number; // Default 1.2
    profitFactorCritical: number; // Default 1.0
    winRateLow: number; // Default 0.60
    winRateCritical: number; // Default 0.55
  };
  trackingPeriods: {
    realTime: boolean;
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  riskFreeRate: number; // For Sharpe ratio calculation
}

export class ProfitFactorTracker {
  private tradeResults: TradeResult[] = [];
  private metrics: Map<string, ProfitFactorMetrics> = new Map(); // By time period
  private alerts: ProfitFactorAlert[] = [];
  private config: ProfitFactorConfig;
  private consecutiveWinStreak = 0;
  private consecutiveLossStreak = 0;
  private maxDrawdown = 0;
  private currentDrawdown = 0;
  private peakEquity = 0;
  private currentEquity = 0;
  private isInitialized = false;

  constructor(config?: Partial<ProfitFactorConfig>) {
    this.config = {
      targetProfitFactor: 1.6,
      minWinRate: 0.65,
      alertThresholds: {
        profitFactorLow: 1.2,
        profitFactorCritical: 1.0,
        winRateLow: 0.60,
        winRateCritical: 0.55
      },
      trackingPeriods: {
        realTime: true,
        daily: true,
        weekly: true,
        monthly: true
      },
      riskFreeRate: 0.02, // 2% annual risk-free rate
      ...config
    };
  }

  /**
   * Initialize the profit factor tracking system
   */
  async initialize(): Promise<void> {
    console.log('GainzAlgo V2 Profit Factor Tracker initializing...');
    
    // Initialize metrics for different time periods
    this.initializeMetrics('realTime');
    this.initializeMetrics('daily');
    this.initializeMetrics('weekly');
    this.initializeMetrics('monthly');
    
    this.isInitialized = true;
    console.log(`Profit Factor Tracker initialized - Target: ${this.config.targetProfitFactor}x`);
  }

  /**
   * Record a completed trade result
   */
  async recordTradeResult(result: TradeResult): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Profit Factor Tracker not initialized');
      return;
    }

    this.tradeResults.push(result);
    this.currentEquity += result.netPnl;
    
    // Update peak equity and drawdown
    if (this.currentEquity > this.peakEquity) {
      this.peakEquity = this.currentEquity;
      this.currentDrawdown = 0;
    } else {
      this.currentDrawdown = (this.peakEquity - this.currentEquity) / this.peakEquity;
      this.maxDrawdown = Math.max(this.maxDrawdown, this.currentDrawdown);
    }

    // Update win/loss streaks
    if (result.isWin) {
      this.consecutiveWinStreak++;
      this.consecutiveLossStreak = 0;
    } else {
      this.consecutiveLossStreak++;
      this.consecutiveWinStreak = 0;
    }

    // Update metrics for all tracking periods
    if (this.config.trackingPeriods.realTime) {
      this.updateMetrics('realTime', result);
    }
    if (this.config.trackingPeriods.daily) {
      this.updateMetrics('daily', result);
    }
    if (this.config.trackingPeriods.weekly) {
      this.updateMetrics('weekly', result);
    }
    if (this.config.trackingPeriods.monthly) {
      this.updateMetrics('monthly', result);
    }

    // Check for alerts
    await this.checkAlertConditions();

    console.log(`📊 Trade recorded: ${result.symbol} ${result.isWin ? '✅' : '❌'} PnL: ${result.netPnl.toFixed(2)}`);
  }

  /**
   * Get current profit factor metrics
   */
  getMetrics(period: string = 'realTime'): ProfitFactorMetrics | null {
    return this.metrics.get(period) || null;
  }

  /**
   * Get all active alerts
   */
  getAlerts(): ProfitFactorAlert[] {
    return [...this.alerts];
  }

  /**
   * Get profit factor performance summary
   */
  getPerformanceSummary(): {
    currentProfitFactor: number;
    targetProfitFactor: number;
    isTargetMet: boolean;
    winRate: number;
    totalTrades: number;
    expectancy: number;
    maxDrawdown: number;
    currentDrawdown: number;
    sharpeRatio: number;
    recommendations: string[];
  } {
    const metrics = this.getMetrics('realTime');
    if (!metrics) {
      return {
        currentProfitFactor: 0,
        targetProfitFactor: this.config.targetProfitFactor,
        isTargetMet: false,
        winRate: 0,
        totalTrades: 0,
        expectancy: 0,
        maxDrawdown: 0,
        currentDrawdown: 0,
        sharpeRatio: 0,
        recommendations: ['No trades recorded yet']
      };
    }

    const recommendations = this.generateRecommendations(metrics);

    return {
      currentProfitFactor: metrics.profitFactor,
      targetProfitFactor: this.config.targetProfitFactor,
      isTargetMet: metrics.profitFactor >= this.config.targetProfitFactor,
      winRate: metrics.winRate,
      totalTrades: metrics.totalTrades,
      expectancy: metrics.expectancy,
      maxDrawdown: this.maxDrawdown,
      currentDrawdown: this.currentDrawdown,
      sharpeRatio: metrics.sharpeRatio,
      recommendations
    };
  }

  /**
   * Initialize metrics for a time period
   */
  private initializeMetrics(period: string): void {
    const metrics: ProfitFactorMetrics = {
      grossProfit: 0,
      grossLoss: 0,
      profitFactor: 0,
      winRate: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      maxConsecutiveWins: 0,
      maxConsecutiveLosses: 0,
      expectancy: 0,
      sharpeRatio: 0,
      calmarRatio: 0,
      lastUpdated: new Date()
    };
    
    this.metrics.set(period, metrics);
  }

  /**
   * Update metrics for a specific time period
   */
  private updateMetrics(period: string, result: TradeResult): void {
    const metrics = this.metrics.get(period);
    if (!metrics) return;

    // Update basic counts
    metrics.totalTrades++;
    if (result.isWin) {
      metrics.winningTrades++;
      metrics.grossProfit += result.netPnl;
      metrics.largestWin = Math.max(metrics.largestWin, result.netPnl);
    } else {
      metrics.losingTrades++;
      metrics.grossLoss += Math.abs(result.netPnl);
      metrics.largestLoss = Math.max(metrics.largestLoss, Math.abs(result.netPnl));
    }

    // Calculate derived metrics
    metrics.winRate = metrics.winningTrades / metrics.totalTrades;
    metrics.profitFactor = metrics.grossLoss > 0 ? metrics.grossProfit / metrics.grossLoss : 0;
    metrics.averageWin = metrics.winningTrades > 0 ? metrics.grossProfit / metrics.winningTrades : 0;
    metrics.averageLoss = metrics.losingTrades > 0 ? metrics.grossLoss / metrics.losingTrades : 0;
    
    // Update consecutive streaks
    metrics.consecutiveWins = this.consecutiveWinStreak;
    metrics.consecutiveLosses = this.consecutiveLossStreak;
    metrics.maxConsecutiveWins = Math.max(metrics.maxConsecutiveWins, this.consecutiveWinStreak);
    metrics.maxConsecutiveLosses = Math.max(metrics.maxConsecutiveLosses, this.consecutiveLossStreak);
    
    // Calculate expectancy
    metrics.expectancy = (metrics.winRate * metrics.averageWin) - ((1 - metrics.winRate) * metrics.averageLoss);
    
    // Calculate Sharpe ratio (simplified)
    const returns = this.tradeResults.map(t => t.pnlPercentage);
    if (returns.length > 1) {
      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
      metrics.sharpeRatio = stdDev > 0 ? (avgReturn - this.config.riskFreeRate / 252) / stdDev : 0;
    }
    
    // Calculate Calmar ratio
    metrics.calmarRatio = this.maxDrawdown > 0 ? metrics.expectancy / this.maxDrawdown : 0;
    
    metrics.lastUpdated = new Date();
  }

  /**
   * Check for alert conditions
   */
  private async checkAlertConditions(): Promise<void> {
    const metrics = this.getMetrics('realTime');
    if (!metrics || metrics.totalTrades < 10) return; // Need minimum trades for reliable metrics

    // Clear old alerts
    this.alerts = [];

    // Check profit factor alerts
    if (metrics.profitFactor < this.config.alertThresholds.profitFactorCritical) {
      this.alerts.push({
        type: 'PROFIT_FACTOR_LOW',
        message: `Critical: Profit factor ${metrics.profitFactor.toFixed(2)} is below critical threshold`,
        currentValue: metrics.profitFactor,
        targetValue: this.config.targetProfitFactor,
        severity: 'CRITICAL',
        timestamp: new Date(),
        recommendations: [
          'Review and optimize signal generation algorithm',
          'Implement stricter entry criteria',
          'Consider reducing position sizes',
          'Analyze losing trades for patterns'
        ]
      });
    } else if (metrics.profitFactor < this.config.alertThresholds.profitFactorLow) {
      this.alerts.push({
        type: 'PROFIT_FACTOR_LOW',
        message: `Warning: Profit factor ${metrics.profitFactor.toFixed(2)} is below target`,
        currentValue: metrics.profitFactor,
        targetValue: this.config.targetProfitFactor,
        severity: 'HIGH',
        timestamp: new Date(),
        recommendations: [
          'Monitor signal quality closely',
          'Consider tightening stop losses',
          'Review risk management parameters'
        ]
      });
    }

    // Check win rate alerts
    if (metrics.winRate < this.config.alertThresholds.winRateCritical) {
      this.alerts.push({
        type: 'WIN_RATE_LOW',
        message: `Critical: Win rate ${(metrics.winRate * 100).toFixed(1)}% is critically low`,
        currentValue: metrics.winRate,
        targetValue: this.config.minWinRate,
        severity: 'CRITICAL',
        timestamp: new Date(),
        recommendations: [
          'Pause trading and review strategy',
          'Analyze market conditions',
          'Consider algorithm recalibration'
        ]
      });
    } else if (metrics.winRate < this.config.alertThresholds.winRateLow) {
      this.alerts.push({
        type: 'WIN_RATE_LOW',
        message: `Warning: Win rate ${(metrics.winRate * 100).toFixed(1)}% is below target`,
        currentValue: metrics.winRate,
        targetValue: this.config.minWinRate,
        severity: 'HIGH',
        timestamp: new Date(),
        recommendations: [
          'Review recent losing trades',
          'Consider market regime changes',
          'Optimize entry timing'
        ]
      });
    }

    // Check expectancy alerts
    if (metrics.expectancy < 0) {
      this.alerts.push({
        type: 'EXPECTANCY_NEGATIVE',
        message: `Critical: Negative expectancy ${metrics.expectancy.toFixed(2)}`,
        currentValue: metrics.expectancy,
        targetValue: 0,
        severity: 'CRITICAL',
        timestamp: new Date(),
        recommendations: [
          'Immediate strategy review required',
          'Stop trading until issues resolved',
          'Analyze risk-reward ratios',
          'Consider complete algorithm overhaul'
        ]
      });
    }

    // Log alerts
    this.alerts.forEach(alert => {
      console.log(`🚨 ${alert.severity}: ${alert.message}`);
    });
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: ProfitFactorMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.profitFactor >= this.config.targetProfitFactor) {
      recommendations.push('✅ Profit factor target achieved - maintain current strategy');
    } else {
      recommendations.push('📈 Focus on improving profit factor through better risk management');
    }

    if (metrics.winRate >= this.config.minWinRate) {
      recommendations.push('✅ Win rate target achieved');
    } else {
      recommendations.push('🎯 Improve signal accuracy to increase win rate');
    }

    if (metrics.averageWin < metrics.averageLoss * 2) {
      recommendations.push('💰 Consider letting winners run longer to improve average win');
    }

    if (metrics.maxConsecutiveLosses > 5) {
      recommendations.push('🛑 Implement circuit breakers for consecutive losses');
    }

    if (this.maxDrawdown > 0.05) {
      recommendations.push('📉 Reduce position sizes to limit drawdown');
    }

    return recommendations;
  }

  /**
   * Reset metrics for a new period
   */
  resetMetrics(period: string): void {
    this.initializeMetrics(period);
    console.log(`📊 Metrics reset for period: ${period}`);
  }

  /**
   * Export performance data
   */
  exportPerformanceData(): {
    config: ProfitFactorConfig;
    metrics: { [period: string]: ProfitFactorMetrics };
    tradeResults: TradeResult[];
    alerts: ProfitFactorAlert[];
    summary: any;
  } {
    const metricsObj: { [period: string]: ProfitFactorMetrics } = {};
    this.metrics.forEach((value, key) => {
      metricsObj[key] = value;
    });

    return {
      config: this.config,
      metrics: metricsObj,
      tradeResults: this.tradeResults,
      alerts: this.alerts,
      summary: this.getPerformanceSummary()
    };
  }
}