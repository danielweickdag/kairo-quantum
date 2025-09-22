import { MarketType, TradingSignal, MarketData } from './multiMarketTradingEngine';

type MarketTypeKey = keyof MarketType;
import { TechnicalAnalysis, TechnicalIndicators } from './technicalAnalysis';
import { SignalGenerator, SignalConfiguration, SignalMetrics } from './signalGenerator';
import { AlertsNotificationSystem } from './alertsNotificationSystem';
import { MarketDataProvider } from './marketDataProvider';

export interface ScanConfiguration {
  userId: string;
  markets: MarketTypeKey[];
  symbols: string[];
  timeframes: Timeframe[];
  scanInterval: number; // in milliseconds
  signalFilters: SignalFilters;
  enabled: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  maxSignalsPerHour: number;
  autoTrade: boolean;
}

export interface SignalFilters {
  minConfidence: number;
  maxRiskReward: number;
  minRiskReward: number;
  allowedSignalTypes: ('BUY' | 'SELL' | 'HOLD' | 'STRONG_BUY' | 'STRONG_SELL')[];
  excludeSymbols: string[];
  includeOnlySymbols: string[];
  marketConditions: MarketCondition[];
  volatilityRange: { min: number; max: number };
  volumeThreshold: number;
}

export interface Timeframe {
  name: string;
  interval: number; // in minutes
  weight: number; // importance weight 0-1
  enabled: boolean;
}

export interface MarketCondition {
  type: 'TRENDING' | 'RANGING' | 'VOLATILE' | 'QUIET' | 'BREAKOUT';
  enabled: boolean;
}

export interface ScanResult {
  id: string;
  userId: string;
  symbol: string;
  market: MarketTypeKey;
  timeframe: string;
  signal: TradingSignal;
  confidence: number;
  technicalIndicators: TechnicalIndicators;
  marketCondition: string;
  scanTime: Date;
  priority: number;
  alerts: ScanAlert[];
}

export interface ScanAlert {
  type: 'NEW_SIGNAL' | 'SIGNAL_CONFIRMATION' | 'TREND_CHANGE' | 'BREAKOUT' | 'VOLUME_SPIKE';
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: Date;
}

export interface MarketScanStats {
  totalScans: number;
  signalsGenerated: number;
  successfulSignals: number;
  averageConfidence: number;
  scansByMarket: Record<string, number>;
  scansByTimeframe: Record<string, number>;
  lastScanTime: Date;
  uptime: number; // percentage
  errorsCount: number;
}

export interface ScannerPerformance {
  scansPerSecond: number;
  averageResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeConnections: number;
  queueSize: number;
}

export interface WatchlistItem {
  symbol: string;
  market: MarketTypeKey;
  priority: number;
  lastPrice: number;
  priceChange: number;
  volume: number;
  alerts: string[];
  addedAt: Date;
  lastUpdated: Date;
}

export interface MarketSession {
  market: MarketTypeKey;
  name: string;
  timezone: string;
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isActive: boolean;
  nextOpen: Date;
  nextClose: Date;
}

export class MarketScanningSystem {
  private scanConfigurations: Map<string, ScanConfiguration> = new Map();
  private scanResults: Map<string, ScanResult[]> = new Map();
  private watchlists: Map<string, WatchlistItem[]> = new Map();
  private scanStats: Map<string, MarketScanStats> = new Map();
  private scannerPerformance!: ScannerPerformance;
  private marketSessions!: MarketSession[];
  private scanningIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isScanning: boolean = false;
  private scanQueue: { userId: string; symbol: string; timeframe: string }[] = [];
  private maxConcurrentScans: number = 50;
  private activeScanCount: number = 0;

  // Default timeframes for comprehensive scanning
  private defaultTimeframes: Timeframe[] = [
    { name: '1m', interval: 1, weight: 0.1, enabled: true },
    { name: '5m', interval: 5, weight: 0.2, enabled: true },
    { name: '15m', interval: 15, weight: 0.3, enabled: true },
    { name: '30m', interval: 30, weight: 0.4, enabled: true },
    { name: '1h', interval: 60, weight: 0.6, enabled: true },
    { name: '4h', interval: 240, weight: 0.8, enabled: true },
    { name: '1d', interval: 1440, weight: 1.0, enabled: true },
    { name: '1w', interval: 10080, weight: 0.9, enabled: true }
  ];

  constructor(
    private technicalAnalysis: TechnicalAnalysis,
    private signalGenerator: SignalGenerator,
    private alertsSystem: AlertsNotificationSystem,
    private marketDataProvider: MarketDataProvider
  ) {
    this.initializeMarketSessions();
    this.initializeScannerPerformance();
    this.startContinuousScanning();
  }

  /**
   * Initialize market sessions for 24/7 coverage
   */
  private initializeMarketSessions(): void {
    this.marketSessions = [
      {
        market: 'FOREX',
        name: 'Forex Market',
        timezone: 'UTC',
        openTime: '22:00', // Sunday
        closeTime: '22:00', // Friday
        isActive: true,
        nextOpen: new Date(),
        nextClose: new Date()
      },
      {
        market: 'CRYPTO',
        name: 'Cryptocurrency Market',
        timezone: 'UTC',
        openTime: '00:00',
        closeTime: '23:59',
        isActive: true,
        nextOpen: new Date(),
        nextClose: new Date()
      },
      {
        market: 'STOCKS',
        name: 'US Stock Market',
        timezone: 'America/New_York',
        openTime: '09:30',
        closeTime: '16:00',
        isActive: this.isMarketHours('STOCKS'),
        nextOpen: this.getNextMarketOpen('STOCKS'),
        nextClose: this.getNextMarketClose('STOCKS')
      },
      {
        market: 'STOCKS',
        name: 'European Stock Market',
        timezone: 'Europe/London',
        openTime: '08:00',
        closeTime: '16:30',
        isActive: this.isMarketHours('STOCKS'),
        nextOpen: this.getNextMarketOpen('STOCKS'),
        nextClose: this.getNextMarketClose('STOCKS')
      },
      {
        market: 'STOCKS',
        name: 'Asian Stock Market',
        timezone: 'Asia/Tokyo',
        openTime: '09:00',
        closeTime: '15:00',
        isActive: this.isMarketHours('STOCKS'),
        nextOpen: this.getNextMarketOpen('STOCKS'),
        nextClose: this.getNextMarketClose('STOCKS')
      }
    ];
  }

  /**
   * Initialize scanner performance metrics
   */
  private initializeScannerPerformance(): void {
    this.scannerPerformance = {
      scansPerSecond: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      activeConnections: 0,
      queueSize: 0
    };
  }

  /**
   * Start continuous 24/7 scanning
   */
  private startContinuousScanning(): void {
    this.isScanning = true;
    
    // Main scanning loop
    setInterval(() => {
      this.processActiveSessions();
      this.processScanQueue();
      this.updatePerformanceMetrics();
    }, 1000); // Check every second
    
    // Market session updates
    setInterval(() => {
      this.updateMarketSessions();
    }, 60000); // Update every minute
    
    // Performance monitoring
    setInterval(() => {
      this.monitorSystemHealth();
    }, 30000); // Monitor every 30 seconds
    
    console.log('24/7 Market scanning system started');
  }

  /**
   * Process active market sessions
   */
  private processActiveSessions(): void {
    if (!this.isScanning) return;
    
    const activeSessions = this.marketSessions.filter(session => session.isActive);
    
    for (const session of activeSessions) {
      this.scanMarketSession(session);
    }
  }

  /**
   * Scan a specific market session
   */
  private async scanMarketSession(session: MarketSession): Promise<void> {
    const userConfigs = Array.from(this.scanConfigurations.values())
      .filter(config => config.enabled && config.markets.includes(session.market));
    
    for (const config of userConfigs) {
      await this.executeScanConfiguration(config, session);
    }
  }

  /**
   * Execute scan configuration for a session
   */
  private async executeScanConfiguration(
    config: ScanConfiguration,
    session: MarketSession
  ): Promise<void> {
    if (this.activeScanCount >= this.maxConcurrentScans) {
      // Add to queue if at capacity
      for (const symbol of config.symbols) {
        for (const timeframe of config.timeframes) {
          if (timeframe.enabled) {
            this.scanQueue.push({
              userId: config.userId,
              symbol,
              timeframe: timeframe.name
            });
          }
        }
      }
      return;
    }
    
    // Check rate limiting
    if (!this.checkScanRateLimit(config)) {
      return;
    }
    
    for (const symbol of config.symbols) {
      for (const timeframe of config.timeframes) {
        if (timeframe.enabled) {
          this.activeScanCount++;
          this.performSymbolScan(config, symbol, timeframe, session)
            .finally(() => {
              this.activeScanCount--;
            });
        }
      }
    }
  }

  /**
   * Perform scan for a specific symbol and timeframe
   */
  private async performSymbolScan(
    config: ScanConfiguration,
    symbol: string,
    timeframe: Timeframe,
    session: MarketSession
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Get market data
      const marketData = await this.marketDataProvider.getHistoricalData(
        symbol,
        timeframe.name,
        100 // Get last 100 candles
      );
      
      if (!marketData || marketData.length === 0) {
        return;
      }
      
      // Perform technical analysis
      const analysisResult = await this.technicalAnalysis.analyze(marketData[0]);
      const indicators = {
        rsi: analysisResult.rsi,
        macd: analysisResult.macd,
        bollinger: analysisResult.bollinger,
        ema: analysisResult.ema,
        sma: analysisResult.sma,
        stochastic: analysisResult.stochastic,
        atr: analysisResult.atr,
        adx: analysisResult.adx,
        williams: analysisResult.williams,
        momentum: analysisResult.momentum,
        cci: analysisResult.cci
      };
      
      // Generate signal
      const signal = await this.signalGenerator.generateSignal(
        marketData[marketData.length - 1], // Latest candle
        { ...indicators, priceAction: analysisResult.priceAction }
      );
      
      if (!signal) {
        return;
      }
      
      // Apply filters
      if (!this.passesFilters(signal, config.signalFilters, indicators)) {
        return;
      }
      
      // Determine market condition
      const marketCondition = this.determineMarketCondition(indicators, marketData);
      
      // Create scan result
      const scanResult: ScanResult = {
        id: `scan_${config.userId}_${symbol}_${timeframe.name}_${Date.now()}`,
        userId: config.userId,
        symbol,
        market: session.market,
        timeframe: timeframe.name,
        signal,
        confidence: signal.confidence,
        technicalIndicators: indicators,
        marketCondition,
        scanTime: new Date(),
        priority: this.calculateSignalPriority(signal, timeframe, indicators),
        alerts: this.generateScanAlerts(signal, indicators, marketCondition)
      };
      
      // Store result
      this.storeScanResult(scanResult);
      
      // Send alerts if needed
      if (scanResult.priority >= 7 || config.autoTrade) {
        await this.sendScanAlert(scanResult);
      }
      
      // Update statistics
      this.updateScanStats(config.userId, scanResult);
      
    } catch (error) {
      console.error(`Error scanning ${symbol} on ${timeframe.name}:`, error);
      this.incrementErrorCount(config.userId);
    } finally {
      // Update performance metrics
      const responseTime = Date.now() - startTime;
      this.updateResponseTime(responseTime);
    }
  }

  /**
   * Check if signal passes configured filters
   */
  private passesFilters(
    signal: TradingSignal,
    filters: SignalFilters,
    indicators: TechnicalIndicators
  ): boolean {
    // Confidence filter
    if (signal.confidence < filters.minConfidence) {
      return false;
    }
    
    // Risk-reward filter
    const riskReward = signal.takeProfit && signal.stopLoss ? 
      Math.abs(signal.takeProfit - signal.entryPrice) / Math.abs(signal.entryPrice - signal.stopLoss) : 0;
    
    if (riskReward < filters.minRiskReward || riskReward > filters.maxRiskReward) {
      return false;
    }
    
    // Signal type filter
    if (!filters.allowedSignalTypes.includes(signal.signal)) {
      return false;
    }
    
    // Symbol filters
    if (filters.excludeSymbols.includes(signal.symbol)) {
      return false;
    }
    
    if (filters.includeOnlySymbols.length > 0 && !filters.includeOnlySymbols.includes(signal.symbol)) {
      return false;
    }
    
    // Volatility filter
    const atr = indicators.atr || 0;
    const volatility = (atr / signal.entryPrice) * 100;
    
    if (volatility < filters.volatilityRange.min || volatility > filters.volatilityRange.max) {
      return false;
    }
    
    return true;
  }

  /**
   * Determine market condition based on indicators
   */
  private determineMarketCondition(
    indicators: TechnicalIndicators,
    marketData: MarketData[]
  ): string {
    const { adx, rsi, bollinger, atr } = indicators;
    const recentData = marketData.slice(-20); // Last 20 candles
    
    // Calculate price movement using ohlcv data
    const highs = recentData.flatMap(d => d.ohlcv.map(candle => candle.high));
    const lows = recentData.flatMap(d => d.ohlcv.map(candle => candle.low));
    const closes = recentData.flatMap(d => d.ohlcv.map(candle => candle.close));
    
    const priceRange = Math.max(...highs) - Math.min(...lows);
    const avgPrice = closes.reduce((sum, close) => sum + close, 0) / closes.length;
    const volatilityPercent = (priceRange / avgPrice) * 100;
    
    // Determine condition
    if (adx && adx > 25) {
      return 'TRENDING';
    } else if (volatilityPercent > 3) {
      return 'VOLATILE';
    } else if (bollinger && bollinger.upper && bollinger.lower) {
      const bbWidth = ((bollinger.upper - bollinger.lower) / bollinger.middle) * 100;
      if (bbWidth < 2) {
        return 'QUIET';
      }
    }
    
    // Check for breakout
    const latestCandles = recentData[recentData.length - 1].ohlcv;
    const latestPrice = latestCandles[latestCandles.length - 1].close;
    const recentHighs = recentData.slice(-10).flatMap(d => d.ohlcv.map(candle => candle.high));
    const recentLows = recentData.slice(-10).flatMap(d => d.ohlcv.map(candle => candle.low));
    const resistance = Math.max(...recentHighs);
    const support = Math.min(...recentLows);
    
    if (latestPrice > resistance * 1.001 || latestPrice < support * 0.999) {
      return 'BREAKOUT';
    }
    
    return 'RANGING';
  }

  /**
   * Calculate signal priority (1-10 scale)
   */
  private calculateSignalPriority(
    signal: TradingSignal,
    timeframe: Timeframe,
    indicators: TechnicalIndicators
  ): number {
    let priority = 5; // Base priority
    
    // Confidence boost
    priority += (signal.confidence - 50) / 10;
    
    // Timeframe weight
    priority += timeframe.weight * 2;
    
    // Strong signals get higher priority
    if (signal.signal === 'BUY' || signal.signal === 'SELL') {
      priority += 2;
    }
    
    // RSI extreme conditions
    if (indicators.rsi) {
      if (indicators.rsi > 80 || indicators.rsi < 20) {
        priority += 1;
      }
    }
    
    // MACD confirmation
    if (indicators.macd && indicators.macd.histogram) {
      if (Math.abs(indicators.macd.histogram) > 0.5) {
        priority += 0.5;
      }
    }
    
    return Math.min(Math.max(priority, 1), 10);
  }

  /**
   * Generate scan alerts based on conditions
   */
  private generateScanAlerts(
    signal: TradingSignal,
    indicators: TechnicalIndicators,
    marketCondition: string
  ): ScanAlert[] {
    const alerts: ScanAlert[] = [];
    
    // High confidence signal alert
    if (signal.confidence > 85) {
      alerts.push({
        type: 'NEW_SIGNAL',
        message: `High confidence ${signal.signal} signal detected (${signal.confidence}%)`,
        severity: 'HIGH',
        timestamp: new Date()
      });
    }
    
    // Trend change alert
    if (indicators.macd && indicators.macd.signal && indicators.macd.macd) {
      if (Math.abs(indicators.macd.macd - indicators.macd.signal) > 0.1) {
        alerts.push({
          type: 'TREND_CHANGE',
          message: 'MACD crossover detected - potential trend change',
          severity: 'MEDIUM',
          timestamp: new Date()
        });
      }
    }
    
    // Breakout alert
    if (marketCondition === 'BREAKOUT') {
      alerts.push({
        type: 'BREAKOUT',
        message: 'Price breakout detected',
        severity: 'HIGH',
        timestamp: new Date()
      });
    }
    
    // Volume spike alert removed - TradingSignal doesn't have volume property
    // Volume analysis would need to be implemented using MarketData if needed
    
    return alerts;
  }

  /**
   * Store scan result
   */
  private storeScanResult(result: ScanResult): void {
    const userResults = this.scanResults.get(result.userId) || [];
    userResults.push(result);
    
    // Keep only last 1000 results per user
    if (userResults.length > 1000) {
      userResults.splice(0, userResults.length - 1000);
    }
    
    this.scanResults.set(result.userId, userResults);
  }

  /**
   * Send scan alert to user
   */
  private async sendScanAlert(result: ScanResult): Promise<void> {
    const signal = result.signal;
    const message = `${signal.signal} signal for ${signal.symbol} (${result.timeframe}) - Confidence: ${signal.confidence}%`;
    
    await this.alertsSystem.sendSignalAlert(
      result.userId,
      signal,
      {
        accuracy: 0, // Would come from historical data
        totalSignals: 0,
        winningSignals: 0,
        losingSignals: 0,
        averageRiskReward: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      }
    );
  }

  /**
   * Update scan statistics
   */
  private updateScanStats(userId: string, result: ScanResult): void {
    const stats = this.scanStats.get(userId) || {
      totalScans: 0,
      signalsGenerated: 0,
      successfulSignals: 0,
      averageConfidence: 0,
      scansByMarket: {},
      scansByTimeframe: {},
      lastScanTime: new Date(),
      uptime: 100,
      errorsCount: 0
    };
    
    stats.totalScans++;
    stats.signalsGenerated++;
    stats.averageConfidence = (stats.averageConfidence * (stats.signalsGenerated - 1) + result.confidence) / stats.signalsGenerated;
    stats.scansByMarket[result.market] = (stats.scansByMarket[result.market] || 0) + 1;
    stats.scansByTimeframe[result.timeframe] = (stats.scansByTimeframe[result.timeframe] || 0) + 1;
    stats.lastScanTime = new Date();
    
    this.scanStats.set(userId, stats);
  }

  /**
   * Process scan queue
   */
  private processScanQueue(): void {
    if (this.scanQueue.length === 0 || this.activeScanCount >= this.maxConcurrentScans) {
      return;
    }
    
    const batchSize = Math.min(this.maxConcurrentScans - this.activeScanCount, this.scanQueue.length);
    const batch = this.scanQueue.splice(0, batchSize);
    
    for (const item of batch) {
      const config = this.scanConfigurations.get(item.userId);
      if (config) {
        const timeframe = config.timeframes.find(tf => tf.name === item.timeframe);
        const session = this.marketSessions.find(s => config.markets.includes(s.market) && s.isActive);
        
        if (timeframe && session) {
          this.performSymbolScan(config, item.symbol, timeframe, session);
        }
      }
    }
  }

  /**
   * Check scan rate limit
   */
  private checkScanRateLimit(config: ScanConfiguration): boolean {
    const stats = this.scanStats.get(config.userId);
    if (!stats) return true;
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentScans = this.scanResults.get(config.userId)?.filter(
      result => result.scanTime > oneHourAgo
    ).length || 0;
    
    return recentScans < config.maxSignalsPerHour;
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(): void {
    this.scannerPerformance.queueSize = this.scanQueue.length;
    this.scannerPerformance.activeConnections = this.activeScanCount;
    
    // Update scans per second (simplified)
    const totalScans = Array.from(this.scanStats.values())
      .reduce((sum, stats) => sum + stats.totalScans, 0);
    this.scannerPerformance.scansPerSecond = totalScans / (Date.now() / 1000);
  }

  /**
   * Update response time
   */
  private updateResponseTime(responseTime: number): void {
    this.scannerPerformance.averageResponseTime = 
      (this.scannerPerformance.averageResponseTime * 0.9) + (responseTime * 0.1);
  }

  /**
   * Increment error count
   */
  private incrementErrorCount(userId: string): void {
    const stats = this.scanStats.get(userId);
    if (stats) {
      stats.errorsCount++;
      this.scanStats.set(userId, stats);
    }
  }

  /**
   * Update market sessions
   */
  private updateMarketSessions(): void {
    for (const session of this.marketSessions) {
      session.isActive = this.isMarketHours(session.market);
      session.nextOpen = this.getNextMarketOpen(session.market);
      session.nextClose = this.getNextMarketClose(session.market);
    }
  }

  /**
   * Check if market is in trading hours
   */
  private isMarketHours(market: MarketTypeKey): boolean {
    // Simplified market hours check
    switch (market) {
      case 'FOREX':
      case 'CRYPTO':
        return true; // 24/7 markets
      case 'STOCKS':
        const now = new Date();
        const hour = now.getUTCHours();
        // Simplified: assume some stock market is always open
        return hour >= 6 && hour <= 22; // Covers major sessions
      default:
        return false;
    }
  }

  /**
   * Get next market open time
   */
  private getNextMarketOpen(market: MarketTypeKey): Date {
    const now = new Date();
    // Simplified implementation
    return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next day
  }

  /**
   * Get next market close time
   */
  private getNextMarketClose(market: MarketTypeKey): Date {
    const now = new Date();
    // Simplified implementation
    return new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours from now
  }

  /**
   * Monitor system health
   */
  private monitorSystemHealth(): void {
    // Update memory and CPU usage (simplified)
    this.scannerPerformance.memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    this.scannerPerformance.cpuUsage = process.cpuUsage().user / 1000000; // Convert to seconds
    
    // Check for performance issues
    if (this.scannerPerformance.averageResponseTime > 5000) { // 5 seconds
      console.warn('High response times detected in market scanner');
    }
    
    if (this.scanQueue.length > 1000) {
      console.warn('Large scan queue detected - consider scaling');
    }
  }

  /**
   * Configure scanning for a user
   */
  configureScan(config: ScanConfiguration): void {
    this.scanConfigurations.set(config.userId, config);
    
    // Initialize stats if not exists
    if (!this.scanStats.has(config.userId)) {
      this.scanStats.set(config.userId, {
        totalScans: 0,
        signalsGenerated: 0,
        successfulSignals: 0,
        averageConfidence: 0,
        scansByMarket: {},
        scansByTimeframe: {},
        lastScanTime: new Date(),
        uptime: 100,
        errorsCount: 0
      });
    }
    
    console.log(`Scan configuration updated for user ${config.userId}`);
  }

  /**
   * Add symbol to watchlist
   */
  addToWatchlist(userId: string, symbol: string, market: MarketTypeKey, priority: number = 5): void {
    const watchlist = this.watchlists.get(userId) || [];
    
    // Check if already exists
    const existingIndex = watchlist.findIndex(item => item.symbol === symbol);
    if (existingIndex >= 0) {
      watchlist[existingIndex].priority = priority;
      watchlist[existingIndex].lastUpdated = new Date();
    } else {
      watchlist.push({
        symbol,
        market,
        priority,
        lastPrice: 0,
        priceChange: 0,
        volume: 0,
        alerts: [],
        addedAt: new Date(),
        lastUpdated: new Date()
      });
    }
    
    this.watchlists.set(userId, watchlist);
    console.log(`${symbol} added to watchlist for user ${userId}`);
  }

  /**
   * Remove symbol from watchlist
   */
  removeFromWatchlist(userId: string, symbol: string): void {
    const watchlist = this.watchlists.get(userId) || [];
    const filteredWatchlist = watchlist.filter(item => item.symbol !== symbol);
    this.watchlists.set(userId, filteredWatchlist);
    console.log(`${symbol} removed from watchlist for user ${userId}`);
  }

  /**
   * Get scan results for a user
   */
  getScanResults(userId: string, limit: number = 50): ScanResult[] {
    const results = this.scanResults.get(userId) || [];
    return results
      .sort((a, b) => b.scanTime.getTime() - a.scanTime.getTime())
      .slice(0, limit);
  }

  /**
   * Get scan statistics for a user
   */
  getScanStats(userId: string): MarketScanStats | null {
    return this.scanStats.get(userId) || null;
  }

  /**
   * Get scanner performance metrics
   */
  getPerformanceMetrics(): ScannerPerformance {
    return { ...this.scannerPerformance };
  }

  /**
   * Get user's watchlist
   */
  getWatchlist(userId: string): WatchlistItem[] {
    return this.watchlists.get(userId) || [];
  }

  /**
   * Get active market sessions
   */
  getActiveMarketSessions(): MarketSession[] {
    return this.marketSessions.filter(session => session.isActive);
  }

  /**
   * Get system-wide statistics
   */
  getSystemStats(): {
    totalUsers: number;
    totalScans: number;
    totalSignals: number;
    averageConfidence: number;
    systemUptime: number;
    activeScans: number;
    queueSize: number;
  } {
    const allStats = Array.from(this.scanStats.values());
    const totalUsers = allStats.length;
    const totalScans = allStats.reduce((sum, stats) => sum + stats.totalScans, 0);
    const totalSignals = allStats.reduce((sum, stats) => sum + stats.signalsGenerated, 0);
    const averageConfidence = totalSignals > 0 ? 
      allStats.reduce((sum, stats) => sum + stats.averageConfidence * stats.signalsGenerated, 0) / totalSignals : 0;
    
    return {
      totalUsers,
      totalScans,
      totalSignals,
      averageConfidence,
      systemUptime: 99.9, // Simplified
      activeScans: this.activeScanCount,
      queueSize: this.scanQueue.length
    };
  }

  /**
   * Enable/disable scanning for a user
   */
  toggleScanning(userId: string, enabled: boolean): void {
    const config = this.scanConfigurations.get(userId);
    if (config) {
      config.enabled = enabled;
      this.scanConfigurations.set(userId, config);
      console.log(`Scanning ${enabled ? 'enabled' : 'disabled'} for user ${userId}`);
    }
  }

  /**
   * Stop the scanning system
   */
  stop(): void {
    this.isScanning = false;
    
    // Clear all intervals
    Array.from(this.scanningIntervals.values()).forEach(interval => {
      clearInterval(interval);
    });
    this.scanningIntervals.clear();
    
    console.log('Market scanning system stopped');
  }
}

export default MarketScanningSystem;