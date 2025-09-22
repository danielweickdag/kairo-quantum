import { TradeEntry, ExecutionMetrics } from './tradeLoggingSystem';
import { TradingSignal } from './multiMarketTradingEngine';

export interface ProfitFactorMetrics {
  profitFactor: number;
  grossProfit: number;
  grossLoss: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  expectancy: number;
  kelly: number; // Kelly Criterion percentage
  sharpeRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  recoveryFactor: number;
  profitToMaxDrawdownRatio: number;
  timeframe: string;
  lastUpdated: Date;
}

export interface PerformanceBreakdown {
  byMarket: Record<string, ProfitFactorMetrics>;
  bySymbol: Record<string, ProfitFactorMetrics>;
  byTimeframe: Record<string, ProfitFactorMetrics>;
  bySignalType: Record<string, ProfitFactorMetrics>;
  byConfidenceRange: Record<string, ProfitFactorMetrics>;
  monthly: Record<string, ProfitFactorMetrics>;
  weekly: Record<string, ProfitFactorMetrics>;
  daily: Record<string, ProfitFactorMetrics>;
}

export interface PerformanceAlert {
  id: string;
  type: 'PROFIT_FACTOR_LOW' | 'DRAWDOWN_HIGH' | 'WIN_RATE_LOW' | 'CONSECUTIVE_LOSSES';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
}

export interface PerformanceTarget {
  profitFactor: number;
  winRate: number;
  maxDrawdown: number;
  minSharpeRatio: number;
  minCalmarRatio: number;
  maxConsecutiveLosses: number;
}

export interface RollingMetrics {
  period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';
  profitFactor: number[];
  winRate: number[];
  drawdown: number[];
  timestamps: Date[];
}

export class ProfitFactorTrackingSystem {
  private trades: Map<string, TradeEntry> = new Map();
  private userMetrics: Map<string, ProfitFactorMetrics> = new Map();
  private performanceBreakdowns: Map<string, PerformanceBreakdown> = new Map();
  private performanceAlerts: Map<string, PerformanceAlert[]> = new Map();
  private rollingMetrics: Map<string, Map<string, RollingMetrics>> = new Map();
  private performanceTargets: Map<string, PerformanceTarget> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(
    private defaultTargets: PerformanceTarget = {
      profitFactor: 1.6,
      winRate: 60,
      maxDrawdown: 5,
      minSharpeRatio: 1.5,
      minCalmarRatio: 2.0,
      maxConsecutiveLosses: 5
    }
  ) {
    this.startPeriodicUpdates();
  }

  /**
   * Start periodic metric updates
   */
  private startPeriodicUpdates(): void {
    this.updateInterval = setInterval(() => {
      this.updateAllUserMetrics();
      this.checkPerformanceAlerts();
      this.updateRollingMetrics();
    }, 60000); // Update every minute
  }

  /**
   * Add or update a trade for profit factor calculation
   */
  addTrade(trade: TradeEntry): void {
    this.trades.set(trade.id, trade);
    
    // Update metrics for the user
    this.updateUserMetrics(trade.userId);
    
    // Update performance breakdown
    this.updatePerformanceBreakdown(trade.userId);
    
    console.log(`Trade ${trade.id} added to profit factor tracking`);
  }

  /**
   * Update trade (when trade is closed or modified)
   */
  updateTrade(trade: TradeEntry): void {
    if (this.trades.has(trade.id)) {
      this.trades.set(trade.id, trade);
      this.updateUserMetrics(trade.userId);
      this.updatePerformanceBreakdown(trade.userId);
      console.log(`Trade ${trade.id} updated in profit factor tracking`);
    }
  }

  /**
   * Calculate profit factor metrics for a user
   */
  calculateProfitFactorMetrics(userId: string): ProfitFactorMetrics {
    const userTrades = this.getUserTrades(userId);
    const closedTrades = userTrades.filter(trade => trade.status === 'CLOSED' && trade.pnl !== undefined);
    
    if (closedTrades.length === 0) {
      return this.getEmptyMetrics();
    }

    // Separate winning and losing trades
    const winningTrades = closedTrades.filter(trade => trade.pnl! > 0);
    const losingTrades = closedTrades.filter(trade => trade.pnl! < 0);
    
    // Calculate basic metrics
    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl!, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl!, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
    
    const winRate = (winningTrades.length / closedTrades.length) * 100;
    const averageWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;
    
    const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl!)) : 0;
    const largestLoss = losingTrades.length > 0 ? Math.abs(Math.min(...losingTrades.map(t => t.pnl!))) : 0;
    
    // Calculate consecutive wins/losses
    const { consecutiveWins, consecutiveLosses, maxConsecutiveWins, maxConsecutiveLosses } = 
      this.calculateConsecutiveStats(closedTrades);
    
    // Calculate expectancy
    const expectancy = (winRate / 100) * averageWin - ((100 - winRate) / 100) * averageLoss;
    
    // Calculate Kelly Criterion
    const kelly = averageLoss > 0 ? ((winRate / 100) - ((100 - winRate) / 100) / (averageWin / averageLoss)) * 100 : 0;
    
    // Calculate Sharpe Ratio
    const returns = closedTrades.map(trade => (trade.pnlPercentage || 0) / 100);
    const sharpeRatio = this.calculateSharpeRatio(returns);
    
    // Calculate drawdown metrics
    const { maxDrawdown, recoveryFactor } = this.calculateDrawdownMetrics(closedTrades);
    
    // Calculate Calmar Ratio
    const totalReturn = closedTrades.reduce((sum, trade) => sum + (trade.pnlPercentage || 0), 0);
    const calmarRatio = maxDrawdown > 0 ? (totalReturn / 100) / (maxDrawdown / 100) : 0;
    
    const profitToMaxDrawdownRatio = maxDrawdown > 0 ? (grossProfit - grossLoss) / (maxDrawdown / 100) : 0;

    return {
      profitFactor,
      grossProfit,
      grossLoss,
      totalTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
      consecutiveWins,
      consecutiveLosses,
      maxConsecutiveWins,
      maxConsecutiveLosses,
      expectancy,
      kelly,
      sharpeRatio,
      calmarRatio,
      maxDrawdown,
      recoveryFactor,
      profitToMaxDrawdownRatio,
      timeframe: 'ALL',
      lastUpdated: new Date()
    };
  }

  /**
   * Calculate consecutive wins/losses statistics
   */
  private calculateConsecutiveStats(trades: TradeEntry[]): {
    consecutiveWins: number;
    consecutiveLosses: number;
    maxConsecutiveWins: number;
    maxConsecutiveLosses: number;
  } {
    if (trades.length === 0) {
      return { consecutiveWins: 0, consecutiveLosses: 0, maxConsecutiveWins: 0, maxConsecutiveLosses: 0 };
    }

    // Sort trades by exit time
    const sortedTrades = trades
      .filter(trade => trade.exitTime)
      .sort((a, b) => a.exitTime!.getTime() - b.exitTime!.getTime());

    let consecutiveWins = 0;
    let consecutiveLosses = 0;
    let maxConsecutiveWins = 0;
    let maxConsecutiveLosses = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;

    for (const trade of sortedTrades) {
      if (trade.pnl! > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak);
      } else {
        currentLossStreak++;
        currentWinStreak = 0;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak);
      }
    }

    // Current streaks are the last streaks
    consecutiveWins = currentWinStreak;
    consecutiveLosses = currentLossStreak;

    return { consecutiveWins, consecutiveLosses, maxConsecutiveWins, maxConsecutiveLosses };
  }

  /**
   * Calculate Sharpe Ratio
   */
  private calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
    if (returns.length === 0) return 0;

    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const excessReturn = avgReturn - (riskFreeRate / 252); // Daily risk-free rate
    
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev > 0 ? excessReturn / stdDev : 0;
  }

  /**
   * Calculate drawdown metrics
   */
  private calculateDrawdownMetrics(trades: TradeEntry[]): {
    maxDrawdown: number;
    recoveryFactor: number;
  } {
    if (trades.length === 0) {
      return { maxDrawdown: 0, recoveryFactor: 0 };
    }

    // Sort trades by exit time
    const sortedTrades = trades
      .filter(trade => trade.exitTime && trade.pnl !== undefined)
      .sort((a, b) => a.exitTime!.getTime() - b.exitTime!.getTime());

    let peak = 0;
    let maxDrawdown = 0;
    let currentBalance = 0;
    let totalProfit = 0;

    for (const trade of sortedTrades) {
      currentBalance += trade.pnl!;
      totalProfit += trade.pnl!;
      
      if (currentBalance > peak) {
        peak = currentBalance;
      }
      
      const drawdown = peak > 0 ? ((peak - currentBalance) / peak) * 100 : 0;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    const recoveryFactor = maxDrawdown > 0 ? totalProfit / (maxDrawdown / 100) : 0;

    return { maxDrawdown, recoveryFactor };
  }

  /**
   * Get empty metrics structure
   */
  private getEmptyMetrics(): ProfitFactorMetrics {
    return {
      profitFactor: 0,
      grossProfit: 0,
      grossLoss: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      maxConsecutiveWins: 0,
      maxConsecutiveLosses: 0,
      expectancy: 0,
      kelly: 0,
      sharpeRatio: 0,
      calmarRatio: 0,
      maxDrawdown: 0,
      recoveryFactor: 0,
      profitToMaxDrawdownRatio: 0,
      timeframe: 'ALL',
      lastUpdated: new Date()
    };
  }

  /**
   * Update metrics for a specific user
   */
  private updateUserMetrics(userId: string): void {
    const metrics = this.calculateProfitFactorMetrics(userId);
    this.userMetrics.set(userId, metrics);
  }

  /**
   * Update all user metrics
   */
  private updateAllUserMetrics(): void {
    const userIds = new Set(Array.from(this.trades.values()).map(trade => trade.userId));
    
    Array.from(userIds).forEach(userId => {
      this.updateUserMetrics(userId);
    });
  }

  /**
   * Update performance breakdown by various categories
   */
  private updatePerformanceBreakdown(userId: string): void {
    const userTrades = this.getUserTrades(userId);
    const breakdown: PerformanceBreakdown = {
      byMarket: {},
      bySymbol: {},
      byTimeframe: {},
      bySignalType: {},
      byConfidenceRange: {},
      monthly: {},
      weekly: {},
      daily: {}
    };

    // Group trades by market
    const tradesByMarket = this.groupTradesBy(userTrades, 'market');
    for (const [market, trades] of Object.entries(tradesByMarket)) {
      breakdown.byMarket[market] = this.calculateMetricsForTrades(trades);
    }

    // Group trades by symbol
    const tradesBySymbol = this.groupTradesBy(userTrades, 'symbol');
    for (const [symbol, trades] of Object.entries(tradesBySymbol)) {
      breakdown.bySymbol[symbol] = this.calculateMetricsForTrades(trades);
    }

    // Group trades by signal type
    const tradesByType = this.groupTradesBy(userTrades, 'type');
    for (const [type, trades] of Object.entries(tradesByType)) {
      breakdown.bySignalType[type] = this.calculateMetricsForTrades(trades);
    }

    // Group trades by confidence range
    const tradesByConfidence = this.groupTradesByConfidenceRange(userTrades);
    for (const [range, trades] of Object.entries(tradesByConfidence)) {
      breakdown.byConfidenceRange[range] = this.calculateMetricsForTrades(trades);
    }

    // Group trades by time periods
    breakdown.monthly = this.groupTradesByTimePeriod(userTrades, 'month');
    breakdown.weekly = this.groupTradesByTimePeriod(userTrades, 'week');
    breakdown.daily = this.groupTradesByTimePeriod(userTrades, 'day');

    this.performanceBreakdowns.set(userId, breakdown);
  }

  /**
   * Group trades by a specific property
   */
  private groupTradesBy(trades: TradeEntry[], property: keyof TradeEntry): Record<string, TradeEntry[]> {
    return trades.reduce((groups, trade) => {
      const key = String(trade[property]);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(trade);
      return groups;
    }, {} as Record<string, TradeEntry[]>);
  }

  /**
   * Group trades by confidence range
   */
  private groupTradesByConfidenceRange(trades: TradeEntry[]): Record<string, TradeEntry[]> {
    const ranges = {
      '90-100%': [] as TradeEntry[],
      '80-89%': [] as TradeEntry[],
      '70-79%': [] as TradeEntry[],
      '60-69%': [] as TradeEntry[],
      '50-59%': [] as TradeEntry[],
      '<50%': [] as TradeEntry[]
    };

    for (const trade of trades) {
      const confidence = trade.confidence;
      if (confidence >= 90) ranges['90-100%'].push(trade);
      else if (confidence >= 80) ranges['80-89%'].push(trade);
      else if (confidence >= 70) ranges['70-79%'].push(trade);
      else if (confidence >= 60) ranges['60-69%'].push(trade);
      else if (confidence >= 50) ranges['50-59%'].push(trade);
      else ranges['<50%'].push(trade);
    }

    return ranges;
  }

  /**
   * Group trades by time period
   */
  private groupTradesByTimePeriod(
    trades: TradeEntry[],
    period: 'day' | 'week' | 'month'
  ): Record<string, ProfitFactorMetrics> {
    const groups: Record<string, TradeEntry[]> = {};
    
    for (const trade of trades.filter(t => t.exitTime)) {
      let key: string;
      const date = trade.exitTime!;
      
      switch (period) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(trade);
    }

    const result: Record<string, ProfitFactorMetrics> = {};
    for (const [key, groupTrades] of Object.entries(groups)) {
      result[key] = this.calculateMetricsForTrades(groupTrades);
    }

    return result;
  }

  /**
   * Calculate metrics for a specific set of trades
   */
  private calculateMetricsForTrades(trades: TradeEntry[]): ProfitFactorMetrics {
    const closedTrades = trades.filter(trade => trade.status === 'CLOSED' && trade.pnl !== undefined);
    
    if (closedTrades.length === 0) {
      return this.getEmptyMetrics();
    }

    // Use the same calculation logic as the main method
    const winningTrades = closedTrades.filter(trade => trade.pnl! > 0);
    const losingTrades = closedTrades.filter(trade => trade.pnl! < 0);
    
    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl!, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl!, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
    
    const winRate = (winningTrades.length / closedTrades.length) * 100;
    const averageWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;
    
    const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl!)) : 0;
    const largestLoss = losingTrades.length > 0 ? Math.abs(Math.min(...losingTrades.map(t => t.pnl!))) : 0;
    
    const { consecutiveWins, consecutiveLosses, maxConsecutiveWins, maxConsecutiveLosses } = 
      this.calculateConsecutiveStats(closedTrades);
    
    const expectancy = (winRate / 100) * averageWin - ((100 - winRate) / 100) * averageLoss;
    const kelly = averageLoss > 0 ? ((winRate / 100) - ((100 - winRate) / 100) / (averageWin / averageLoss)) * 100 : 0;
    
    const returns = closedTrades.map(trade => (trade.pnlPercentage || 0) / 100);
    const sharpeRatio = this.calculateSharpeRatio(returns);
    
    const { maxDrawdown, recoveryFactor } = this.calculateDrawdownMetrics(closedTrades);
    
    const totalReturn = closedTrades.reduce((sum, trade) => sum + (trade.pnlPercentage || 0), 0);
    const calmarRatio = maxDrawdown > 0 ? (totalReturn / 100) / (maxDrawdown / 100) : 0;
    
    const profitToMaxDrawdownRatio = maxDrawdown > 0 ? (grossProfit - grossLoss) / (maxDrawdown / 100) : 0;

    return {
      profitFactor,
      grossProfit,
      grossLoss,
      totalTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
      consecutiveWins,
      consecutiveLosses,
      maxConsecutiveWins,
      maxConsecutiveLosses,
      expectancy,
      kelly,
      sharpeRatio,
      calmarRatio,
      maxDrawdown,
      recoveryFactor,
      profitToMaxDrawdownRatio,
      timeframe: 'SUBSET',
      lastUpdated: new Date()
    };
  }

  /**
   * Check for performance alerts
   */
  private checkPerformanceAlerts(): void {
    Array.from(this.userMetrics.entries()).forEach(([userId, metrics]) => {
      const targets = this.performanceTargets.get(userId) || this.defaultTargets;
      const alerts: PerformanceAlert[] = [];

      // Check profit factor
      if (metrics.profitFactor < targets.profitFactor) {
        alerts.push({
          id: `pf_${userId}_${Date.now()}`,
          type: 'PROFIT_FACTOR_LOW',
          severity: metrics.profitFactor < targets.profitFactor * 0.5 ? 'CRITICAL' : 'HIGH',
          message: `Profit factor (${metrics.profitFactor.toFixed(2)}) is below target (${targets.profitFactor})`,
          value: metrics.profitFactor,
          threshold: targets.profitFactor,
          timestamp: new Date(),
          acknowledged: false
        });
      }

      // Check drawdown
      if (metrics.maxDrawdown > targets.maxDrawdown) {
        alerts.push({
          id: `dd_${userId}_${Date.now()}`,
          type: 'DRAWDOWN_HIGH',
          severity: metrics.maxDrawdown > targets.maxDrawdown * 2 ? 'CRITICAL' : 'HIGH',
          message: `Max drawdown (${metrics.maxDrawdown.toFixed(2)}%) exceeds target (${targets.maxDrawdown}%)`,
          value: metrics.maxDrawdown,
          threshold: targets.maxDrawdown,
          timestamp: new Date(),
          acknowledged: false
        });
      }

      // Check win rate
      if (metrics.winRate < targets.winRate) {
        alerts.push({
          id: `wr_${userId}_${Date.now()}`,
          type: 'WIN_RATE_LOW',
          severity: metrics.winRate < targets.winRate * 0.7 ? 'HIGH' : 'MEDIUM',
          message: `Win rate (${metrics.winRate.toFixed(1)}%) is below target (${targets.winRate}%)`,
          value: metrics.winRate,
          threshold: targets.winRate,
          timestamp: new Date(),
          acknowledged: false
        });
      }

      // Check consecutive losses
      if (metrics.consecutiveLosses >= targets.maxConsecutiveLosses) {
        alerts.push({
          id: `cl_${userId}_${Date.now()}`,
          type: 'CONSECUTIVE_LOSSES',
          severity: metrics.consecutiveLosses >= targets.maxConsecutiveLosses * 1.5 ? 'CRITICAL' : 'HIGH',
          message: `Consecutive losses (${metrics.consecutiveLosses}) reached threshold (${targets.maxConsecutiveLosses})`,
          value: metrics.consecutiveLosses,
          threshold: targets.maxConsecutiveLosses,
          timestamp: new Date(),
          acknowledged: false
        });
      }

      if (alerts.length > 0) {
        const existingAlerts = this.performanceAlerts.get(userId) || [];
        this.performanceAlerts.set(userId, [...existingAlerts, ...alerts]);
      }
    });
  }

  /**
   * Update rolling metrics
   */
  private updateRollingMetrics(): void {
    const periods: RollingMetrics['period'][] = ['1D', '1W', '1M', '3M', '6M', '1Y'];
    
    Array.from(this.userMetrics.entries()).forEach(([userId]) => {
      const userRollingMetrics = this.rollingMetrics.get(userId) || new Map();
      
      for (const period of periods) {
        const metrics = this.calculateRollingMetrics(userId, period);
        userRollingMetrics.set(period, metrics);
      }
      
      this.rollingMetrics.set(userId, userRollingMetrics);
    });
  }

  /**
   * Calculate rolling metrics for a specific period
   */
  private calculateRollingMetrics(userId: string, period: RollingMetrics['period']): RollingMetrics {
    const now = new Date();
    const periodMs = this.getPeriodMilliseconds(period);
    const startDate = new Date(now.getTime() - periodMs);
    
    const userTrades = this.getUserTrades(userId)
      .filter(trade => trade.exitTime && trade.exitTime >= startDate)
      .sort((a, b) => a.exitTime!.getTime() - b.exitTime!.getTime());
    
    const rollingMetrics: RollingMetrics = {
      period,
      profitFactor: [],
      winRate: [],
      drawdown: [],
      timestamps: []
    };
    
    // Calculate metrics for rolling windows
    const windowSize = Math.max(1, Math.floor(userTrades.length / 20)); // 20 data points
    
    for (let i = windowSize; i <= userTrades.length; i += windowSize) {
      const windowTrades = userTrades.slice(Math.max(0, i - windowSize), i);
      const metrics = this.calculateMetricsForTrades(windowTrades);
      
      rollingMetrics.profitFactor.push(metrics.profitFactor);
      rollingMetrics.winRate.push(metrics.winRate);
      rollingMetrics.drawdown.push(metrics.maxDrawdown);
      rollingMetrics.timestamps.push(windowTrades[windowTrades.length - 1].exitTime!);
    }
    
    return rollingMetrics;
  }

  /**
   * Get period in milliseconds
   */
  private getPeriodMilliseconds(period: RollingMetrics['period']): number {
    switch (period) {
      case '1D': return 24 * 60 * 60 * 1000;
      case '1W': return 7 * 24 * 60 * 60 * 1000;
      case '1M': return 30 * 24 * 60 * 60 * 1000;
      case '3M': return 90 * 24 * 60 * 60 * 1000;
      case '6M': return 180 * 24 * 60 * 60 * 1000;
      case '1Y': return 365 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  }

  /**
   * Get user trades
   */
  private getUserTrades(userId: string): TradeEntry[] {
    return Array.from(this.trades.values()).filter(trade => trade.userId === userId);
  }

  /**
   * Get profit factor metrics for a user
   */
  getProfitFactorMetrics(userId: string): ProfitFactorMetrics | null {
    return this.userMetrics.get(userId) || null;
  }

  /**
   * Get performance breakdown for a user
   */
  getPerformanceBreakdown(userId: string): PerformanceBreakdown | null {
    return this.performanceBreakdowns.get(userId) || null;
  }

  /**
   * Get performance alerts for a user
   */
  getPerformanceAlerts(userId: string): PerformanceAlert[] {
    return this.performanceAlerts.get(userId) || [];
  }

  /**
   * Get rolling metrics for a user
   */
  getRollingMetrics(userId: string, period: RollingMetrics['period']): RollingMetrics | null {
    const userMetrics = this.rollingMetrics.get(userId);
    return userMetrics?.get(period) || null;
  }

  /**
   * Set performance targets for a user
   */
  setPerformanceTargets(userId: string, targets: PerformanceTarget): void {
    this.performanceTargets.set(userId, targets);
    console.log(`Performance targets set for user ${userId}`);
  }

  /**
   * Acknowledge performance alert
   */
  acknowledgeAlert(userId: string, alertId: string): void {
    const alerts = this.performanceAlerts.get(userId) || [];
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      console.log(`Alert ${alertId} acknowledged for user ${userId}`);
    }
  }

  /**
   * Get system-wide statistics
   */
  getSystemStats(): {
    totalUsers: number;
    averageProfitFactor: number;
    averageWinRate: number;
    totalTrades: number;
    totalAlerts: number;
    topPerformers: { userId: string; profitFactor: number }[];
  } {
    const allMetrics = Array.from(this.userMetrics.values());
    const totalUsers = allMetrics.length;
    
    const averageProfitFactor = totalUsers > 0 ? 
      allMetrics.reduce((sum, m) => sum + m.profitFactor, 0) / totalUsers : 0;
    
    const averageWinRate = totalUsers > 0 ? 
      allMetrics.reduce((sum, m) => sum + m.winRate, 0) / totalUsers : 0;
    
    const totalTrades = allMetrics.reduce((sum, m) => sum + m.totalTrades, 0);
    
    const totalAlerts = Array.from(this.performanceAlerts.values())
      .reduce((sum, alerts) => sum + alerts.filter(a => !a.acknowledged).length, 0);
    
    const topPerformers = Array.from(this.userMetrics.entries())
      .map(([userId, metrics]) => ({ userId, profitFactor: metrics.profitFactor }))
      .sort((a, b) => b.profitFactor - a.profitFactor)
      .slice(0, 10);
    
    return {
      totalUsers,
      averageProfitFactor,
      averageWinRate,
      totalTrades,
      totalAlerts,
      topPerformers
    };
  }

  /**
   * Export performance data
   */
  exportPerformanceData(userId: string, format: 'JSON' | 'CSV' = 'JSON'): string {
    const metrics = this.userMetrics.get(userId);
    const breakdown = this.performanceBreakdowns.get(userId);
    const alerts = this.performanceAlerts.get(userId) || [];
    
    const data = {
      metrics,
      breakdown,
      alerts,
      exportedAt: new Date().toISOString()
    };
    
    if (format === 'CSV') {
      // Convert to CSV format (simplified)
      const csvData = [
        ['Metric', 'Value'],
        ['Profit Factor', metrics?.profitFactor.toString() || '0'],
        ['Win Rate', `${metrics?.winRate.toFixed(1) || '0'}%`],
        ['Total Trades', metrics?.totalTrades.toString() || '0'],
        ['Gross Profit', metrics?.grossProfit.toString() || '0'],
        ['Gross Loss', metrics?.grossLoss.toString() || '0'],
        ['Max Drawdown', `${metrics?.maxDrawdown.toFixed(2) || '0'}%`],
        ['Sharpe Ratio', metrics?.sharpeRatio.toFixed(2) || '0'],
        ['Calmar Ratio', metrics?.calmarRatio.toFixed(2) || '0']
      ];
      
      return csvData.map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * Stop the tracking system
   */
  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    console.log('Profit factor tracking system stopped');
  }
}

export default ProfitFactorTrackingSystem;