import { EventEmitter } from 'events';
import { MarketData, TradingSignal, TradeResult, BacktestResult, OptimizationResult, PerformanceMetrics } from './types';
import { SignalGenerator } from './signalGenerator';
import { TechnicalAnalysis } from './technicalAnalysis';
import { RiskManagementService } from './riskManagementService';

export interface BacktestConfig {
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  commission: number; // percentage
  slippage: number; // percentage
  maxPositionSize: number; // percentage of capital
  riskPerTrade: number; // percentage
  timeframes: string[];
  markets: string[];
  symbols: string[];
  enableRiskManagement: boolean;
  enableOptimization: boolean;
  optimizationMetric: 'totalReturn' | 'sharpeRatio' | 'winRate' | 'profitFactor' | 'maxDrawdown';
}

export interface BacktestPosition {
  id: string;
  symbol: string;
  market: string;
  signal: TradingSignal;
  entryTime: Date;
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  takeProfit: number;
  currentPrice: number;
  unrealizedPnL: number;
  status: 'OPEN' | 'CLOSED';
}

export interface BacktestSnapshot {
  timestamp: Date;
  equity: number;
  cash: number;
  positions: BacktestPosition[];
  drawdown: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}

export interface OptimizationParameter {
  name: string;
  min: number;
  max: number;
  step: number;
  current: number;
}

export interface OptimizationSpace {
  parameters: OptimizationParameter[];
  totalCombinations: number;
  currentIteration: number;
}

export class BacktestingEngine extends EventEmitter {
  private config: BacktestConfig;
  private signalGenerator: SignalGenerator;
  private technicalAnalysis: TechnicalAnalysis;
  private riskManagement: RiskManagementService;
  
  // Backtest state
  private currentEquity: number = 0;
  private currentCash: number = 0;
  private positions: Map<string, BacktestPosition> = new Map();
  private trades: TradeResult[] = [];
  private snapshots: BacktestSnapshot[] = [];
  private equityCurve: { date: Date; equity: number }[] = [];
  private drawdownCurve: { date: Date; drawdown: number }[] = [];
  
  // Performance tracking
  private peakEquity: number = 0;
  private maxDrawdown: number = 0;
  private totalCommission: number = 0;
  private totalSlippage: number = 0;
  
  // Optimization state
  private optimizationResults: OptimizationResult[] = [];
  private isOptimizing: boolean = false;
  private optimizationSpace: OptimizationSpace | null = null;

  constructor(
    config: BacktestConfig,
    signalGenerator: SignalGenerator,
    technicalAnalysis: TechnicalAnalysis,
    riskManagement: RiskManagementService
  ) {
    super();
    this.config = config;
    this.signalGenerator = signalGenerator;
    this.technicalAnalysis = technicalAnalysis;
    this.riskManagement = riskManagement;
    
    console.log('Backtesting Engine initialized:', {
      period: `${config.startDate.toISOString()} to ${config.endDate.toISOString()}`,
      initialCapital: config.initialCapital,
      markets: config.markets,
      symbols: config.symbols.length
    });
  }

  /**
   * Run a complete backtest
   */
  async runBacktest(marketDataHistory: Map<string, MarketData[]>): Promise<BacktestResult> {
    console.log('🚀 Starting backtest...');
    
    this.initializeBacktest();
    
    // Get all timestamps and sort them
    const allTimestamps = this.getAllTimestamps(marketDataHistory);
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a.getTime() - b.getTime());
    
    let processedBars = 0;
    const totalBars = sortedTimestamps.length;
    
    // Process each timestamp
    for (const timestamp of sortedTimestamps) {
      if (timestamp < this.config.startDate || timestamp > this.config.endDate) {
        continue;
      }
      
      await this.processTimestamp(timestamp, marketDataHistory);
      
      processedBars++;
      if (processedBars % 1000 === 0) {
        const progress = (processedBars / totalBars) * 100;
        console.log(`📊 Backtest progress: ${progress.toFixed(1)}% (${processedBars}/${totalBars})`);
        this.emit('backtestProgress', { progress, processedBars, totalBars });
      }
    }
    
    // Close all remaining positions
    await this.closeAllPositions(this.config.endDate);
    
    // Calculate final results
    const result = this.calculateBacktestResult();
    
    console.log('✅ Backtest completed:', {
      totalReturn: `${result.totalReturn.toFixed(2)}%`,
      winRate: `${result.metrics.winRate.toFixed(2)}%`,
      profitFactor: result.metrics.profitFactor.toFixed(2),
      maxDrawdown: `${result.metrics.maxDrawdown.toFixed(2)}%`,
      totalTrades: result.metrics.totalTrades
    });
    
    this.emit('backtestCompleted', result);
    return result;
  }

  /**
   * Run parameter optimization
   */
  async runOptimization(
    marketDataHistory: Map<string, MarketData[]>,
    parameters: OptimizationParameter[]
  ): Promise<OptimizationResult[]> {
    console.log('🔧 Starting parameter optimization...');
    
    this.isOptimizing = true;
    this.optimizationResults = [];
    
    // Create optimization space
    this.optimizationSpace = {
      parameters,
      totalCombinations: this.calculateTotalCombinations(parameters),
      currentIteration: 0
    };
    
    console.log(`📈 Optimization space: ${this.optimizationSpace.totalCombinations} combinations`);
    
    // Generate all parameter combinations
    const combinations = this.generateParameterCombinations(parameters);
    
    for (const combination of combinations) {
      try {
        // Apply parameters to signal generator
        this.applyOptimizationParameters(combination);
        
        // Run backtest with current parameters
        const result = await this.runBacktest(marketDataHistory);
        
        // Calculate optimization score
        const score = this.calculateOptimizationScore(result, this.config.optimizationMetric);
        
        // Store result
        const optimizationResult: OptimizationResult = {
          parameters: { ...combination },
          performance: result.metrics,
          score,
          rank: 0 // Will be set after sorting
        };
        
        this.optimizationResults.push(optimizationResult);
        this.optimizationSpace.currentIteration++;
        
        const progress = (this.optimizationSpace.currentIteration / this.optimizationSpace.totalCombinations) * 100;
        console.log(`🔧 Optimization progress: ${progress.toFixed(1)}% - Score: ${score.toFixed(4)}`);
        
        this.emit('optimizationProgress', {
          progress,
          currentIteration: this.optimizationSpace.currentIteration,
          totalCombinations: this.optimizationSpace.totalCombinations,
          currentScore: score,
          bestScore: Math.max(...this.optimizationResults.map(r => r.score))
        });
        
      } catch (error) {
        console.error('Error in optimization iteration:', error);
      }
    }
    
    // Sort results by score and assign ranks
    this.optimizationResults.sort((a, b) => b.score - a.score);
    this.optimizationResults.forEach((result, index) => {
      result.rank = index + 1;
    });
    
    this.isOptimizing = false;
    
    console.log('✅ Optimization completed:', {
      totalRuns: this.optimizationResults.length,
      bestScore: this.optimizationResults[0]?.score.toFixed(4),
      bestParameters: this.optimizationResults[0]?.parameters
    });
    
    this.emit('optimizationCompleted', this.optimizationResults);
    return this.optimizationResults;
  }

  /**
   * Initialize backtest state
   */
  private initializeBacktest(): void {
    this.currentEquity = this.config.initialCapital;
    this.currentCash = this.config.initialCapital;
    this.positions.clear();
    this.trades = [];
    this.snapshots = [];
    this.equityCurve = [];
    this.drawdownCurve = [];
    this.peakEquity = this.config.initialCapital;
    this.maxDrawdown = 0;
    this.totalCommission = 0;
    this.totalSlippage = 0;
  }

  /**
   * Process a single timestamp
   */
  private async processTimestamp(
    timestamp: Date,
    marketDataHistory: Map<string, MarketData[]>
  ): Promise<void> {
    // Update position values and check for exits
    await this.updatePositions(timestamp, marketDataHistory);
    
    // Generate new signals
    const signals = await this.generateSignalsForTimestamp(timestamp, marketDataHistory);
    
    // Process entry signals
    for (const signal of signals) {
      await this.processEntrySignal(signal, timestamp);
    }
    
    // Update equity and drawdown
    this.updateEquityAndDrawdown(timestamp);
    
    // Create snapshot
    this.createSnapshot(timestamp);
  }

  /**
   * Update existing positions
   */
  private async updatePositions(
    timestamp: Date,
    marketDataHistory: Map<string, MarketData[]>
  ): Promise<void> {
    const positionsToClose: string[] = [];
    
    for (const [positionId, position] of Array.from(this.positions)) {
      // Get current market data
      const marketData = this.getMarketDataAtTimestamp(
        position.symbol,
        position.market,
        timestamp,
        marketDataHistory
      );
      
      if (!marketData) continue;
      
      // Update current price and unrealized P&L
      position.currentPrice = marketData.price;
      position.unrealizedPnL = this.calculateUnrealizedPnL(position);
      
      // Check for exit conditions
      if (this.shouldClosePosition(position, marketData)) {
        positionsToClose.push(positionId);
      }
    }
    
    // Close positions that meet exit criteria
    for (const positionId of positionsToClose) {
      await this.closePosition(positionId, timestamp);
    }
  }

  /**
   * Generate signals for current timestamp
   */
  private async generateSignalsForTimestamp(
    timestamp: Date,
    marketDataHistory: Map<string, MarketData[]>
  ): Promise<TradingSignal[]> {
    const signals: TradingSignal[] = [];
    
    for (const symbol of this.config.symbols) {
      for (const market of this.config.markets) {
        try {
          const marketData = this.getMarketDataAtTimestamp(symbol, market, timestamp, marketDataHistory);
          if (!marketData) continue;
          
          // Get technical analysis
          const technicalData = await this.technicalAnalysis.analyze(marketData);
          
          // Generate signal
          const signal = await this.signalGenerator.generateSignal(marketData, technicalData);
          if (signal && signal.confidence >= 0.6) {
            signals.push(signal);
          }
          
        } catch (error) {
          console.error(`Error generating signal for ${symbol}:`, error);
        }
      }
    }
    
    return signals;
  }

  /**
   * Process entry signal
   */
  private async processEntrySignal(signal: TradingSignal, timestamp: Date): Promise<void> {
    // Check if we already have a position for this symbol
    const existingPosition = Array.from(this.positions.values())
      .find(p => p.symbol === signal.symbol && p.market === signal.market);
    
    if (existingPosition) {
      return; // Skip if position already exists
    }
    
    // Calculate position size
    const positionSize = this.calculatePositionSize(signal);
    if (positionSize <= 0) return;
    
    // Calculate costs
    const entryPrice = this.calculateEntryPrice(signal.entryPrice);
    const positionValue = positionSize * entryPrice;
    const commission = positionValue * (this.config.commission / 100);
    const totalCost = positionValue + commission;
    
    // Check if we have enough cash
    if (totalCost > this.currentCash) {
      return; // Insufficient funds
    }
    
    // Create position
    const position: BacktestPosition = {
      id: `${signal.symbol}_${timestamp.getTime()}`,
      symbol: signal.symbol,
      market: signal.market,
      signal,
      entryTime: timestamp,
      entryPrice,
      quantity: positionSize,
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit,
      currentPrice: entryPrice,
      unrealizedPnL: 0,
      status: 'OPEN'
    };
    
    // Update cash and add position
    this.currentCash -= totalCost;
    this.totalCommission += commission;
    this.positions.set(position.id, position);
    
    console.log(`📈 Opened position: ${signal.symbol} ${signal.signal} at ${entryPrice} (Size: ${positionSize})`);
    
    this.emit('positionOpened', position);
  }

  /**
   * Close position
   */
  private async closePosition(positionId: string, timestamp: Date, reason?: string): Promise<void> {
    const position = this.positions.get(positionId);
    if (!position) return;
    
    // Calculate exit price with slippage
    const exitPrice = this.calculateExitPrice(position.currentPrice);
    const positionValue = position.quantity * exitPrice;
    const commission = positionValue * (this.config.commission / 100);
    const netProceeds = positionValue - commission;
    
    // Calculate P&L
    const grossPnL = (exitPrice - position.entryPrice) * position.quantity;
    const netPnL = grossPnL - commission - (position.quantity * position.entryPrice * (this.config.commission / 100));
    const pnlPercentage = (netPnL / (position.quantity * position.entryPrice)) * 100;
    
    // Create trade result
    const trade: TradeResult = {
      id: position.id,
      signal: position.signal,
      entryTime: position.entryTime,
      exitTime: timestamp,
      entryPrice: position.entryPrice,
      exitPrice,
      quantity: position.quantity,
      pnl: netPnL,
      pnlPercentage,
      status: 'CLOSED',
      exitReason: this.determineExitReason(position, reason),
      commission: commission + (position.quantity * position.entryPrice * (this.config.commission / 100)),
      slippage: Math.abs(exitPrice - position.currentPrice)
    };
    
    // Update cash and remove position
    this.currentCash += netProceeds;
    this.totalCommission += commission;
    this.totalSlippage += trade.slippage;
    this.trades.push(trade);
    this.positions.delete(positionId);
    
    position.status = 'CLOSED';
    
    console.log(`📉 Closed position: ${position.symbol} P&L: ${netPnL.toFixed(2)} (${pnlPercentage.toFixed(2)}%)`);
    
    this.emit('positionClosed', { position, trade });
  }

  /**
   * Close all positions
   */
  private async closeAllPositions(timestamp: Date): Promise<void> {
    const positionIds = Array.from(this.positions.keys());
    for (const positionId of positionIds) {
      await this.closePosition(positionId, timestamp, 'END_OF_BACKTEST');
    }
  }

  /**
   * Check if position should be closed
   */
  private shouldClosePosition(position: BacktestPosition, marketData: MarketData): boolean {
    const currentPrice = marketData.price;
    
    // Stop loss check
    if (position.signal.signal === 'BUY' && currentPrice <= position.stopLoss) {
      return true;
    }
    if (position.signal.signal === 'SELL' && currentPrice >= position.stopLoss) {
      return true;
    }
    
    // Take profit check
    if (position.signal.signal === 'BUY' && currentPrice >= position.takeProfit) {
      return true;
    }
    if (position.signal.signal === 'SELL' && currentPrice <= position.takeProfit) {
      return true;
    }
    
    return false;
  }

  /**
   * Calculate position size
   */
  private calculatePositionSize(signal: TradingSignal): number {
    const riskAmount = this.currentEquity * (this.config.riskPerTrade / 100);
    const stopDistance = Math.abs(signal.entryPrice - signal.stopLoss);
    
    if (stopDistance === 0) return 0;
    
    const positionSize = riskAmount / stopDistance;
    const maxPositionValue = this.currentEquity * (this.config.maxPositionSize / 100);
    const maxPositionSize = maxPositionValue / signal.entryPrice;
    
    return Math.min(positionSize, maxPositionSize);
  }

  /**
   * Calculate entry price with slippage
   */
  private calculateEntryPrice(signalPrice: number): number {
    const slippageAmount = signalPrice * (this.config.slippage / 100);
    return signalPrice + slippageAmount; // Assume slippage works against us
  }

  /**
   * Calculate exit price with slippage
   */
  private calculateExitPrice(currentPrice: number): number {
    const slippageAmount = currentPrice * (this.config.slippage / 100);
    return currentPrice - slippageAmount; // Assume slippage works against us
  }

  /**
   * Calculate unrealized P&L
   */
  private calculateUnrealizedPnL(position: BacktestPosition): number {
    const direction = position.signal.signal === 'BUY' ? 1 : -1;
    return (position.currentPrice - position.entryPrice) * position.quantity * direction;
  }

  /**
   * Update equity and drawdown
   */
  private updateEquityAndDrawdown(timestamp: Date): void {
    // Calculate total unrealized P&L
    const unrealizedPnL = Array.from(this.positions.values())
      .reduce((sum, position) => sum + position.unrealizedPnL, 0);
    
    // Update current equity
    this.currentEquity = this.currentCash + unrealizedPnL;
    
    // Update peak equity
    if (this.currentEquity > this.peakEquity) {
      this.peakEquity = this.currentEquity;
    }
    
    // Calculate current drawdown
    const currentDrawdown = ((this.peakEquity - this.currentEquity) / this.peakEquity) * 100;
    
    // Update max drawdown
    if (currentDrawdown > this.maxDrawdown) {
      this.maxDrawdown = currentDrawdown;
    }
    
    // Add to curves
    this.equityCurve.push({ date: new Date(timestamp), equity: this.currentEquity });
    this.drawdownCurve.push({ date: new Date(timestamp), drawdown: currentDrawdown });
  }

  /**
   * Create snapshot
   */
  private createSnapshot(timestamp: Date): void {
    const snapshot: BacktestSnapshot = {
      timestamp: new Date(timestamp),
      equity: this.currentEquity,
      cash: this.currentCash,
      positions: Array.from(this.positions.values()).map(p => ({ ...p })),
      drawdown: this.drawdownCurve[this.drawdownCurve.length - 1]?.drawdown || 0,
      totalTrades: this.trades.length,
      winningTrades: this.trades.filter(t => (t.pnl || 0) > 0).length,
      losingTrades: this.trades.filter(t => (t.pnl || 0) < 0).length
    };
    
    this.snapshots.push(snapshot);
  }

  /**
   * Calculate backtest result
   */
  private calculateBacktestResult(): BacktestResult {
    const finalCapital = this.currentEquity;
    const totalReturn = ((finalCapital - this.config.initialCapital) / this.config.initialCapital) * 100;
    const duration = this.config.endDate.getTime() - this.config.startDate.getTime();
    const years = duration / (365.25 * 24 * 60 * 60 * 1000);
    const annualizedReturn = Math.pow(finalCapital / this.config.initialCapital, 1 / years) - 1;
    
    const metrics = this.calculatePerformanceMetrics();
    
    return {
      id: `backtest_${Date.now()}`,
      startDate: this.config.startDate,
      endDate: this.config.endDate,
      initialCapital: this.config.initialCapital,
      finalCapital,
      totalReturn,
      annualizedReturn: annualizedReturn * 100,
      metrics,
      trades: [...this.trades],
      equityCurve: [...this.equityCurve],
      drawdownCurve: [...this.drawdownCurve]
    };
  }

  /**
   * Calculate performance metrics
   */
  private calculatePerformanceMetrics(): PerformanceMetrics {
    const winningTrades = this.trades.filter(t => (t.pnl || 0) > 0);
    const losingTrades = this.trades.filter(t => (t.pnl || 0) < 0);
    
    const totalPnL = this.trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
    
    const winRate = this.trades.length > 0 ? (winningTrades.length / this.trades.length) * 100 : 0;
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
    const averageWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
    
    // Calculate Sharpe ratio
    const returns = this.equityCurve.map((point, index) => {
      if (index === 0) return 0;
      return (point.equity - this.equityCurve[index - 1].equity) / this.equityCurve[index - 1].equity;
    }).slice(1);
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const returnStdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = returnStdDev > 0 ? (avgReturn / returnStdDev) * Math.sqrt(252) : 0;
    
    return {
      winRate,
      profitFactor,
      maxDrawdown: this.maxDrawdown,
      totalTrades: this.trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      averageWin,
      averageLoss,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl || 0)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl || 0)) : 0,
      consecutiveWins: this.calculateMaxConsecutive(this.trades, true),
      consecutiveLosses: this.calculateMaxConsecutive(this.trades, false),
      sharpeRatio,
      calmarRatio: this.maxDrawdown > 0 ? (totalPnL / this.config.initialCapital * 100) / this.maxDrawdown : 0,
      recoveryFactor: this.maxDrawdown > 0 ? totalPnL / (this.config.initialCapital * this.maxDrawdown / 100) : 0,
      profitabilityIndex: this.trades.length > 0 ? totalPnL / this.trades.length : 0
    };
  }

  /**
   * Calculate maximum consecutive wins or losses
   */
  private calculateMaxConsecutive(trades: TradeResult[], wins: boolean): number {
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    
    for (const trade of trades) {
      const isWin = (trade.pnl || 0) > 0;
      if (isWin === wins) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    }
    
    return maxConsecutive;
  }

  /**
   * Get all timestamps from market data
   */
  private getAllTimestamps(marketDataHistory: Map<string, MarketData[]>): Set<Date> {
    const timestamps = new Set<Date>();
    
    for (const dataArray of Array.from(marketDataHistory.values())) {
      for (const data of dataArray) {
        timestamps.add(data.timestamp);
      }
    }
    
    return timestamps;
  }

  /**
   * Get market data at specific timestamp
   */
  private getMarketDataAtTimestamp(
    symbol: string,
    market: string,
    timestamp: Date,
    marketDataHistory: Map<string, MarketData[]>
  ): MarketData | null {
    const key = `${symbol}_${market}`;
    const dataArray = marketDataHistory.get(key);
    
    if (!dataArray) return null;
    
    // Find the closest data point at or before the timestamp
    let closestData: MarketData | null = null;
    let closestTimeDiff = Infinity;
    
    for (const data of dataArray) {
      const timeDiff = timestamp.getTime() - data.timestamp.getTime();
      if (timeDiff >= 0 && timeDiff < closestTimeDiff) {
        closestTimeDiff = timeDiff;
        closestData = data;
      }
    }
    
    return closestData;
  }

  /**
   * Determine exit reason
   */
  private determineExitReason(position: BacktestPosition, reason?: string): TradeResult['exitReason'] {
    if (reason === 'END_OF_BACKTEST') return 'MANUAL';
    
    const currentPrice = position.currentPrice;
    
    if (position.signal.signal === 'BUY') {
      if (currentPrice <= position.stopLoss) return 'STOP_LOSS';
      if (currentPrice >= position.takeProfit) return 'TAKE_PROFIT';
    } else {
      if (currentPrice >= position.stopLoss) return 'STOP_LOSS';
      if (currentPrice <= position.takeProfit) return 'TAKE_PROFIT';
    }
    
    return 'MANUAL';
  }

  // Optimization methods

  /**
   * Calculate total parameter combinations
   */
  private calculateTotalCombinations(parameters: OptimizationParameter[]): number {
    return parameters.reduce((total, param) => {
      const steps = Math.floor((param.max - param.min) / param.step) + 1;
      return total * steps;
    }, 1);
  }

  /**
   * Generate all parameter combinations
   */
  private generateParameterCombinations(parameters: OptimizationParameter[]): { [key: string]: number }[] {
    const combinations: { [key: string]: number }[] = [];
    
    const generateRecursive = (index: number, current: { [key: string]: number }) => {
      if (index >= parameters.length) {
        combinations.push({ ...current });
        return;
      }
      
      const param = parameters[index];
      for (let value = param.min; value <= param.max; value += param.step) {
        current[param.name] = value;
        generateRecursive(index + 1, current);
      }
    };
    
    generateRecursive(0, {});
    return combinations;
  }

  /**
   * Apply optimization parameters
   */
  private applyOptimizationParameters(parameters: { [key: string]: number }): void {
    // Apply parameters to signal generator configuration
    const config = this.signalGenerator.getConfiguration();
    
    if (parameters.minConfidence !== undefined) {
      config.minConfidence = parameters.minConfidence;
    }
    if (parameters.minRiskReward !== undefined) {
      config.minRiskReward = parameters.minRiskReward;
    }
    if (parameters.maxRiskReward !== undefined) {
      config.maxRiskReward = parameters.maxRiskReward;
    }
    
    this.signalGenerator.updateConfiguration(config);
  }

  /**
   * Calculate optimization score
   */
  private calculateOptimizationScore(result: BacktestResult, metric: string): number {
    switch (metric) {
      case 'totalReturn':
        return result.totalReturn;
      case 'sharpeRatio':
        return result.metrics.sharpeRatio;
      case 'winRate':
        return result.metrics.winRate;
      case 'profitFactor':
        return result.metrics.profitFactor;
      case 'maxDrawdown':
        return -result.metrics.maxDrawdown; // Negative because lower is better
      default:
        // Composite score
        return (
          result.metrics.winRate * 0.3 +
          result.metrics.profitFactor * 10 +
          result.metrics.sharpeRatio * 20 +
          (-result.metrics.maxDrawdown) * 2
        );
    }
  }

  // Public API methods

  /**
   * Get current backtest status
   */
  getStatus() {
    return {
      isRunning: this.snapshots.length > 0,
      isOptimizing: this.isOptimizing,
      currentEquity: this.currentEquity,
      currentCash: this.currentCash,
      openPositions: this.positions.size,
      totalTrades: this.trades.length,
      maxDrawdown: this.maxDrawdown,
      optimizationProgress: this.optimizationSpace ? {
        current: this.optimizationSpace.currentIteration,
        total: this.optimizationSpace.totalCombinations,
        progress: (this.optimizationSpace.currentIteration / this.optimizationSpace.totalCombinations) * 100
      } : null
    };
  }

  /**
   * Get optimization results
   */
  getOptimizationResults(): OptimizationResult[] {
    return [...this.optimizationResults];
  }

  /**
   * Get current positions
   */
  getCurrentPositions(): BacktestPosition[] {
    return Array.from(this.positions.values());
  }

  /**
   * Get trade history
   */
  getTradeHistory(): TradeResult[] {
    return [...this.trades];
  }

  /**
   * Get equity curve
   */
  getEquityCurve(): { date: Date; equity: number }[] {
    return [...this.equityCurve];
  }

  /**
   * Get drawdown curve
   */
  getDrawdownCurve(): { date: Date; drawdown: number }[] {
    return [...this.drawdownCurve];
  }

  /**
   * Export backtest data
   */
  exportData() {
    return {
      config: this.config,
      trades: this.trades,
      equityCurve: this.equityCurve,
      drawdownCurve: this.drawdownCurve,
      snapshots: this.snapshots,
      optimizationResults: this.optimizationResults,
      status: this.getStatus(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Update configuration
   */
  updateConfiguration(newConfig: Partial<BacktestConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Backtest configuration updated:', newConfig);
    this.emit('configurationUpdated', this.config);
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.initializeBacktest();
    this.optimizationResults = [];
    this.optimizationSpace = null;
    console.log('Backtest data cleared');
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.clear();
    this.removeAllListeners();
    console.log('Backtesting engine destroyed');
  }
}