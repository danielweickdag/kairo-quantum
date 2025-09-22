import { EventEmitter } from 'events';
import { MarketData, TradingSignal, MarketType, MarketScanConfig } from './types';
import { SignalGenerator } from './signalGenerator';
import { TechnicalAnalysis } from './technicalAnalysis';

export interface ScanResult {
  symbol: string;
  market: keyof MarketType;
  timeframe: string;
  score: number;
  signals: TradingSignal[];
  marketData: MarketData;
  scanTime: Date;
  opportunities: {
    type: 'BREAKOUT' | 'REVERSAL' | 'TREND_CONTINUATION' | 'MOMENTUM' | 'MEAN_REVERSION';
    confidence: number;
    description: string;
    timeframe: string;
  }[];
}

export interface MarketScannerMetrics {
  totalScans: number;
  signalsGenerated: number;
  marketsScanned: number;
  averageScanTime: number;
  lastScanTime: Date;
  uptime: number;
  errorRate: number;
  topPerformingMarkets: string[];
  scanFrequency: number;
}

export interface WatchlistItem {
  symbol: string;
  market: keyof MarketType;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  customTimeframes?: string[];
  alertThresholds?: {
    minConfidence: number;
    maxDrawdown: number;
    minVolume: number;
  };
  lastSignal?: Date;
  signalCount: number;
}

export class MarketScanner extends EventEmitter {
  private config: MarketScanConfig;
  private signalGenerator: SignalGenerator;
  private technicalAnalysis: TechnicalAnalysis;
  private isScanning: boolean = false;
  private scanInterval: NodeJS.Timeout | null = null;
  private metrics: MarketScannerMetrics;
  private watchlist: Map<string, WatchlistItem> = new Map();
  private marketDataCache: Map<string, MarketData> = new Map();
  private scanHistory: ScanResult[] = [];
  private errorCount: number = 0;
  private startTime: Date = new Date();
  private lastScanDuration: number = 0;

  // Market endpoints and data sources
  private marketEndpoints = {
    crypto: {
      binance: 'https://api.binance.com/api/v3',
      coinbase: 'https://api.exchange.coinbase.com',
      kraken: 'https://api.kraken.com/0/public'
    },
    stocks: {
      alpaca: 'https://paper-api.alpaca.markets/v2',
      polygon: 'https://api.polygon.io/v2',
      iex: 'https://cloud.iexapis.com/stable'
    },
    forex: {
      oanda: 'https://api-fxpractice.oanda.com/v3',
      fxcm: 'https://api-demo.fxcm.com',
      dukascopy: 'https://www.dukascopy.com/swiss/english/marketwatch/historical/'
    }
  };

  constructor(
    config: MarketScanConfig,
    signalGenerator: SignalGenerator,
    technicalAnalysis: TechnicalAnalysis
  ) {
    super();
    this.config = config;
    this.signalGenerator = signalGenerator;
    this.technicalAnalysis = technicalAnalysis;
    this.metrics = this.initializeMetrics();
    
    // Initialize default watchlist
    this.initializeDefaultWatchlist();
    
    console.log('Market Scanner initialized with config:', {
      markets: config.markets,
      timeframes: config.timeframes,
      scanInterval: config.scanInterval,
      enabled: config.enabled
    });
  }

  private initializeMetrics(): MarketScannerMetrics {
    return {
      totalScans: 0,
      signalsGenerated: 0,
      marketsScanned: 0,
      averageScanTime: 0,
      lastScanTime: new Date(),
      uptime: 0,
      errorRate: 0,
      topPerformingMarkets: [],
      scanFrequency: this.config.scanInterval
    };
  }

  private initializeDefaultWatchlist(): void {
    // Crypto watchlist
    const cryptoSymbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'BNBUSDT', 'SOLUSDT', 'AVAXUSDT'];
    cryptoSymbols.forEach(symbol => {
      this.watchlist.set(`${symbol}_crypto`, {
        symbol,
        market: 'CRYPTO',
        priority: 'HIGH',
        signalCount: 0,
        alertThresholds: {
          minConfidence: 0.7,
          maxDrawdown: 0.05,
          minVolume: 1000000
        }
      });
    });

    // Stock watchlist
    const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];
    stockSymbols.forEach(symbol => {
      this.watchlist.set(`${symbol}_stocks`, {
        symbol,
        market: 'STOCKS',
        priority: 'MEDIUM',
        signalCount: 0,
        alertThresholds: {
          minConfidence: 0.75,
          maxDrawdown: 0.03,
          minVolume: 500000
        }
      });
    });

    // Forex watchlist
    const forexSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF'];
    forexSymbols.forEach(symbol => {
      this.watchlist.set(`${symbol}_forex`, {
        symbol,
        market: 'FOREX',
        priority: 'MEDIUM',
        signalCount: 0,
        alertThresholds: {
          minConfidence: 0.8,
          maxDrawdown: 0.02,
          minVolume: 100000
        }
      });
    });

    console.log(`Initialized watchlist with ${this.watchlist.size} instruments`);
  }

  /**
   * Start continuous market scanning
   */
  startScanning(): void {
    if (this.isScanning) {
      console.log('Market scanner is already running');
      return;
    }

    if (!this.config.enabled) {
      console.log('Market scanner is disabled in configuration');
      return;
    }

    this.isScanning = true;
    this.startTime = new Date();
    
    console.log(`🔍 Starting 24/7 market scanning every ${this.config.scanInterval} seconds`);
    
    // Initial scan
    this.performScan().catch(error => {
      console.error('Error in initial scan:', error);
    });

    // Set up recurring scans
    this.scanInterval = setInterval(() => {
      this.performScan().catch(error => {
        console.error('Error in scheduled scan:', error);
        this.errorCount++;
      });
    }, this.config.scanInterval * 1000);

    this.emit('scanningStarted', {
      timestamp: new Date(),
      config: this.config,
      watchlistSize: this.watchlist.size
    });
  }

  /**
   * Stop market scanning
   */
  stopScanning(): void {
    if (!this.isScanning) {
      console.log('Market scanner is not running');
      return;
    }

    this.isScanning = false;
    
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }

    console.log('🛑 Market scanning stopped');
    
    this.emit('scanningStopped', {
      timestamp: new Date(),
      totalScans: this.metrics.totalScans,
      signalsGenerated: this.metrics.signalsGenerated,
      uptime: Date.now() - this.startTime.getTime()
    });
  }

  /**
   * Perform a single market scan across all configured markets and timeframes
   */
  private async performScan(): Promise<void> {
    const scanStartTime = Date.now();
    const scanResults: ScanResult[] = [];
    let signalsGenerated = 0;

    try {
      console.log(`🔍 Starting market scan #${this.metrics.totalScans + 1}`);

      // Scan each market in parallel for efficiency
      const marketPromises = this.config.markets.map(market => 
        this.scanMarket(market)
      );

      const marketResults = await Promise.allSettled(marketPromises);
      
      marketResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          scanResults.push(...result.value);
          signalsGenerated += result.value.reduce((sum, scan) => sum + scan.signals.length, 0);
        } else {
          console.error(`Error scanning market ${this.config.markets[index]}:`, result.reason);
          this.errorCount++;
        }
      });

      // Process and filter results
      const filteredResults = this.filterAndRankResults(scanResults);
      
      // Update metrics
      this.lastScanDuration = Date.now() - scanStartTime;
      this.updateMetrics(filteredResults.length, signalsGenerated);
      
      // Store scan history (keep last 100 scans)
      this.scanHistory.push(...filteredResults);
      if (this.scanHistory.length > 100) {
        this.scanHistory = this.scanHistory.slice(-100);
      }

      // Emit signals for high-quality opportunities
      filteredResults.forEach(result => {
        result.signals.forEach(signal => {
          if (signal.confidence >= 0.7) {
            this.emit('signalGenerated', signal);
          }
        });
        
        if (result.opportunities.length > 0) {
          this.emit('opportunityDetected', result);
        }
      });

      console.log(`✅ Scan completed: ${filteredResults.length} results, ${signalsGenerated} signals (${this.lastScanDuration}ms)`);
      
    } catch (error) {
      console.error('Error in market scan:', error);
      this.errorCount++;
    }
  }

  /**
   * Scan a specific market for trading opportunities
   */
  private async scanMarket(market: keyof MarketType): Promise<ScanResult[]> {
    const results: ScanResult[] = [];
    
    // Get symbols for this market from watchlist
    const marketSymbols = Array.from(this.watchlist.values())
      .filter(item => item.market === market)
      .sort((a, b) => {
        // Prioritize HIGH priority symbols
        if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
        if (b.priority === 'HIGH' && a.priority !== 'HIGH') return 1;
        return 0;
      });

    // Scan each symbol across all timeframes
    for (const watchlistItem of marketSymbols) {
      try {
        const symbolResults = await this.scanSymbol(watchlistItem);
        results.push(...symbolResults);
      } catch (error) {
        console.error(`Error scanning ${watchlistItem.symbol}:`, error);
      }
    }

    return results;
  }

  /**
   * Scan a specific symbol across all timeframes
   */
  private async scanSymbol(watchlistItem: WatchlistItem): Promise<ScanResult[]> {
    const results: ScanResult[] = [];
    const timeframes = watchlistItem.customTimeframes || this.config.timeframes;

    for (const timeframe of timeframes) {
      try {
        // Get market data for this symbol and timeframe
        const marketData = await this.getMarketData(watchlistItem.symbol, watchlistItem.market, timeframe);
        
        if (!marketData || !this.passesBasicFilters(marketData, watchlistItem)) {
          continue;
        }

        // Generate technical analysis
        const technicalData = await this.technicalAnalysis.analyze(marketData);
        
        // Generate trading signals
        const signal = await this.signalGenerator.generateSignal(marketData, technicalData);
        const signals = signal ? [signal] : [];
        
        // Detect opportunities
        const opportunities = this.detectOpportunities(marketData, technicalData, timeframe);
        
        // Calculate overall score
        const score = this.calculateOpportunityScore(marketData, technicalData, signals, opportunities);

        if (score > 0.5 || signals.length > 0 || opportunities.length > 0) {
          results.push({
            symbol: watchlistItem.symbol,
            market: watchlistItem.market,
            timeframe,
            score,
            signals,
            marketData,
            scanTime: new Date(),
            opportunities
          });

          // Update watchlist item
          if (signals.length > 0) {
            watchlistItem.signalCount += signals.length;
            watchlistItem.lastSignal = new Date();
          }
        }
        
      } catch (error) {
        console.error(`Error scanning ${watchlistItem.symbol} on ${timeframe}:`, error);
      }
    }

    return results;
  }

  /**
   * Get market data for a symbol (mock implementation - replace with real data sources)
   */
  private async getMarketData(
    symbol: string, 
    market: keyof MarketType, 
    timeframe: string
  ): Promise<MarketData | null> {
    try {
      // Check cache first
      const cacheKey = `${symbol}_${market}_${timeframe}`;
      const cached = this.marketDataCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp.getTime() < 60000) { // 1 minute cache
        return cached;
      }

      // Mock market data generation (replace with real API calls)
      const basePrice = 100 + Math.random() * 900;
      const volatility = 0.02 + Math.random() * 0.08;
      const volume = 1000000 + Math.random() * 5000000;
      
      const ohlcv = [];
      let currentPrice = basePrice;
      
      // Generate 100 periods of OHLCV data
      for (let i = 0; i < 100; i++) {
        const open = currentPrice;
        const change = (Math.random() - 0.5) * volatility * open;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * volatility * open * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * open * 0.5;
        const periodVolume = volume * (0.5 + Math.random());
        
        ohlcv.push({
          open,
          high,
          low,
          close,
          volume: periodVolume
        });
        
        currentPrice = close;
      }

      const marketData: MarketData = {
        symbol,
        market,
        price: currentPrice,
        volume,
        high24h: Math.max(...ohlcv.slice(-24).map(o => o.high)),
        low24h: Math.min(...ohlcv.slice(-24).map(o => o.low)),
        change24h: ((currentPrice - ohlcv[ohlcv.length - 24].close) / ohlcv[ohlcv.length - 24].close) * 100,
        timestamp: new Date(),
        ohlcv
      };

      // Cache the data
      this.marketDataCache.set(cacheKey, marketData);
      
      return marketData;
      
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Check if market data passes basic filters
   */
  private passesBasicFilters(marketData: MarketData, watchlistItem: WatchlistItem): boolean {
    // Volume filter
    if (marketData.volume < this.config.minVolume) {
      return false;
    }

    // Price range filter
    if (marketData.price < this.config.minPrice || marketData.price > this.config.maxPrice) {
      return false;
    }

    // Volatility filter
    const volatility = Math.abs(marketData.change24h) / 100;
    if (volatility < this.config.volatilityThreshold) {
      return false;
    }

    // Custom alert thresholds
    if (watchlistItem.alertThresholds) {
      if (marketData.volume < watchlistItem.alertThresholds.minVolume) {
        return false;
      }
    }

    return true;
  }

  /**
   * Detect trading opportunities based on technical analysis
   */
  private detectOpportunities(
    marketData: MarketData, 
    technicalData: any, 
    timeframe: string
  ): ScanResult['opportunities'] {
    const opportunities: ScanResult['opportunities'] = [];

    // Breakout detection
    if (this.detectBreakout(marketData, technicalData)) {
      opportunities.push({
        type: 'BREAKOUT',
        confidence: 0.8,
        description: `Price breaking above resistance with volume confirmation`,
        timeframe
      });
    }

    // Reversal detection
    if (this.detectReversal(marketData, technicalData)) {
      opportunities.push({
        type: 'REVERSAL',
        confidence: 0.75,
        description: `Potential reversal at key support/resistance level`,
        timeframe
      });
    }

    // Trend continuation
    if (this.detectTrendContinuation(marketData, technicalData)) {
      opportunities.push({
        type: 'TREND_CONTINUATION',
        confidence: 0.7,
        description: `Strong trend continuation pattern detected`,
        timeframe
      });
    }

    // Momentum opportunities
    if (this.detectMomentum(marketData, technicalData)) {
      opportunities.push({
        type: 'MOMENTUM',
        confidence: 0.85,
        description: `Strong momentum with volume acceleration`,
        timeframe
      });
    }

    // Mean reversion
    if (this.detectMeanReversion(marketData, technicalData)) {
      opportunities.push({
        type: 'MEAN_REVERSION',
        confidence: 0.65,
        description: `Oversold/overbought condition for mean reversion`,
        timeframe
      });
    }

    return opportunities;
  }

  // Opportunity detection methods
  private detectBreakout(marketData: MarketData, technicalData: any): boolean {
    const recentHigh = Math.max(...marketData.ohlcv.slice(-20).map(o => o.high));
    const currentPrice = marketData.price;
    const volumeIncrease = marketData.volume > (marketData.ohlcv.slice(-10).reduce((sum, o) => sum + o.volume, 0) / 10) * 1.5;
    
    return currentPrice > recentHigh * 1.02 && volumeIncrease;
  }

  private detectReversal(marketData: MarketData, technicalData: any): boolean {
    const rsi = technicalData?.rsi || 50;
    const recentLow = Math.min(...marketData.ohlcv.slice(-20).map(o => o.low));
    const recentHigh = Math.max(...marketData.ohlcv.slice(-20).map(o => o.high));
    
    return (rsi < 30 && marketData.price <= recentLow * 1.02) || 
           (rsi > 70 && marketData.price >= recentHigh * 0.98);
  }

  private detectTrendContinuation(marketData: MarketData, technicalData: any): boolean {
    const ema20 = technicalData?.ema?.ema20 || marketData.price;
    const ema50 = technicalData?.ema?.ema50 || marketData.price;
    
    return Math.abs(ema20 - ema50) / ema50 > 0.02 && marketData.price > Math.max(ema20, ema50);
  }

  private detectMomentum(marketData: MarketData, technicalData: any): boolean {
    const macd = technicalData?.macd;
    const volumeIncrease = marketData.volume > (marketData.ohlcv.slice(-5).reduce((sum, o) => sum + o.volume, 0) / 5) * 2;
    
    return macd && macd.macd > macd.signal && macd.histogram > 0 && volumeIncrease;
  }

  private detectMeanReversion(marketData: MarketData, technicalData: any): boolean {
    const rsi = technicalData?.rsi || 50;
    const bollinger = technicalData?.bollinger;
    
    if (!bollinger) return false;
    
    return (rsi < 25 && marketData.price < bollinger.lower) || 
           (rsi > 75 && marketData.price > bollinger.upper);
  }

  /**
   * Calculate overall opportunity score
   */
  private calculateOpportunityScore(
    marketData: MarketData,
    technicalData: any,
    signals: TradingSignal[],
    opportunities: ScanResult['opportunities']
  ): number {
    let score = 0;

    // Signal quality score
    const avgSignalConfidence = signals.length > 0 
      ? signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length 
      : 0;
    score += avgSignalConfidence * 0.4;

    // Opportunity score
    const avgOpportunityConfidence = opportunities.length > 0
      ? opportunities.reduce((sum, o) => sum + o.confidence, 0) / opportunities.length
      : 0;
    score += avgOpportunityConfidence * 0.3;

    // Volume score
    const volumeScore = Math.min(marketData.volume / this.config.minVolume, 5) / 5;
    score += volumeScore * 0.15;

    // Volatility score
    const volatilityScore = Math.min(Math.abs(marketData.change24h) / 10, 1);
    score += volatilityScore * 0.15;

    return Math.min(score, 1);
  }

  /**
   * Filter and rank scan results
   */
  private filterAndRankResults(results: ScanResult[]): ScanResult[] {
    return results
      .filter(result => {
        // Filter by minimum score
        if (result.score < 0.3) return false;
        
        // Filter by signal confidence
        const hasHighConfidenceSignal = result.signals.some(s => s.confidence >= 0.6);
        if (!hasHighConfidenceSignal && result.opportunities.length === 0) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Sort by score descending
        if (b.score !== a.score) return b.score - a.score;
        
        // Then by number of high-confidence signals
        const aHighConfSignals = a.signals.filter(s => s.confidence >= 0.7).length;
        const bHighConfSignals = b.signals.filter(s => s.confidence >= 0.7).length;
        return bHighConfSignals - aHighConfSignals;
      })
      .slice(0, 50); // Keep top 50 results
  }

  /**
   * Update scanner metrics
   */
  private updateMetrics(resultsCount: number, signalsGenerated: number): void {
    this.metrics.totalScans++;
    this.metrics.signalsGenerated += signalsGenerated;
    this.metrics.marketsScanned = this.config.markets.length;
    this.metrics.lastScanTime = new Date();
    this.metrics.uptime = Date.now() - this.startTime.getTime();
    this.metrics.errorRate = this.errorCount / this.metrics.totalScans;
    
    // Update average scan time
    this.metrics.averageScanTime = (
      (this.metrics.averageScanTime * (this.metrics.totalScans - 1)) + this.lastScanDuration
    ) / this.metrics.totalScans;

    // Update top performing markets
    this.updateTopPerformingMarkets();

    this.emit('metricsUpdated', this.metrics);
  }

  /**
   * Update top performing markets based on signal generation
   */
  private updateTopPerformingMarkets(): void {
    const marketSignalCounts = new Map<string, number>();
    
    this.scanHistory.slice(-50).forEach(result => {
      const count = marketSignalCounts.get(result.market) || 0;
      marketSignalCounts.set(result.market, count + result.signals.length);
    });

    this.metrics.topPerformingMarkets = Array.from(marketSignalCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([market]) => market);
  }

  // Public API methods

  /**
   * Add symbol to watchlist
   */
  addToWatchlist(item: Omit<WatchlistItem, 'signalCount'>): void {
    const key = `${item.symbol}_${item.market}`;
    this.watchlist.set(key, { ...item, signalCount: 0 });
    console.log(`Added ${item.symbol} (${item.market}) to watchlist`);
  }

  /**
   * Remove symbol from watchlist
   */
  removeFromWatchlist(symbol: string, market: keyof MarketType): void {
    const key = `${symbol}_${market}`;
    this.watchlist.delete(key);
    console.log(`Removed ${symbol} (${market}) from watchlist`);
  }

  /**
   * Update scanner configuration
   */
  updateConfiguration(newConfig: Partial<MarketScanConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart scanning if interval changed
    if (newConfig.scanInterval && this.isScanning) {
      this.stopScanning();
      setTimeout(() => this.startScanning(), 1000);
    }
    
    console.log('Scanner configuration updated:', newConfig);
    this.emit('configurationUpdated', this.config);
  }

  /**
   * Get current scanner status
   */
  getStatus() {
    return {
      isScanning: this.isScanning,
      metrics: this.metrics,
      watchlistSize: this.watchlist.size,
      config: this.config,
      lastScanDuration: this.lastScanDuration,
      cacheSize: this.marketDataCache.size
    };
  }

  /**
   * Get watchlist
   */
  getWatchlist(): WatchlistItem[] {
    return Array.from(this.watchlist.values());
  }

  /**
   * Get recent scan results
   */
  getRecentResults(limit: number = 20): ScanResult[] {
    return this.scanHistory.slice(-limit);
  }

  /**
   * Get scanner metrics
   */
  getMetrics(): MarketScannerMetrics {
    return { ...this.metrics };
  }

  /**
   * Force a manual scan
   */
  async forceScan(): Promise<ScanResult[]> {
    console.log('🔍 Manual scan triggered');
    await this.performScan();
    return this.getRecentResults(10);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.marketDataCache.clear();
    console.log('Market data cache cleared');
  }

  /**
   * Export scanner data
   */
  exportData() {
    return {
      configuration: this.config,
      metrics: this.metrics,
      watchlist: Array.from(this.watchlist.values()),
      recentResults: this.getRecentResults(50),
      status: this.getStatus(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopScanning();
    this.clearCache();
    this.removeAllListeners();
    console.log('Market scanner destroyed');
  }
}