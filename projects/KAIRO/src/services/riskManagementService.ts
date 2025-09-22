import { RiskManagementConfig } from '@/components/trading/RiskManagementInterface';
import { TradingSignal, TradeResult } from './types';
import { EventEmitter } from 'events';

export interface RiskAlert {
  id: string;
  type: 'drawdown_warning' | 'profit_target' | 'risk_limit_exceeded' | 'low_win_rate';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  data?: any;
}

export interface RiskMetrics {
  currentDrawdown: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  avgRiskReward: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  sharpeRatio: number;
  calmarRatio: number;
  portfolioVaR: number;
  correlationRisk: number;
  concentrationRisk: number;
  volatilityIndex: number;
}

export class RiskManagementService extends EventEmitter {
  private config: RiskManagementConfig;
  private metrics: RiskMetrics;
  private tradeHistory: TradeResult[] = [];
  private dailyTrades: Map<string, TradeResult[]> = new Map();
  private alerts: RiskAlert[] = [];
  private isTradesPaused: boolean = false;
  private lastOptimizationUpdate: Date = new Date();
  private activePositions: Map<string, TradeResult> = new Map();
  private correlationMatrix: Map<string, Map<string, number>> = new Map();
  private volatilityHistory: Map<string, number[]> = new Map();

  constructor(initialConfig: RiskManagementConfig) {
    super();
    this.config = initialConfig;
    this.metrics = this.initializeMetrics();
    
    // Auto-save configuration changes
    this.on('configUpdated', this.saveConfiguration.bind(this));
  }

  private initializeMetrics(): RiskMetrics {
    return {
      currentDrawdown: 0,
      maxDrawdown: 0,
      winRate: 0,
      profitFactor: 1,
      totalTrades: 0,
      avgRiskReward: 0,
      dailyPnL: 0,
      weeklyPnL: 0,
      monthlyPnL: 0,
      sharpeRatio: 0,
      calmarRatio: 0,
      portfolioVaR: 0,
      correlationRisk: 0,
      concentrationRisk: 0,
      volatilityIndex: 0
    };
  }

  /**
   * Update risk management configuration
   */
  updateConfiguration(newConfig: Partial<RiskManagementConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('configUpdated', this.config);
    
    console.log('Risk management configuration updated:', {
      maxRiskPerTrade: this.config.maxRiskPerTrade,
      maxDrawdown: this.config.maxDrawdown,
      autoOptimization: this.config.autoOptimization.enabled
    });
  }

  /**
   * Validate if a trading signal meets risk criteria
   */
  validateSignal(signal: TradingSignal): {
    approved: boolean;
    adjustedSignal?: TradingSignal;
    reason?: string;
  } {
    // Check if trading is paused due to risk limits
    if (this.isTradesPaused) {
      return {
        approved: false,
        reason: 'Trading paused due to risk limits exceeded'
      };
    }

    // Check daily loss limit
    const today = new Date().toISOString().split('T')[0];
    const todayTrades = this.dailyTrades.get(today) || [];
    const dailyLoss = todayTrades.reduce((loss, trade) => {
      return trade.pnl && trade.pnl < 0 ? loss + Math.abs(trade.pnl) : loss;
    }, 0);

    if (dailyLoss >= this.config.maxDailyLoss) {
      this.pauseTrading('Daily loss limit exceeded');
      return {
        approved: false,
        reason: `Daily loss limit of ${this.config.maxDailyLoss}% exceeded`
      };
    }

    // Check drawdown limit
    if (this.metrics.currentDrawdown >= this.config.maxDrawdown) {
      this.pauseTrading('Maximum drawdown exceeded');
      return {
        approved: false,
        reason: `Maximum drawdown of ${this.config.maxDrawdown}% exceeded`
      };
    }

    // Check risk-reward ratio
    const riskRewardRatio = this.calculateRiskReward(signal);
    if (riskRewardRatio < this.config.minRiskRewardRatio) {
      return {
        approved: false,
        reason: `Risk-reward ratio ${riskRewardRatio.toFixed(2)} below minimum ${this.config.minRiskRewardRatio}`
      };
    }

    // Check correlation risk
    const correlationCheck = this.checkCorrelationRisk(signal);
    if (!correlationCheck.approved) {
      return correlationCheck;
    }

    // Check concentration risk
    const concentrationCheck = this.checkConcentrationRisk(signal);
    if (!concentrationCheck.approved) {
      return concentrationCheck;
    }

    // Check portfolio VaR
    const varCheck = this.checkPortfolioVaR(signal);
    if (!varCheck.approved) {
      return varCheck;
    }

    // Apply dynamic adjustments if enabled
    let adjustedSignal = signal;
    if (this.config.dynamicSizing.enabled || this.config.autoOptimization.enabled) {
      adjustedSignal = this.applyDynamicAdjustments(signal);
    }

    return {
      approved: true,
      adjustedSignal
    };
  }

  /**
   * Process completed trade and update metrics
   */
  processTradeResult(tradeResult: TradeResult): void {
    this.tradeHistory.push(tradeResult);
    
    // Update active positions
    this.updateActivePositions(tradeResult);
    
    // Update volatility history
    this.updateVolatilityHistory(tradeResult);
    
    // Update daily trades
    const tradeDate = new Date(tradeResult.entryTime).toDateString();
    if (!this.dailyTrades.has(tradeDate)) {
      this.dailyTrades.set(tradeDate, []);
    }
    this.dailyTrades.get(tradeDate)!.push(tradeResult);
    
    // Update metrics
    this.updateMetrics();
    
    // Check for risk alerts
    this.checkRiskAlerts(tradeResult);
    
    // Perform auto-optimization if enabled
    if (this.config.autoOptimization.enabled) {
      this.performAutoOptimization();
    }

    console.log('Trade processed:', {
      symbol: tradeResult.signal.symbol,
      pnl: tradeResult.pnl,
      currentDrawdown: this.metrics.currentDrawdown,
      winRate: this.metrics.winRate
    });
  }

  /**
   * Update active positions tracking
   */
  private updateActivePositions(tradeResult: TradeResult): void {
    const symbol = tradeResult.signal.symbol;
    
    if (tradeResult.exitTime) {
      // Trade closed, remove from active positions
      this.activePositions.delete(symbol);
    } else {
      // Trade opened or updated, add/update active position
      this.activePositions.set(symbol, tradeResult);
    }
  }

  /**
   * Update volatility history for risk calculations
   */
  private updateVolatilityHistory(tradeResult: TradeResult): void {
    const symbol = tradeResult.signal.symbol;
    const pnl = tradeResult.pnl || 0;
    
    if (!this.volatilityHistory.has(symbol)) {
      this.volatilityHistory.set(symbol, []);
    }
    
    const history = this.volatilityHistory.get(symbol)!;
    history.push(Math.abs(pnl));
    
    // Keep only last 50 data points
    if (history.length > 50) {
      history.shift();
    }
  }

  /**
   * Calculate risk-reward ratio for a signal
   */
  private calculateRiskReward(signal: TradingSignal): number {
    if (!signal.stopLoss || !signal.takeProfit) {
      return 0;
    }

    const entryPrice = signal.entryPrice || 0;
    const stopLoss = signal.stopLoss;
    const takeProfit = signal.takeProfit;

    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);

    return risk > 0 ? reward / risk : 0;
  }

  /**
   * Apply dynamic position sizing and risk adjustments
   */
  private applyDynamicAdjustments(signal: TradingSignal): TradingSignal {
    let adjustedSignal = { ...signal };
    let positionSizeMultiplier = 1;

    // Volatility adjustment
    if (this.config.dynamicSizing.enabled) {
      const volatilityFactor = this.getVolatilityAdjustment();
      positionSizeMultiplier *= volatilityFactor;
    }

    // Confidence-based sizing
    if (signal.confidence && this.config.dynamicSizing.enabled) {
      const confidenceMultiplier = 1 + (signal.confidence - 0.5) * this.config.dynamicSizing.confidenceMultiplier;
      positionSizeMultiplier *= confidenceMultiplier;
    }

    // Drawdown reduction
    if (this.config.dynamicSizing.drawdownReduction && this.metrics.currentDrawdown > 0.02) {
      const drawdownReduction = 1 - (this.metrics.currentDrawdown * 0.5);
      positionSizeMultiplier *= Math.max(drawdownReduction, 0.3); // Minimum 30% position size
    }

    // Time-of-day adjustment
    if (this.config.autoOptimization.timeOfDayAdjustment) {
      const timeAdjustment = this.getTimeOfDayAdjustment();
      positionSizeMultiplier *= timeAdjustment;
    }

    // Apply position size limits
    const maxPositionSize = this.config.maxPositionSize / 100;
    const adjustedPositionSize = Math.min(
      (this.config.maxRiskPerTrade / 100) * positionSizeMultiplier,
      maxPositionSize
    );

    // Add position size to metadata since it's not part of the TradingSignal interface
    adjustedSignal.metadata = {
      ...adjustedSignal.metadata,
      riskParameters: {
        ...adjustedSignal.metadata?.riskParameters,
        adjustedPositionSize: adjustedPositionSize
      }
    };

    return adjustedSignal;
  }

  /**
   * Get volatility-based position size adjustment
   */
  private getVolatilityAdjustment(): number {
    // Calculate recent volatility from trade history
    const recentTrades = this.tradeHistory.slice(-20);
    if (recentTrades.length < 5) return 1;

    const returns = recentTrades.map(trade => trade.pnl || 0);
    const avgReturn = returns.reduce((sum, ret) => (sum || 0) + (ret || 0), 0) / returns.length;
    const variance = returns.reduce((sum, ret) => (sum || 0) + Math.pow((ret || 0) - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    // Reduce position size in high volatility
    const volatilityThreshold = 0.02; // 2%
    if (volatility > volatilityThreshold) {
      return Math.max(0.5, 1 - (volatility - volatilityThreshold) * this.config.dynamicSizing.volatilityFactor);
    }

    return 1;
  }

  /**
   * Get time-of-day position size adjustment
   */
  private getTimeOfDayAdjustment(): number {
    const hour = new Date().getUTCHours();
    
    // Reduce position size during low liquidity hours (22:00-02:00 UTC)
    if (hour >= 22 || hour <= 2) {
      return 0.7; // 30% reduction
    }
    
    // Reduce position size during lunch hours (11:00-13:00 UTC)
    if (hour >= 11 && hour <= 13) {
      return 0.85; // 15% reduction
    }

    return 1;
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(): void {
    if (this.tradeHistory.length === 0) return;

    const totalTrades = this.tradeHistory.length;
    const winningTrades = this.tradeHistory.filter(trade => (trade.pnl || 0) > 0);
    const losingTrades = this.tradeHistory.filter(trade => (trade.pnl || 0) < 0);

    // Win rate
    const winRate = winningTrades.length / totalTrades;

    // Profit factor
    const grossProfit = winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 1;

    // Average risk-reward
    const riskRewards = this.tradeHistory
      .filter(trade => trade.signal?.stopLoss && trade.signal?.takeProfit)
      .map(trade => {
        const risk = Math.abs((trade.entryPrice || 0) - (trade.signal?.stopLoss || 0));
        const reward = Math.abs((trade.signal?.takeProfit || 0) - (trade.entryPrice || 0));
        return risk > 0 ? reward / risk : 0;
      });
    const avgRiskReward = riskRewards.length > 0 
      ? riskRewards.reduce((sum, rr) => sum + rr, 0) / riskRewards.length 
      : 0;

    // Drawdown calculation
    let peak = 0;
    let currentDrawdown = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;

    for (const trade of this.tradeHistory) {
      runningPnL += (trade.pnl || 0);
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      currentDrawdown = peak > 0 ? (peak - runningPnL) / peak : 0;
      maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
    }

    // Time-based PnL
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailyPnL = this.tradeHistory
      .filter(trade => new Date(trade.entryTime) >= oneDayAgo)
      .reduce((sum, trade) => sum + (trade.pnl || 0), 0);

    const weeklyPnL = this.tradeHistory
      .filter(trade => new Date(trade.entryTime) >= oneWeekAgo)
      .reduce((sum, trade) => sum + (trade.pnl || 0), 0);

    const monthlyPnL = this.tradeHistory
      .filter(trade => new Date(trade.entryTime) >= oneMonthAgo)
      .reduce((sum, trade) => sum + (trade.pnl || 0), 0);

    // Sharpe ratio (simplified)
    const returns = this.tradeHistory.map(trade => trade.pnl || 0);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const returnStdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = returnStdDev > 0 ? avgReturn / returnStdDev : 0;

    // Calmar ratio
    const calmarRatio = maxDrawdown > 0 ? (monthlyPnL * 12) / maxDrawdown : 0;

    this.metrics = {
      currentDrawdown,
      maxDrawdown,
      winRate,
      profitFactor,
      totalTrades,
      avgRiskReward,
      dailyPnL,
      weeklyPnL,
      monthlyPnL,
      sharpeRatio,
      calmarRatio,
      portfolioVaR: this.calculatePortfolioVaR(),
      correlationRisk: this.calculateCorrelationRisk(),
      concentrationRisk: this.calculateConcentrationRisk(),
      volatilityIndex: this.calculateVolatilityIndex()
    };

    this.emit('metricsUpdated', this.metrics);
  }

  /**
   * Check for risk alerts and emit notifications
   */
  private checkRiskAlerts(tradeResult: TradeResult): void {
    const alerts: RiskAlert[] = [];

    // Drawdown warning
    if (this.config.alerts.drawdownWarning && this.metrics.currentDrawdown > this.config.maxDrawdown * 0.8) {
      alerts.push({
        id: `drawdown_${Date.now()}`,
        type: 'drawdown_warning',
        severity: this.metrics.currentDrawdown > this.config.maxDrawdown * 0.9 ? 'critical' : 'high',
        message: `Drawdown at ${(this.metrics.currentDrawdown * 100).toFixed(1)}% - approaching limit of ${this.config.maxDrawdown}%`,
        timestamp: new Date(),
        data: { currentDrawdown: this.metrics.currentDrawdown, maxDrawdown: this.config.maxDrawdown }
      });
    }

    // Low win rate alert
    if (this.config.alerts.lowWinRateAlert && 
        this.metrics.totalTrades >= 10 && 
        this.metrics.winRate < this.config.autoOptimization.targetWinRate * 0.8) {
      alerts.push({
        id: `winrate_${Date.now()}`,
        type: 'low_win_rate',
        severity: 'medium',
        message: `Win rate at ${(this.metrics.winRate * 100).toFixed(1)}% - below target of ${(this.config.autoOptimization.targetWinRate * 100).toFixed(1)}%`,
        timestamp: new Date(),
        data: { currentWinRate: this.metrics.winRate, targetWinRate: this.config.autoOptimization.targetWinRate }
      });
    }

    // Risk limit exceeded
    if (this.config.alerts.riskLimitExceeded && Math.abs(tradeResult.pnl || 0) > this.config.maxRiskPerTrade) {
      alerts.push({
        id: `risk_${Date.now()}`,
        type: 'risk_limit_exceeded',
        severity: 'high',
        message: `Trade risk of ${Math.abs(tradeResult.pnl || 0).toFixed(2)}% exceeded limit of ${this.config.maxRiskPerTrade}%`,
        timestamp: new Date(),
        data: { tradeRisk: Math.abs(tradeResult.pnl || 0), maxRisk: this.config.maxRiskPerTrade }
      });
    }

    // Profit target reached
    if (this.config.alerts.profitTargetReached && (tradeResult.pnl || 0) > this.config.maxRiskPerTrade * 2) {
      alerts.push({
        id: `profit_${Date.now()}`,
        type: 'profit_target',
        severity: 'low',
        message: `Profit target reached: ${(tradeResult.pnl || 0).toFixed(2)}% on ${tradeResult.signal.symbol}`,
         timestamp: new Date(),
         data: { profit: tradeResult.pnl || 0, symbol: tradeResult.signal.symbol }
      });
    }

    // Add alerts and emit events
    alerts.forEach(alert => {
      this.alerts.push(alert);
      this.emit('riskAlert', alert);
    });

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  /**
   * Perform automatic optimization based on performance
   */
  private performAutoOptimization(): void {
    if (!this.config.autoOptimization.enabled || this.metrics.totalTrades < 20) {
      return;
    }

    // Only optimize every 10 trades to avoid over-optimization
    if (this.metrics.totalTrades % 10 !== 0) {
      return;
    }

    const optimizations: Partial<RiskManagementConfig> = {};

    // Adaptive risk-reward based on win rate
    if (this.config.autoOptimization.adaptiveRiskReward) {
      if (this.metrics.winRate < this.config.autoOptimization.targetWinRate) {
        // Lower win rate - increase risk-reward requirement
        optimizations.minRiskRewardRatio = Math.min(
          this.config.minRiskRewardRatio * 1.1,
          4.0
        );
      } else if (this.metrics.winRate > this.config.autoOptimization.targetWinRate * 1.1) {
        // Higher win rate - can accept lower risk-reward
        optimizations.minRiskRewardRatio = Math.max(
          this.config.minRiskRewardRatio * 0.95,
          1.5
        );
      }
    }

    // Adjust position sizing based on recent performance
    if (this.metrics.profitFactor < 1.2) {
      // Poor performance - reduce position size
      optimizations.maxRiskPerTrade = Math.max(
        this.config.maxRiskPerTrade * 0.9,
        0.5
      );
    } else if (this.metrics.profitFactor > 2.0 && this.metrics.currentDrawdown < 0.02) {
      // Good performance and low drawdown - can increase position size slightly
      optimizations.maxRiskPerTrade = Math.min(
        this.config.maxRiskPerTrade * 1.05,
        5.0
      );
    }

    // Apply optimizations if any
    if (Object.keys(optimizations).length > 0) {
      this.updateConfiguration(optimizations);
      this.lastOptimizationUpdate = new Date();
      
      console.log('Auto-optimization applied:', optimizations);
      this.emit('autoOptimization', {
        timestamp: new Date(),
        changes: optimizations,
        metrics: this.metrics
      });
    }
  }

  /**
   * Pause trading due to risk limits
   */
  private pauseTrading(reason: string): void {
    this.isTradesPaused = true;
    
    const alert: RiskAlert = {
      id: `pause_${Date.now()}`,
      type: 'risk_limit_exceeded',
      severity: 'critical',
      message: `Trading paused: ${reason}`,
      timestamp: new Date(),
      data: { reason }
    };
    
    this.alerts.push(alert);
    this.emit('tradingPaused', { reason, alert });
    
    console.warn('Trading paused:', reason);
  }

  /**
   * Resume trading (manual override)
   */
  resumeTrading(): void {
    this.isTradesPaused = false;
    this.emit('tradingResumed', { timestamp: new Date() });
    console.log('Trading resumed manually');
  }

  /**
   * Save configuration to storage
   */
  private saveConfiguration(): void {
    try {
      localStorage.setItem('riskManagementConfig', JSON.stringify(this.config));
      console.log('Risk management configuration saved');
    } catch (error) {
      console.error('Failed to save risk management configuration:', error);
    }
  }

  /**
   * Load configuration from storage
   */
  static loadConfiguration(): RiskManagementConfig | null {
    try {
      const saved = localStorage.getItem('riskManagementConfig');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to load risk management configuration:', error);
      return null;
    }
  }

  // Getters
  getConfiguration(): RiskManagementConfig {
    return { ...this.config };
  }

  getMetrics(): RiskMetrics {
    return { ...this.metrics };
  }

  getAlerts(): RiskAlert[] {
    return [...this.alerts];
  }

  getRecentAlerts(hours: number = 24): RiskAlert[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.alerts.filter(alert => alert.timestamp >= cutoff);
  }

  isTrading(): boolean {
    return !this.isTradesPaused;
  }

  getTradeHistory(): TradeResult[] {
    return [...this.tradeHistory];
  }

  /**
   * Check correlation risk for a new signal
   */
  private checkCorrelationRisk(signal: TradingSignal): {
     approved: boolean;
     reason?: string;
   } {
     const correlationThreshold = 0.7;
     
     for (const [symbol, position] of Array.from(this.activePositions.entries())) {
       if (symbol !== signal.symbol) {
         const correlation = this.getCorrelation(signal.symbol, symbol);
         if (Math.abs(correlation) > correlationThreshold) {
           return {
             approved: false,
             reason: `High correlation (${(correlation * 100).toFixed(1)}%) with existing position in ${symbol}`
           };
         }
       }
     }
     
     return { approved: true };
   }

  /**
   * Check concentration risk for a new signal
   */
  private checkConcentrationRisk(signal: TradingSignal): {
    approved: boolean;
    reason?: string;
  } {
    const maxConcentration = 0.3; // 30% max per symbol
    const currentConcentration = this.getSymbolConcentration(signal.symbol);
    
    if (currentConcentration > maxConcentration) {
      return {
        approved: false,
        reason: `Concentration risk: ${signal.symbol} already represents ${(currentConcentration * 100).toFixed(1)}% of portfolio`
      };
    }
    
    return { approved: true };
  }

  /**
   * Check portfolio Value at Risk
   */
  private checkPortfolioVaR(signal: TradingSignal): {
    approved: boolean;
    reason?: string;
  } {
    const maxVaR = 0.05; // 5% max portfolio VaR
    const currentVaR = this.calculatePortfolioVaR();
    
    if (currentVaR > maxVaR) {
      return {
        approved: false,
        reason: `Portfolio VaR (${(currentVaR * 100).toFixed(1)}%) exceeds maximum allowed (${(maxVaR * 100).toFixed(1)}%)`
      };
    }
    
    return { approved: true };
  }

  /**
   * Get correlation between two symbols
   */
  private getCorrelation(symbol1: string, symbol2: string): number {
    const matrix1 = this.correlationMatrix.get(symbol1);
    if (matrix1) {
      return matrix1.get(symbol2) || 0;
    }
    return 0;
  }

  /**
   * Get symbol concentration in portfolio
   */
  private getSymbolConcentration(symbol: string): number {
    const totalValue = Array.from(this.activePositions.values())
      .reduce((sum, position) => sum + Math.abs(position.pnl || 0), 0);
    
    const symbolValue = this.activePositions.get(symbol);
    if (!symbolValue || totalValue === 0) return 0;
    
    return Math.abs(symbolValue.pnl || 0) / totalValue;
  }

  /**
   * Calculate portfolio Value at Risk
   */
  private calculatePortfolioVaR(): number {
    if (this.tradeHistory.length < 20) return 0;
    
    const returns = this.tradeHistory.slice(-20).map(trade => trade.pnl || 0);
    returns.sort((a, b) => a - b);
    
    // 95% VaR (5th percentile)
    const varIndex = Math.floor(returns.length * 0.05);
    return Math.abs(returns[varIndex] || 0);
  }

  /**
   * Calculate correlation risk metric
   */
  private calculateCorrelationRisk(): number {
    if (this.activePositions.size < 2) return 0;
    
    let totalCorrelation = 0;
    let pairCount = 0;
    
    const symbols = Array.from(this.activePositions.keys());
    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        const correlation = this.getCorrelation(symbols[i], symbols[j]);
        totalCorrelation += Math.abs(correlation);
        pairCount++;
      }
    }
    
    return pairCount > 0 ? totalCorrelation / pairCount : 0;
  }

  /**
   * Calculate concentration risk metric
   */
  private calculateConcentrationRisk(): number {
    if (this.activePositions.size === 0) return 0;
    
    const concentrations = Array.from(this.activePositions.keys())
      .map(symbol => this.getSymbolConcentration(symbol));
    
    return Math.max(...concentrations);
  }

  /**
   * Calculate volatility index
   */
  private calculateVolatilityIndex(): number {
    if (this.tradeHistory.length < 10) return 0;
    
    const recentReturns = this.tradeHistory.slice(-20).map(trade => trade.pnl || 0);
    const avgReturn = recentReturns.reduce((sum, ret) => sum + ret, 0) / recentReturns.length;
    const variance = recentReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / recentReturns.length;
    
    return Math.sqrt(variance);
  }

  /**
   * Export performance report
   */
  exportPerformanceReport(): any {
    return {
      configuration: this.config,
      metrics: this.metrics,
      alerts: this.getRecentAlerts(168), // Last week
      tradeHistory: this.tradeHistory.slice(-100), // Last 100 trades
      optimizationHistory: {
        lastUpdate: this.lastOptimizationUpdate,
        totalOptimizations: Math.floor(this.metrics.totalTrades / 10)
      },
      generatedAt: new Date().toISOString()
    };
  }
}