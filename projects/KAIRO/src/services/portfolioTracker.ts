import { EventEmitter } from 'events';
import { TradingSignal, MarketData, TradeResult, PerformanceMetrics } from './types';
import { alertService } from './alertService';
import { MultiMarketTradingEngine } from './multiMarketTradingEngine';

export interface Position {
  id: string;
  symbol: string;
  market: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  entryTime: Date;
  stopLoss?: number;
  takeProfit?: number;
  trailingStop?: number;
  value: number;
  margin?: number;
  leverage?: number;
}

export interface PortfolioSnapshot {
  timestamp: Date;
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  availableBalance: number;
  marginUsed: number;
  marginAvailable: number;
  positions: Position[];
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  drawdown: number;
  exposure: {
    long: number;
    short: number;
    net: number;
    gross: number;
  };
  riskMetrics: {
    var95: number; // Value at Risk 95%
    var99: number; // Value at Risk 99%
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
  };
}

export interface PnLEntry {
  timestamp: Date;
  realizedPnL: number;
  unrealizedPnL: number;
  totalPnL: number;
  portfolioValue: number;
  tradeId?: string;
  symbol?: string;
  type: 'TRADE' | 'MARK_TO_MARKET' | 'FUNDING' | 'FEE';
  description: string;
}

export interface PortfolioAlert {
  id: string;
  type: 'DRAWDOWN' | 'MARGIN_CALL' | 'POSITION_SIZE' | 'PNL_THRESHOLD' | 'RISK_LIMIT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: Date;
  data: any;
  acknowledged: boolean;
}

export interface PortfolioConfig {
  initialCapital: number;
  maxDrawdown: number;
  marginCallLevel: number;
  maxPositionSize: number;
  maxExposure: number;
  riskPerTrade: number;
  updateInterval: number; // milliseconds
  enableRealTimeUpdates: boolean;
  enableAlerts: boolean;
  alertThresholds: {
    drawdown: number;
    dailyLoss: number;
    positionSize: number;
    marginUsage: number;
  };
}

export class PortfolioTracker extends EventEmitter {
  private config: PortfolioConfig;
  private tradingEngine: MultiMarketTradingEngine;
  
  private positions: Map<string, Position> = new Map();
  private pnlHistory: PnLEntry[] = [];
  private portfolioHistory: PortfolioSnapshot[] = [];
  private alerts: PortfolioAlert[] = [];
  
  private currentSnapshot: PortfolioSnapshot;
  private updateTimer?: NodeJS.Timeout;
  private isTracking: boolean = false;
  
  // Performance tracking
  private startingCapital: number;
  private highWaterMark: number;
  private lastUpdateTime: Date;
  private marketDataCache: Map<string, MarketData> = new Map();
  
  constructor(tradingEngine: MultiMarketTradingEngine, config?: Partial<PortfolioConfig>) {
    super();
    this.tradingEngine = tradingEngine;
    
    // Default configuration
    this.config = {
      initialCapital: 10000,
      maxDrawdown: 20,
      marginCallLevel: 80,
      maxPositionSize: 10,
      maxExposure: 50,
      riskPerTrade: 2,
      updateInterval: 1000, // 1 second
      enableRealTimeUpdates: true,
      enableAlerts: true,
      alertThresholds: {
        drawdown: 15,
        dailyLoss: 5,
        positionSize: 8,
        marginUsage: 75
      },
      ...config
    };
    
    this.startingCapital = this.config.initialCapital;
    this.highWaterMark = this.config.initialCapital;
    this.lastUpdateTime = new Date();
    
    // Initialize current snapshot
    this.currentSnapshot = this.createEmptySnapshot();
    
    // Set up trading engine event listeners
    this.setupTradingEngineListeners();
    
    console.log('Portfolio Tracker initialized with capital:', this.config.initialCapital);
  }

  /**
   * Set up trading engine event listeners
   */
  private setupTradingEngineListeners(): void {
    // Note: MultiMarketTradingEngine doesn't extend EventEmitter
    // We'll need to poll for updates or implement a different integration approach
    console.log('Portfolio tracker initialized - manual integration mode');
  }

  /**
   * Start real-time portfolio tracking
   */
  startTracking(): void {
    if (this.isTracking) {
      console.log('Portfolio tracking already started');
      return;
    }
    
    this.isTracking = true;
    console.log('🚀 Starting real-time portfolio tracking');
    
    // Initial snapshot
    this.updatePortfolioSnapshot();
    
    // Set up periodic updates
    if (this.config.enableRealTimeUpdates) {
      this.updateTimer = setInterval(() => {
        this.updatePortfolioSnapshot();
      }, this.config.updateInterval);
    }
    
    this.emit('trackingStarted', { timestamp: new Date() });
  }

  /**
   * Stop portfolio tracking
   */
  stopTracking(): void {
    if (!this.isTracking) {
      return;
    }
    
    this.isTracking = false;
    
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = undefined;
    }
    
    console.log('⏹️ Portfolio tracking stopped');
    this.emit('trackingStopped', { timestamp: new Date() });
  }

  /**
   * Handle trade execution
   */
  private handleTradeExecution(trade: TradeResult): void {
    console.log(`📊 Processing trade execution: ${trade.signal.symbol}`);
    
    const positionId = `${trade.signal.symbol}_${trade.signal.market}`;
    
    if (trade.signal.signal === 'BUY' || trade.signal.signal === 'SELL') {
      // Opening or modifying position
      this.updatePosition(trade);
    } else {
      // For other cases, treat as position update
      this.updatePosition(trade);
    }
    
    // Record P&L entry
    const pnlEntry: PnLEntry = {
      timestamp: new Date(),
      realizedPnL: trade.pnl || 0,
      unrealizedPnL: this.calculateTotalUnrealizedPnL(),
      totalPnL: (trade.pnl || 0) + this.calculateTotalUnrealizedPnL(),
      portfolioValue: this.calculatePortfolioValue(),
      tradeId: trade.id,
      symbol: trade.signal.symbol,
      type: 'TRADE',
      description: `${trade.signal.signal} ${trade.signal.symbol} - ${trade.pnl?.toFixed(2) || '0.00'} PnL`
    };
    
    this.pnlHistory.push(pnlEntry);
    
    // Update portfolio snapshot
    this.updatePortfolioSnapshot();
    
    this.emit('tradeProcessed', { trade, pnlEntry });
  }

  /**
   * Update position from trade
   */
  private updatePosition(trade: TradeResult): void {
    const positionId = `${trade.signal.symbol}_${trade.signal.market}`;
    const existingPosition = this.positions.get(positionId);
    
    if (existingPosition) {
      // Update existing position
      const positionSize = trade.quantity || 1; // Use quantity from TradeResult
      const totalSize = existingPosition.size + positionSize;
      const totalValue = (existingPosition.size * existingPosition.entryPrice) + 
                        (positionSize * (trade.entryPrice || 0));
      
      existingPosition.size = totalSize;
      existingPosition.entryPrice = totalValue / totalSize;
      existingPosition.value = totalSize * existingPosition.currentPrice;
    } else {
      // Create new position
      const position: Position = {
        id: positionId,
        symbol: trade.signal.symbol,
        market: trade.signal.market,
        side: trade.signal.signal === 'BUY' ? 'LONG' : 'SHORT',
        size: trade.quantity || 1,
        entryPrice: trade.entryPrice || 0,
        currentPrice: trade.entryPrice || 0,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        entryTime: new Date(),
        stopLoss: trade.signal.stopLoss,
        takeProfit: trade.signal.takeProfit,
        value: (trade.quantity || 1) * (trade.entryPrice || 0),
        leverage: 1 // Default leverage since not in TradeResult
      };
      
      this.positions.set(positionId, position);
    }
  }

  /**
   * Close position
   */
  private closePosition(positionId: string, trade: TradeResult): void {
    const position = this.positions.get(positionId);
    if (position) {
      this.positions.delete(positionId);
      console.log(`📈 Closed position: ${position.symbol} - PnL: ${trade.pnl?.toFixed(2)}`);
    }
  }

  /**
   * Handle position update
   */
  private handlePositionUpdate(positionData: any): void {
    // Update position with new data from trading engine
    const positionId = `${positionData.symbol}_${positionData.market}`;
    const position = this.positions.get(positionId);
    
    if (position) {
      position.currentPrice = positionData.currentPrice || position.currentPrice;
      position.stopLoss = positionData.stopLoss || position.stopLoss;
      position.takeProfit = positionData.takeProfit || position.takeProfit;
      
      // Recalculate unrealized P&L
      this.updatePositionPnL(position);
    }
  }

  /**
   * Handle market data update
   */
  private handleMarketDataUpdate(marketData: MarketData): void {
    const key = `${marketData.symbol}_${marketData.market}`;
    this.marketDataCache.set(key, marketData);
    
    // Update positions with new prices
    const position = this.positions.get(key);
    if (position) {
      position.currentPrice = marketData.price;
      this.updatePositionPnL(position);
      
      // Trigger real-time update if enabled
      if (this.config.enableRealTimeUpdates) {
        this.updatePortfolioSnapshot();
      }
    }
  }

  /**
   * Handle signal confirmation
   */
  private handleSignalConfirmation(signal: TradingSignal): void {
    // Log signal for tracking purposes
    console.log(`📡 Signal confirmed: ${signal.symbol} ${signal.signal} - Confidence: ${signal.confidence}`);
    
    this.emit('signalTracked', { signal, timestamp: new Date() });
  }

  /**
   * Update position P&L
   */
  private updatePositionPnL(position: Position): void {
    const priceDiff = position.currentPrice - position.entryPrice;
    const multiplier = position.side === 'LONG' ? 1 : -1;
    
    position.unrealizedPnL = priceDiff * position.size * multiplier;
    position.unrealizedPnLPercent = (priceDiff / position.entryPrice) * 100 * multiplier;
    position.value = position.size * position.currentPrice;
  }

  /**
   * Update portfolio snapshot
   */
  private updatePortfolioSnapshot(): void {
    const now = new Date();
    
    // Update all position P&L
    this.positions.forEach(position => {
      this.updatePositionPnL(position);
    });
    
    const totalValue = this.calculatePortfolioValue();
    const totalPnL = totalValue - this.startingCapital;
    const totalPnLPercent = (totalPnL / this.startingCapital) * 100;
    
    // Calculate exposure
    const exposure = this.calculateExposure();
    
    // Calculate risk metrics
    const riskMetrics = this.calculateRiskMetrics();
    
    // Calculate period P&L
    const periodPnL = this.calculatePeriodPnL();
    
    // Calculate drawdown
    if (totalValue > this.highWaterMark) {
      this.highWaterMark = totalValue;
    }
    const drawdown = ((this.highWaterMark - totalValue) / this.highWaterMark) * 100;
    
    this.currentSnapshot = {
      timestamp: now,
      totalValue,
      totalPnL,
      totalPnLPercent,
      availableBalance: this.calculateAvailableBalance(),
      marginUsed: this.calculateMarginUsed(),
      marginAvailable: this.calculateMarginAvailable(),
      positions: Array.from(this.positions.values()),
      dailyPnL: periodPnL.daily,
      weeklyPnL: periodPnL.weekly,
      monthlyPnL: periodPnL.monthly,
      drawdown,
      exposure,
      riskMetrics
    };
    
    // Store snapshot in history
    this.portfolioHistory.push({ ...this.currentSnapshot });
    
    // Limit history size
    if (this.portfolioHistory.length > 10000) {
      this.portfolioHistory = this.portfolioHistory.slice(-5000);
    }
    
    // Check for alerts
    if (this.config.enableAlerts) {
      this.checkAlerts();
    }
    
    this.lastUpdateTime = now;
    this.emit('portfolioUpdated', this.currentSnapshot);
  }

  /**
   * Calculate portfolio value
   */
  private calculatePortfolioValue(): number {
    const positionValue = Array.from(this.positions.values())
      .reduce((total, position) => total + position.value, 0);
    
    const realizedPnL = this.pnlHistory
      .filter(entry => entry.type === 'TRADE')
      .reduce((total, entry) => total + entry.realizedPnL, 0);
    
    return this.startingCapital + realizedPnL + this.calculateTotalUnrealizedPnL();
  }

  /**
   * Calculate total unrealized P&L
   */
  private calculateTotalUnrealizedPnL(): number {
    return Array.from(this.positions.values())
      .reduce((total, position) => total + position.unrealizedPnL, 0);
  }

  /**
   * Calculate available balance
   */
  private calculateAvailableBalance(): number {
    const totalValue = this.calculatePortfolioValue();
    const marginUsed = this.calculateMarginUsed();
    return totalValue - marginUsed;
  }

  /**
   * Calculate margin used
   */
  private calculateMarginUsed(): number {
    return Array.from(this.positions.values())
      .reduce((total, position) => {
        if (position.margin) {
          return total + position.margin;
        }
        // Estimate margin if not provided
        return total + (position.value / (position.leverage || 1));
      }, 0);
  }

  /**
   * Calculate margin available
   */
  private calculateMarginAvailable(): number {
    const totalValue = this.calculatePortfolioValue();
    const marginUsed = this.calculateMarginUsed();
    return Math.max(0, totalValue - marginUsed);
  }

  /**
   * Calculate exposure
   */
  private calculateExposure() {
    let longExposure = 0;
    let shortExposure = 0;
    
    Array.from(this.positions.values()).forEach(position => {
      if (position.side === 'LONG') {
        longExposure += position.value;
      } else {
        shortExposure += position.value;
      }
    });
    
    return {
      long: longExposure,
      short: shortExposure,
      net: longExposure - shortExposure,
      gross: longExposure + shortExposure
    };
  }

  /**
   * Calculate risk metrics
   */
  private calculateRiskMetrics() {
    const returns = this.calculateReturns();
    
    return {
      var95: this.calculateVaR(returns, 0.95),
      var99: this.calculateVaR(returns, 0.99),
      sharpeRatio: this.calculateSharpeRatio(returns),
      maxDrawdown: this.calculateMaxDrawdown(),
      winRate: this.calculateWinRate(),
      profitFactor: this.calculateProfitFactor()
    };
  }

  /**
   * Calculate returns array
   */
  private calculateReturns(): number[] {
    if (this.portfolioHistory.length < 2) return [];
    
    const returns: number[] = [];
    for (let i = 1; i < this.portfolioHistory.length; i++) {
      const current = this.portfolioHistory[i].totalValue;
      const previous = this.portfolioHistory[i - 1].totalValue;
      const returnPct = ((current - previous) / previous) * 100;
      returns.push(returnPct);
    }
    
    return returns;
  }

  /**
   * Calculate Value at Risk
   */
  private calculateVaR(returns: number[], confidence: number): number {
    if (returns.length === 0) return 0;
    
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sortedReturns.length);
    return Math.abs(sortedReturns[index] || 0);
  }

  /**
   * Calculate Sharpe ratio
   */
  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev === 0 ? 0 : avgReturn / stdDev;
  }

  /**
   * Calculate maximum drawdown
   */
  private calculateMaxDrawdown(): number {
    if (this.portfolioHistory.length === 0) return 0;
    
    let maxDrawdown = 0;
    let peak = this.portfolioHistory[0].totalValue;
    
    this.portfolioHistory.forEach(snapshot => {
      if (snapshot.totalValue > peak) {
        peak = snapshot.totalValue;
      }
      
      const drawdown = ((peak - snapshot.totalValue) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });
    
    return maxDrawdown;
  }

  /**
   * Calculate win rate
   */
  private calculateWinRate(): number {
    const trades = this.pnlHistory.filter(entry => entry.type === 'TRADE');
    if (trades.length === 0) return 0;
    
    const winningTrades = trades.filter(trade => trade.realizedPnL > 0).length;
    return (winningTrades / trades.length) * 100;
  }

  /**
   * Calculate profit factor
   */
  private calculateProfitFactor(): number {
    const trades = this.pnlHistory.filter(entry => entry.type === 'TRADE');
    
    const grossProfit = trades
      .filter(trade => trade.realizedPnL > 0)
      .reduce((sum, trade) => sum + trade.realizedPnL, 0);
    
    const grossLoss = Math.abs(trades
      .filter(trade => trade.realizedPnL < 0)
      .reduce((sum, trade) => sum + trade.realizedPnL, 0));
    
    return grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss;
  }

  /**
   * Calculate period P&L
   */
  private calculatePeriodPnL() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const dailyTrades = this.pnlHistory.filter(entry => 
      entry.timestamp >= oneDayAgo && entry.type === 'TRADE'
    );
    const weeklyTrades = this.pnlHistory.filter(entry => 
      entry.timestamp >= oneWeekAgo && entry.type === 'TRADE'
    );
    const monthlyTrades = this.pnlHistory.filter(entry => 
      entry.timestamp >= oneMonthAgo && entry.type === 'TRADE'
    );
    
    return {
      daily: dailyTrades.reduce((sum, entry) => sum + entry.realizedPnL, 0),
      weekly: weeklyTrades.reduce((sum, entry) => sum + entry.realizedPnL, 0),
      monthly: monthlyTrades.reduce((sum, entry) => sum + entry.realizedPnL, 0)
    };
  }

  /**
   * Check portfolio alerts using new alert service
   */
  private checkPortfolioAlerts(snapshot: PortfolioSnapshot): void {
    // Calculate portfolio value change from history
    const previousSnapshot = this.portfolioHistory.length > 1 
      ? this.portfolioHistory[this.portfolioHistory.length - 2] 
      : null;
    
    const portfolioValueChange = previousSnapshot 
      ? ((snapshot.totalValue - previousSnapshot.totalValue) / previousSnapshot.totalValue) * 100
      : 0;
    
    // Trigger portfolio alerts based on conditions
    alertService.checkAlertConditions({
      symbol: 'PORTFOLIO',
      price: snapshot.totalValue,
      volume: 0 // Portfolio doesn't have volume, using 0 as placeholder
    });
  }

  /**
   * Check for alerts
   */
  private checkAlerts(): void {
    const snapshot = this.currentSnapshot;
    
    // Integrate with new alert service
    this.checkPortfolioAlerts(snapshot);
    
    // Legacy alert system (keeping for backward compatibility)
    // Drawdown alert
    if (snapshot.drawdown > this.config.alertThresholds.drawdown) {
      this.createAlert('DRAWDOWN', 'HIGH', 
        `Portfolio drawdown (${snapshot.drawdown.toFixed(2)}%) exceeds threshold (${this.config.alertThresholds.drawdown}%)`,
        { drawdown: snapshot.drawdown, threshold: this.config.alertThresholds.drawdown }
      );
    }
    
    // Daily loss alert
    if (snapshot.dailyPnL < 0 && Math.abs(snapshot.dailyPnL / snapshot.totalValue * 100) > this.config.alertThresholds.dailyLoss) {
      this.createAlert('PNL_THRESHOLD', 'MEDIUM',
        `Daily loss (${(snapshot.dailyPnL / snapshot.totalValue * 100).toFixed(2)}%) exceeds threshold (${this.config.alertThresholds.dailyLoss}%)`,
        { dailyPnL: snapshot.dailyPnL, threshold: this.config.alertThresholds.dailyLoss }
      );
    }
    
    // Margin usage alert
    const marginUsagePercent = (snapshot.marginUsed / snapshot.totalValue) * 100;
    if (marginUsagePercent > this.config.alertThresholds.marginUsage) {
      this.createAlert('MARGIN_CALL', 'HIGH',
        `Margin usage (${marginUsagePercent.toFixed(2)}%) exceeds threshold (${this.config.alertThresholds.marginUsage}%)`,
        { marginUsage: marginUsagePercent, threshold: this.config.alertThresholds.marginUsage }
      );
    }
    
    // Position size alerts
    snapshot.positions.forEach(position => {
      const positionPercent = (position.value / snapshot.totalValue) * 100;
      if (positionPercent > this.config.alertThresholds.positionSize) {
        this.createAlert('POSITION_SIZE', 'MEDIUM',
          `Position ${position.symbol} size (${positionPercent.toFixed(2)}%) exceeds threshold (${this.config.alertThresholds.positionSize}%)`,
          { position: position.symbol, size: positionPercent, threshold: this.config.alertThresholds.positionSize }
        );
      }
    });
  }

  /**
   * Create alert
   */
  private createAlert(
    type: PortfolioAlert['type'],
    severity: PortfolioAlert['severity'],
    message: string,
    data: any
  ): void {
    const alert: PortfolioAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: new Date(),
      data,
      acknowledged: false
    };
    
    this.alerts.push(alert);
    
    // Limit alerts history
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-500);
    }
    
    console.log(`🚨 Portfolio Alert [${severity}]: ${message}`);
    this.emit('alertCreated', alert);
  }

  /**
   * Create empty snapshot
   */
  private createEmptySnapshot(): PortfolioSnapshot {
    return {
      timestamp: new Date(),
      totalValue: this.startingCapital,
      totalPnL: 0,
      totalPnLPercent: 0,
      availableBalance: this.startingCapital,
      marginUsed: 0,
      marginAvailable: this.startingCapital,
      positions: [],
      dailyPnL: 0,
      weeklyPnL: 0,
      monthlyPnL: 0,
      drawdown: 0,
      exposure: { long: 0, short: 0, net: 0, gross: 0 },
      riskMetrics: {
        var95: 0,
        var99: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        winRate: 0,
        profitFactor: 0
      }
    };
  }

  // Public API methods

  /**
   * Get current portfolio snapshot
   */
  getCurrentSnapshot(): PortfolioSnapshot {
    return { ...this.currentSnapshot };
  }

  /**
   * Get portfolio history
   */
  getPortfolioHistory(limit?: number): PortfolioSnapshot[] {
    const history = [...this.portfolioHistory];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Get P&L history
   */
  getPnLHistory(limit?: number): PnLEntry[] {
    const history = [...this.pnlHistory];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Get current positions
   */
  getPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  /**
   * Get position by symbol
   */
  getPosition(symbol: string, market: string): Position | undefined {
    return this.positions.get(`${symbol}_${market}`);
  }

  /**
   * Get alerts
   */
  getAlerts(unacknowledgedOnly: boolean = false): PortfolioAlert[] {
    return unacknowledgedOnly 
      ? this.alerts.filter(alert => !alert.acknowledged)
      : [...this.alerts];
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.emit('alertAcknowledged', alert);
      return true;
    }
    return false;
  }

  /**
   * Update configuration
   */
  updateConfiguration(config: Partial<PortfolioConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('Portfolio tracker configuration updated');
    this.emit('configurationUpdated', this.config);
  }

  /**
   * Get configuration
   */
  getConfiguration(): PortfolioConfig {
    return { ...this.config };
  }

  /**
   * Reset portfolio
   */
  reset(): void {
    this.positions.clear();
    this.pnlHistory = [];
    this.portfolioHistory = [];
    this.alerts = [];
    this.marketDataCache.clear();
    
    this.startingCapital = this.config.initialCapital;
    this.highWaterMark = this.config.initialCapital;
    this.currentSnapshot = this.createEmptySnapshot();
    
    console.log('Portfolio tracker reset');
    this.emit('portfolioReset', { timestamp: new Date() });
  }

  /**
   * Export portfolio data
   */
  exportData() {
    return {
      config: this.config,
      currentSnapshot: this.currentSnapshot,
      positions: Array.from(this.positions.values()),
      pnlHistory: this.pnlHistory,
      portfolioHistory: this.portfolioHistory,
      alerts: this.alerts,
      status: {
        isTracking: this.isTracking,
        lastUpdate: this.lastUpdateTime,
        startingCapital: this.startingCapital,
        highWaterMark: this.highWaterMark
      },
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      isTracking: this.isTracking,
      positionsCount: this.positions.size,
      totalValue: this.currentSnapshot.totalValue,
      totalPnL: this.currentSnapshot.totalPnL,
      totalPnLPercent: this.currentSnapshot.totalPnLPercent,
      drawdown: this.currentSnapshot.drawdown,
      alertsCount: this.alerts.filter(a => !a.acknowledged).length,
      lastUpdate: this.lastUpdateTime,
      updateInterval: this.config.updateInterval
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopTracking();
    this.removeAllListeners();
    this.positions.clear();
    this.marketDataCache.clear();
    console.log('Portfolio tracker destroyed');
  }
}