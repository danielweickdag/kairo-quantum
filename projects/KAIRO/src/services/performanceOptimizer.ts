import { EventEmitter } from 'events';
import { BacktestingEngine, BacktestConfig, OptimizationParameter } from './backtestingEngine';
import { MarketData, TradingSignal, BacktestResult, OptimizationResult, PerformanceMetrics } from './types';
import { SignalGenerator } from './signalGenerator';
import { TechnicalAnalysis } from './technicalAnalysis';
import { RiskManagementService } from './riskManagementService';

export interface OptimizationJob {
  id: string;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  config: BacktestConfig;
  parameters: OptimizationParameter[];
  startTime?: Date;
  endTime?: Date;
  progress: number;
  results?: OptimizationResult[];
  bestResult?: OptimizationResult;
  error?: string;
}

export interface PerformanceReport {
  id: string;
  generatedAt: Date;
  period: { start: Date; end: Date };
  summary: {
    totalReturn: number;
    annualizedReturn: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
    totalTrades: number;
  };
  comparison: {
    benchmark: string;
    outperformance: number;
    correlation: number;
    beta: number;
    alpha: number;
  };
  recommendations: {
    type: 'PARAMETER_ADJUSTMENT' | 'RISK_REDUCTION' | 'STRATEGY_CHANGE' | 'MARKET_FOCUS';
    description: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    implementation: string;
  }[];
  charts: {
    equityCurve: { date: Date; equity: number }[];
    drawdownCurve: { date: Date; drawdown: number }[];
    monthlyReturns: { month: string; return: number }[];
    winLossDistribution: { range: string; count: number }[];
  };
}

export interface OptimizationStrategy {
  name: string;
  description: string;
  parameters: OptimizationParameter[];
  targetMetric: 'winRate' | 'profitFactor' | 'sharpeRatio' | 'totalReturn' | 'maxDrawdown';
  constraints: {
    minWinRate?: number;
    maxDrawdown?: number;
    minProfitFactor?: number;
    minTrades?: number;
  };
}

export class PerformanceOptimizer extends EventEmitter {
  private backtestingEngine: BacktestingEngine;
  private signalGenerator: SignalGenerator;
  private technicalAnalysis: TechnicalAnalysis;
  private riskManagement: RiskManagementService;
  
  private optimizationJobs: Map<string, OptimizationJob> = new Map();
  private marketDataCache: Map<string, Map<string, MarketData[]>> = new Map();
  private performanceHistory: PerformanceMetrics[] = [];
  private isOptimizing: boolean = false;
  
  // Predefined optimization strategies
  private optimizationStrategies: Map<string, OptimizationStrategy> = new Map();
  
  constructor(
    signalGenerator: SignalGenerator,
    technicalAnalysis: TechnicalAnalysis,
    riskManagement: RiskManagementService
  ) {
    super();
    this.signalGenerator = signalGenerator;
    this.technicalAnalysis = technicalAnalysis;
    this.riskManagement = riskManagement;
    
    // Initialize with default backtest config
    const defaultConfig: BacktestConfig = {
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      endDate: new Date(),
      initialCapital: 10000,
      commission: 0.1,
      slippage: 0.05,
      maxPositionSize: 10,
      riskPerTrade: 2,
      timeframes: ['1h', '4h', '1d'],
      markets: ['CRYPTO', 'STOCKS'],
      symbols: ['BTCUSDT', 'ETHUSDT', 'AAPL', 'GOOGL'],
      enableRiskManagement: true,
      enableOptimization: true,
      optimizationMetric: 'sharpeRatio'
    };
    
    this.backtestingEngine = new BacktestingEngine(
      defaultConfig,
      signalGenerator,
      technicalAnalysis,
      riskManagement
    );
    
    this.initializeOptimizationStrategies();
    
    console.log('Performance Optimizer initialized');
  }

  /**
   * Initialize predefined optimization strategies
   */
  private initializeOptimizationStrategies(): void {
    // Conservative strategy - focus on risk management
    this.optimizationStrategies.set('conservative', {
      name: 'Conservative Risk Management',
      description: 'Optimize for consistent returns with low drawdown',
      parameters: [
        { name: 'minConfidence', min: 0.7, max: 0.9, step: 0.05, current: 0.8 },
        { name: 'minRiskReward', min: 1.5, max: 3.0, step: 0.25, current: 2.0 },
        { name: 'maxRiskReward', min: 3.0, max: 6.0, step: 0.5, current: 4.0 }
      ],
      targetMetric: 'maxDrawdown',
      constraints: {
        minWinRate: 60,
        maxDrawdown: 10,
        minProfitFactor: 1.2,
        minTrades: 20
      }
    });
    
    // Aggressive strategy - focus on returns
    this.optimizationStrategies.set('aggressive', {
      name: 'Aggressive Growth',
      description: 'Optimize for maximum returns with higher risk tolerance',
      parameters: [
        { name: 'minConfidence', min: 0.6, max: 0.8, step: 0.05, current: 0.7 },
        { name: 'minRiskReward', min: 1.0, max: 2.5, step: 0.25, current: 1.5 },
        { name: 'maxRiskReward', min: 4.0, max: 8.0, step: 0.5, current: 6.0 }
      ],
      targetMetric: 'totalReturn',
      constraints: {
        minWinRate: 50,
        maxDrawdown: 20,
        minProfitFactor: 1.0,
        minTrades: 15
      }
    });
    
    // Balanced strategy - optimize Sharpe ratio
    this.optimizationStrategies.set('balanced', {
      name: 'Balanced Risk-Return',
      description: 'Optimize for best risk-adjusted returns',
      parameters: [
        { name: 'minConfidence', min: 0.65, max: 0.85, step: 0.05, current: 0.75 },
        { name: 'minRiskReward', min: 1.2, max: 2.8, step: 0.2, current: 2.0 },
        { name: 'maxRiskReward', min: 3.5, max: 7.0, step: 0.5, current: 5.0 }
      ],
      targetMetric: 'sharpeRatio',
      constraints: {
        minWinRate: 55,
        maxDrawdown: 15,
        minProfitFactor: 1.1,
        minTrades: 18
      }
    });
    
    // High frequency strategy
    this.optimizationStrategies.set('highFrequency', {
      name: 'High Frequency Trading',
      description: 'Optimize for frequent trades with small profits',
      parameters: [
        { name: 'minConfidence', min: 0.55, max: 0.75, step: 0.05, current: 0.65 },
        { name: 'minRiskReward', min: 0.8, max: 2.0, step: 0.2, current: 1.2 },
        { name: 'maxRiskReward', min: 2.0, max: 4.0, step: 0.25, current: 3.0 }
      ],
      targetMetric: 'winRate',
      constraints: {
        minWinRate: 65,
        maxDrawdown: 12,
        minProfitFactor: 1.3,
        minTrades: 50
      }
    });
    
    console.log(`Initialized ${this.optimizationStrategies.size} optimization strategies`);
  }

  /**
   * Start optimization job
   */
  async startOptimization(
    strategyName: string,
    config?: Partial<BacktestConfig>,
    customParameters?: OptimizationParameter[]
  ): Promise<string> {
    if (this.isOptimizing) {
      throw new Error('Optimization already in progress');
    }
    
    const strategy = this.optimizationStrategies.get(strategyName);
    if (!strategy) {
      throw new Error(`Unknown optimization strategy: ${strategyName}`);
    }
    
    const jobId = `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Merge configuration
    const backtestConfig: BacktestConfig = {
      ...this.backtestingEngine['config'],
      ...config
    };
    
    // Use custom parameters or strategy defaults
    const parameters = customParameters || strategy.parameters;
    
    const job: OptimizationJob = {
      id: jobId,
      name: `${strategy.name} Optimization`,
      status: 'PENDING',
      config: backtestConfig,
      parameters,
      progress: 0
    };
    
    this.optimizationJobs.set(jobId, job);
    
    console.log(`🚀 Starting optimization job: ${job.name} (${jobId})`);
    
    // Start optimization in background
    this.runOptimizationJob(jobId, strategy).catch(error => {
      console.error(`Optimization job ${jobId} failed:`, error);
      job.status = 'FAILED';
      job.error = error.message;
      job.endTime = new Date();
      this.emit('optimizationFailed', { jobId, error });
    });
    
    return jobId;
  }

  /**
   * Run optimization job
   */
  private async runOptimizationJob(jobId: string, strategy: OptimizationStrategy): Promise<void> {
    const job = this.optimizationJobs.get(jobId);
    if (!job) return;
    
    try {
      this.isOptimizing = true;
      job.status = 'RUNNING';
      job.startTime = new Date();
      
      this.emit('optimizationStarted', { jobId, job });
      
      // Update backtest configuration
      this.backtestingEngine.updateConfiguration(job.config);
      
      // Generate or load market data
      const marketData = await this.prepareMarketData(job.config);
      
      // Set up progress tracking
      this.backtestingEngine.on('optimizationProgress', (progress) => {
        job.progress = progress.progress;
        this.emit('optimizationProgress', { jobId, progress });
      });
      
      // Run optimization
      const results = await this.backtestingEngine.runOptimization(marketData, job.parameters);
      
      // Filter results based on strategy constraints
      const filteredResults = this.filterResultsByConstraints(results, strategy.constraints);
      
      // Find best result
      const bestResult = filteredResults.length > 0 ? filteredResults[0] : undefined;
      
      // Update job
      job.status = 'COMPLETED';
      job.endTime = new Date();
      job.progress = 100;
      job.results = filteredResults;
      job.bestResult = bestResult;
      
      console.log(`✅ Optimization completed: ${job.name}`);
      console.log(`Best result: Score ${bestResult?.score.toFixed(4)}, Parameters:`, bestResult?.parameters);
      
      // Apply best parameters if they meet constraints
      if (bestResult && this.meetsConstraints(bestResult.performance, strategy.constraints)) {
        await this.applyOptimizedParameters(bestResult.parameters);
        console.log('🎯 Applied optimized parameters to signal generator');
      }
      
      this.emit('optimizationCompleted', { jobId, job, bestResult });
      
    } finally {
      this.isOptimizing = false;
      this.backtestingEngine.removeAllListeners('optimizationProgress');
    }
  }

  /**
   * Prepare market data for backtesting
   */
  private async prepareMarketData(config: BacktestConfig): Promise<Map<string, MarketData[]>> {
    const marketData = new Map<string, MarketData[]>();
    
    // Check cache first
    const cacheKey = `${config.startDate.getTime()}_${config.endDate.getTime()}`;
    if (this.marketDataCache.has(cacheKey)) {
      return this.marketDataCache.get(cacheKey)!;
    }
    
    console.log('📊 Preparing market data for backtesting...');
    
    // Generate mock historical data for each symbol/market combination
    for (const market of config.markets) {
      for (const symbol of config.symbols) {
        const key = `${symbol}_${market}`;
        const data = await this.generateHistoricalData(symbol, market, config.startDate, config.endDate);
        marketData.set(key, data);
      }
    }
    
    // Cache the data
    this.marketDataCache.set(cacheKey, marketData);
    
    console.log(`📈 Generated historical data for ${marketData.size} instruments`);
    return marketData;
  }

  /**
   * Generate mock historical data
   */
  private async generateHistoricalData(
    symbol: string,
    market: string,
    startDate: Date,
    endDate: Date
  ): Promise<MarketData[]> {
    const data: MarketData[] = [];
    const duration = endDate.getTime() - startDate.getTime();
    const intervals = Math.floor(duration / (60 * 60 * 1000)); // Hourly data
    
    let currentPrice = 100 + Math.random() * 900; // Random starting price
    const volatility = 0.02 + Math.random() * 0.06; // Random volatility
    
    for (let i = 0; i < intervals; i++) {
      const timestamp = new Date(startDate.getTime() + i * 60 * 60 * 1000);
      
      // Generate OHLCV data with realistic price movement
      const change = (Math.random() - 0.5) * volatility * currentPrice;
      const open = currentPrice;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * currentPrice * 0.3;
      const low = Math.min(open, close) - Math.random() * volatility * currentPrice * 0.3;
      const volume = 1000000 + Math.random() * 5000000;
      
      // Create OHLCV array (last 100 periods)
      const ohlcv = [];
      for (let j = Math.max(0, i - 99); j <= i; j++) {
        const periodPrice = currentPrice + (j - i) * change / 100;
        ohlcv.push({
          open: periodPrice,
          high: periodPrice * (1 + Math.random() * 0.01),
          low: periodPrice * (1 - Math.random() * 0.01),
          close: periodPrice,
          volume: volume * (0.8 + Math.random() * 0.4)
        });
      }
      
      const marketData: MarketData = {
        symbol,
        market: market as any,
        price: close,
        volume,
        high24h: high,
        low24h: low,
        change24h: ((close - currentPrice) / currentPrice) * 100,
        timestamp,
        ohlcv
      };
      
      data.push(marketData);
      currentPrice = close;
    }
    
    return data;
  }

  /**
   * Filter results by strategy constraints
   */
  private filterResultsByConstraints(
    results: OptimizationResult[],
    constraints: OptimizationStrategy['constraints']
  ): OptimizationResult[] {
    return results.filter(result => this.meetsConstraints(result.performance, constraints));
  }

  /**
   * Check if performance meets constraints
   */
  private meetsConstraints(
    performance: PerformanceMetrics,
    constraints: OptimizationStrategy['constraints']
  ): boolean {
    if (constraints.minWinRate && performance.winRate < constraints.minWinRate) {
      return false;
    }
    if (constraints.maxDrawdown && performance.maxDrawdown > constraints.maxDrawdown) {
      return false;
    }
    if (constraints.minProfitFactor && performance.profitFactor < constraints.minProfitFactor) {
      return false;
    }
    if (constraints.minTrades && performance.totalTrades < constraints.minTrades) {
      return false;
    }
    return true;
  }

  /**
   * Apply optimized parameters to signal generator
   */
  private async applyOptimizedParameters(parameters: { [key: string]: number }): Promise<void> {
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
    
    this.emit('parametersApplied', { parameters, config });
  }

  /**
   * Generate performance report
   */
  async generatePerformanceReport(
    startDate: Date,
    endDate: Date,
    benchmark?: string
  ): Promise<PerformanceReport> {
    console.log('📊 Generating performance report...');
    
    // Run backtest for the period
    const config: BacktestConfig = {
      ...this.backtestingEngine['config'],
      startDate,
      endDate
    };
    
    this.backtestingEngine.updateConfiguration(config);
    const marketData = await this.prepareMarketData(config);
    const backtestResult = await this.backtestingEngine.runBacktest(marketData);
    
    // Calculate additional metrics
    const monthlyReturns = this.calculateMonthlyReturns(backtestResult.equityCurve);
    const winLossDistribution = this.calculateWinLossDistribution(backtestResult.trades);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(backtestResult.metrics);
    
    const report: PerformanceReport = {
      id: `report_${Date.now()}`,
      generatedAt: new Date(),
      period: { start: startDate, end: endDate },
      summary: {
        totalReturn: backtestResult.totalReturn,
        annualizedReturn: backtestResult.annualizedReturn,
        winRate: backtestResult.metrics.winRate,
        profitFactor: backtestResult.metrics.profitFactor,
        maxDrawdown: backtestResult.metrics.maxDrawdown,
        sharpeRatio: backtestResult.metrics.sharpeRatio,
        totalTrades: backtestResult.metrics.totalTrades
      },
      comparison: {
        benchmark: benchmark || 'SPY',
        outperformance: 0, // Would calculate vs benchmark
        correlation: 0.75, // Mock value
        beta: 1.2, // Mock value
        alpha: 0.05 // Mock value
      },
      recommendations,
      charts: {
        equityCurve: backtestResult.equityCurve,
        drawdownCurve: backtestResult.drawdownCurve,
        monthlyReturns,
        winLossDistribution
      }
    };
    
    console.log('✅ Performance report generated');
    this.emit('reportGenerated', report);
    
    return report;
  }

  /**
   * Calculate monthly returns
   */
  private calculateMonthlyReturns(equityCurve: { date: Date; equity: number }[]): { month: string; return: number }[] {
    const monthlyData = new Map<string, { start: number; end: number }>();
    
    equityCurve.forEach(point => {
      const monthKey = `${point.date.getFullYear()}-${String(point.date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { start: point.equity, end: point.equity });
      } else {
        monthlyData.get(monthKey)!.end = point.equity;
      }
    });
    
    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      return: ((data.end - data.start) / data.start) * 100
    }));
  }

  /**
   * Calculate win/loss distribution
   */
  private calculateWinLossDistribution(trades: any[]): { range: string; count: number }[] {
    const ranges = [
      { min: -Infinity, max: -10, label: '< -10%' },
      { min: -10, max: -5, label: '-10% to -5%' },
      { min: -5, max: -2, label: '-5% to -2%' },
      { min: -2, max: 0, label: '-2% to 0%' },
      { min: 0, max: 2, label: '0% to 2%' },
      { min: 2, max: 5, label: '2% to 5%' },
      { min: 5, max: 10, label: '5% to 10%' },
      { min: 10, max: Infinity, label: '> 10%' }
    ];
    
    return ranges.map(range => ({
      range: range.label,
      count: trades.filter(trade => {
        const pnlPercent = trade.pnlPercentage || 0;
        return pnlPercent > range.min && pnlPercent <= range.max;
      }).length
    }));
  }

  /**
   * Generate recommendations based on performance
   */
  private generateRecommendations(metrics: PerformanceMetrics): PerformanceReport['recommendations'] {
    const recommendations: PerformanceReport['recommendations'] = [];
    
    // Win rate recommendations
    if (metrics.winRate < 60) {
      recommendations.push({
        type: 'PARAMETER_ADJUSTMENT',
        description: 'Win rate is below target (60%). Consider increasing signal confidence threshold.',
        impact: 'HIGH',
        implementation: 'Increase minConfidence parameter from current value to 0.75+'
      });
    }
    
    // Drawdown recommendations
    if (metrics.maxDrawdown > 15) {
      recommendations.push({
        type: 'RISK_REDUCTION',
        description: 'Maximum drawdown exceeds acceptable level (15%). Implement stricter risk management.',
        impact: 'HIGH',
        implementation: 'Reduce position sizes and implement dynamic stop-loss adjustments'
      });
    }
    
    // Profit factor recommendations
    if (metrics.profitFactor < 1.5) {
      recommendations.push({
        type: 'STRATEGY_CHANGE',
        description: 'Profit factor is below optimal level (1.5). Strategy may need adjustment.',
        impact: 'MEDIUM',
        implementation: 'Review signal generation logic and consider filtering low-quality signals'
      });
    }
    
    // Trade frequency recommendations
    if (metrics.totalTrades < 20) {
      recommendations.push({
        type: 'MARKET_FOCUS',
        description: 'Low trade frequency may indicate overly restrictive parameters.',
        impact: 'MEDIUM',
        implementation: 'Consider expanding to additional markets or reducing signal thresholds'
      });
    }
    
    // Sharpe ratio recommendations
    if (metrics.sharpeRatio < 1.0) {
      recommendations.push({
        type: 'PARAMETER_ADJUSTMENT',
        description: 'Sharpe ratio indicates poor risk-adjusted returns. Optimize risk-reward ratios.',
        impact: 'MEDIUM',
        implementation: 'Adjust take-profit and stop-loss levels to improve risk-reward ratios'
      });
    }
    
    return recommendations;
  }

  /**
   * Run continuous optimization
   */
  async startContinuousOptimization(intervalHours: number = 24): Promise<void> {
    console.log(`🔄 Starting continuous optimization (every ${intervalHours} hours)`);
    
    const optimize = async () => {
      try {
        if (!this.isOptimizing) {
          console.log('🔧 Running scheduled optimization...');
          await this.startOptimization('balanced');
        }
      } catch (error) {
        console.error('Error in continuous optimization:', error);
      }
    };
    
    // Run initial optimization
    await optimize();
    
    // Schedule recurring optimizations
    setInterval(optimize, intervalHours * 60 * 60 * 1000);
    
    this.emit('continuousOptimizationStarted', { intervalHours });
  }

  // Public API methods

  /**
   * Get optimization job status
   */
  getOptimizationJob(jobId: string): OptimizationJob | undefined {
    return this.optimizationJobs.get(jobId);
  }

  /**
   * Get all optimization jobs
   */
  getAllOptimizationJobs(): OptimizationJob[] {
    return Array.from(this.optimizationJobs.values());
  }

  /**
   * Cancel optimization job
   */
  cancelOptimization(jobId: string): boolean {
    const job = this.optimizationJobs.get(jobId);
    if (job && job.status === 'RUNNING') {
      job.status = 'CANCELLED';
      job.endTime = new Date();
      this.isOptimizing = false;
      console.log(`❌ Cancelled optimization job: ${jobId}`);
      this.emit('optimizationCancelled', { jobId });
      return true;
    }
    return false;
  }

  /**
   * Get available optimization strategies
   */
  getOptimizationStrategies(): OptimizationStrategy[] {
    return Array.from(this.optimizationStrategies.values());
  }

  /**
   * Add custom optimization strategy
   */
  addOptimizationStrategy(name: string, strategy: OptimizationStrategy): void {
    this.optimizationStrategies.set(name, strategy);
    console.log(`Added optimization strategy: ${name}`);
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isOptimizing: this.isOptimizing,
      totalJobs: this.optimizationJobs.size,
      runningJobs: Array.from(this.optimizationJobs.values()).filter(j => j.status === 'RUNNING').length,
      completedJobs: Array.from(this.optimizationJobs.values()).filter(j => j.status === 'COMPLETED').length,
      availableStrategies: this.optimizationStrategies.size,
      cacheSize: this.marketDataCache.size
    };
  }

  /**
   * Clear cache and history
   */
  clearCache(): void {
    this.marketDataCache.clear();
    this.performanceHistory = [];
    console.log('Performance optimizer cache cleared');
  }

  /**
   * Export optimization data
   */
  exportData() {
    return {
      jobs: Array.from(this.optimizationJobs.values()),
      strategies: Array.from(this.optimizationStrategies.values()),
      performanceHistory: this.performanceHistory,
      status: this.getStatus(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.clearCache();
    this.backtestingEngine.destroy();
    this.removeAllListeners();
    console.log('Performance optimizer destroyed');
  }
}