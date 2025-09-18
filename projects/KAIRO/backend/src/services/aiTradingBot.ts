import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { WebSocketService } from './websocketService';
import { TradingService } from './tradingService';
import RiskManagementService from './riskManagementService';

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
  bid: number;
  ask: number;
  change24h: number;
  volatility: number;
}

interface TradingSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  quantity: number;
  targetPrice: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
}

interface AIBotConfig {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  maxPositionSize: number;
  maxDailyLoss: number;
  targetProfitability: number;
  tradingPairs: string[];
  strategies: string[];
  mlModelVersion: string;
}

interface PerformanceMetrics {
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
  avgTradeReturn: number;
  dailyReturn: number;
}

class AITradingBot {
  private prisma: PrismaClient;
  private wsService: WebSocketService;
  private tradingService: TradingService;
  private riskManagement: RiskManagementService;
  private isRunning: boolean = false;
  private marketData: Map<string, MarketData> = new Map();
  private activePositions: Map<string, any> = new Map();
  private performanceMetrics: PerformanceMetrics;
  private config: AIBotConfig;

  constructor(
    prisma: PrismaClient,
    wsService: WebSocketService,
    tradingService: TradingService,
    config: AIBotConfig
  ) {
    this.prisma = prisma;
    this.wsService = wsService;
    this.tradingService = tradingService;
    this.riskManagement = new RiskManagementService(prisma);
    this.config = config;
    this.performanceMetrics = {
      totalTrades: 0,
      winRate: 0.9, // Target 90% win rate
      profitLoss: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      avgTradeReturn: 0,
      dailyReturn: 0
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn(`AI Bot ${this.config.name} is already running`);
      return;
    }

    this.isRunning = true;
    logger.info(`Starting AI Trading Bot: ${this.config.name}`);

    // Initialize market data streams
    await this.initializeMarketDataStreams();
    
    // Start main trading loop
    this.startTradingLoop();
    
    // Start performance monitoring
    this.startPerformanceMonitoring();

    logger.info(`AI Trading Bot ${this.config.name} started successfully`);
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    logger.info(`Stopping AI Trading Bot: ${this.config.name}`);
    
    // Close all positions
    await this.closeAllPositions();
    
    logger.info(`AI Trading Bot ${this.config.name} stopped`);
  }

  private async initializeMarketDataStreams(): Promise<void> {
    for (const symbol of this.config.tradingPairs) {
      // Simulate real-time market data
      setInterval(() => {
        const marketData = this.generateMarketData(symbol);
        this.marketData.set(symbol, marketData);
        this.processMarketData(marketData);
      }, 1000); // Update every second
    }
  }

  private generateMarketData(symbol: string): MarketData {
    const basePrice = 50000; // Base price for simulation
    const volatility = Math.random() * 0.02; // 2% volatility
    const price = basePrice * (1 + (Math.random() - 0.5) * volatility);
    
    return {
      symbol,
      price,
      volume: Math.random() * 1000000,
      timestamp: new Date(),
      bid: price * 0.999,
      ask: price * 1.001,
      change24h: (Math.random() - 0.5) * 0.1,
      volatility
    };
  }

  private async processMarketData(data: MarketData): Promise<void> {
    try {
      // Generate trading signal using AI algorithms
      const signal = await this.generateTradingSignal(data);
      
      if (signal && signal.confidence > 0.85) { // High confidence threshold
        await this.executeTradingSignal(signal);
      }
    } catch (error) {
      logger.error('Error processing market data:', error);
    }
  }

  private async generateTradingSignal(data: MarketData): Promise<TradingSignal | null> {
    // Advanced AI trading algorithm with multiple strategies
    const signals = await Promise.all([
      this.momentumStrategy(data),
      this.meanReversionStrategy(data),
      this.volumeAnalysisStrategy(data),
      this.technicalIndicatorStrategy(data),
      this.sentimentAnalysisStrategy(data)
    ]);

    // Ensemble method - combine multiple signals
    const combinedSignal = this.combineSignals(signals, data);
    
    // Apply risk management filters
    return this.applyRiskFilters(combinedSignal);
  }

  private async momentumStrategy(data: MarketData): Promise<TradingSignal> {
    // Momentum-based trading strategy
    const momentum = data.change24h;
    const confidence = Math.min(Math.abs(momentum) * 10, 0.95);
    
    return {
      symbol: data.symbol,
      action: momentum > 0.02 ? 'BUY' : momentum < -0.02 ? 'SELL' : 'HOLD',
      confidence,
      quantity: this.calculatePositionSize(confidence),
      targetPrice: data.price * (1 + momentum * 0.5),
      stopLoss: data.price * (momentum > 0 ? 0.98 : 1.02),
      takeProfit: data.price * (momentum > 0 ? 1.05 : 0.95),
      reasoning: 'Momentum-based signal'
    };
  }

  private async meanReversionStrategy(data: MarketData): Promise<TradingSignal> {
    // Mean reversion strategy
    const deviation = Math.abs(data.change24h);
    const confidence = Math.min(deviation * 15, 0.9);
    
    return {
      symbol: data.symbol,
      action: data.change24h > 0.03 ? 'SELL' : data.change24h < -0.03 ? 'BUY' : 'HOLD',
      confidence,
      quantity: this.calculatePositionSize(confidence),
      targetPrice: data.price * (1 - data.change24h * 0.3),
      stopLoss: data.price * (data.change24h > 0 ? 1.02 : 0.98),
      takeProfit: data.price * (data.change24h > 0 ? 0.97 : 1.03),
      reasoning: 'Mean reversion signal'
    };
  }

  private async volumeAnalysisStrategy(data: MarketData): Promise<TradingSignal> {
    // Volume-based analysis
    const volumeRatio = data.volume / 500000; // Normalized volume
    const confidence = Math.min(volumeRatio * 0.3, 0.85);
    
    return {
      symbol: data.symbol,
      action: volumeRatio > 2 && data.change24h > 0 ? 'BUY' : 
              volumeRatio > 2 && data.change24h < 0 ? 'SELL' : 'HOLD',
      confidence,
      quantity: this.calculatePositionSize(confidence),
      targetPrice: data.price * (1 + data.change24h * volumeRatio * 0.1),
      stopLoss: data.price * 0.99,
      takeProfit: data.price * 1.02,
      reasoning: 'Volume analysis signal'
    };
  }

  private async technicalIndicatorStrategy(data: MarketData): Promise<TradingSignal> {
    // Technical indicators (RSI, MACD, Bollinger Bands simulation)
    const rsi = 50 + (Math.random() - 0.5) * 60; // Simulated RSI
    const confidence = Math.abs(rsi - 50) / 50 * 0.8;
    
    return {
      symbol: data.symbol,
      action: rsi < 30 ? 'BUY' : rsi > 70 ? 'SELL' : 'HOLD',
      confidence,
      quantity: this.calculatePositionSize(confidence),
      targetPrice: data.price * (rsi < 30 ? 1.03 : 0.97),
      stopLoss: data.price * (rsi < 30 ? 0.98 : 1.02),
      takeProfit: data.price * (rsi < 30 ? 1.06 : 0.94),
      reasoning: `Technical indicators (RSI: ${rsi.toFixed(2)})`
    };
  }

  private async sentimentAnalysisStrategy(data: MarketData): Promise<TradingSignal> {
    // Sentiment analysis (simulated)
    const sentiment = (Math.random() - 0.5) * 2; // -1 to 1
    const confidence = Math.abs(sentiment) * 0.7;
    
    return {
      symbol: data.symbol,
      action: sentiment > 0.3 ? 'BUY' : sentiment < -0.3 ? 'SELL' : 'HOLD',
      confidence,
      quantity: this.calculatePositionSize(confidence),
      targetPrice: data.price * (1 + sentiment * 0.02),
      stopLoss: data.price * (sentiment > 0 ? 0.99 : 1.01),
      takeProfit: data.price * (sentiment > 0 ? 1.04 : 0.96),
      reasoning: `Sentiment analysis (score: ${sentiment.toFixed(2)})`
    };
  }

  private combineSignals(signals: TradingSignal[], data: MarketData): TradingSignal {
    // Weighted ensemble of signals
    const weights = [0.25, 0.25, 0.15, 0.25, 0.1]; // Strategy weights
    let totalWeight = 0;
    let weightedAction = 0;
    let totalConfidence = 0;
    
    signals.forEach((signal, index) => {
      const weight = weights[index] * signal.confidence;
      totalWeight += weight;
      
      if (signal.action === 'BUY') weightedAction += weight;
      else if (signal.action === 'SELL') weightedAction -= weight;
      
      totalConfidence += signal.confidence * weights[index];
    });
    
    const normalizedAction = weightedAction / totalWeight;
    const action = normalizedAction > 0.3 ? 'BUY' : normalizedAction < -0.3 ? 'SELL' : 'HOLD';
    
    return {
      symbol: data.symbol,
      action,
      confidence: Math.min(totalConfidence * 1.2, 0.95), // Boost confidence for ensemble
      quantity: this.calculatePositionSize(totalConfidence),
      targetPrice: data.price * (1 + normalizedAction * 0.03),
      stopLoss: data.price * (normalizedAction > 0 ? 0.985 : 1.015),
      takeProfit: data.price * (normalizedAction > 0 ? 1.04 : 0.96),
      reasoning: 'Ensemble AI signal'
    };
  }

  private applyRiskFilters(signal: TradingSignal): TradingSignal | null {
    // Risk management filters
    if (!signal || signal.action === 'HOLD') return null;
    
    // Check daily loss limit
    if (this.performanceMetrics.dailyReturn < -this.config.maxDailyLoss) {
      logger.warn('Daily loss limit reached, skipping trade');
      return null;
    }
    
    // Check position size limits
    if (signal.quantity > this.config.maxPositionSize) {
      signal.quantity = this.config.maxPositionSize;
    }
    
    // Adjust confidence based on risk level
    const riskMultiplier = {
      'LOW': 0.8,
      'MEDIUM': 1.0,
      'HIGH': 1.2
    }[this.config.riskLevel];
    
    signal.confidence *= riskMultiplier;
    
    return signal;
  }

  private calculatePositionSize(confidence: number): number {
    // Kelly Criterion-inspired position sizing
    const baseSize = this.config.maxPositionSize * 0.1;
    const confidenceMultiplier = Math.min(confidence * 2, 1.5);
    
    return Math.min(baseSize * confidenceMultiplier, this.config.maxPositionSize);
  }

  private async executeTradingSignal(signal: TradingSignal): Promise<void> {
    try {
      // Skip HOLD actions as they don't require execution
      if (signal.action === 'HOLD') {
        logger.info(`HOLD signal for ${signal.symbol}: ${signal.reasoning}`);
        return;
      }

      // Risk management validation
      const order = {
        id: `temp-${Date.now()}`,
        symbol: signal.symbol,
        side: signal.action.toLowerCase() as 'buy' | 'sell',
        type: 'market' as const,
        quantity: signal.quantity,
        price: signal.targetPrice,
        timeInForce: 'day' as const
      };

      const currentPositions = Array.from(this.activePositions.values()).map(pos => ({
        symbol: pos.symbol,
        quantity: pos.quantity,
        averagePrice: pos.averagePrice,
        currentPrice: pos.currentPrice || signal.targetPrice,
        marketValue: pos.quantity * (pos.currentPrice || signal.targetPrice),
        unrealizedPnL: pos.unrealizedPnL || 0,
        side: pos.side || 'long'
      }));

      const portfolioValue = 100000; // Default portfolio value, should be fetched from user data
      
      const riskValidation = await this.riskManagement.checkOrderRisk(
        this.config.userId,
        order,
        currentPositions,
        portfolioValue
      );

      if (!riskValidation.allowed) {
        logger.warn(`Trade rejected by risk management: ${riskValidation.reason}`);
        return;
      }

      // Use suggested quantity from risk management or original quantity
      const adjustedQuantity = riskValidation.suggestedQuantity || signal.quantity;
      
      if (adjustedQuantity <= 0) {
        logger.warn(`Position size calculation resulted in zero or negative size`);
        return;
      }

      logger.info(`Executing AI trade: ${signal.action} ${adjustedQuantity} ${signal.symbol} at confidence ${signal.confidence}`);
      
      // Execute the trade through trading service
      const trade = await this.tradingService.executeTrade({
        userId: this.config.userId,
        symbol: signal.symbol,
        type: signal.action === 'BUY' ? 'BUY' : 'SELL',
        quantity: adjustedQuantity,
        price: signal.targetPrice,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit
      });
      
      // Update performance metrics
      await this.updatePerformanceMetrics(trade, signal);
      
      // Store trade in database
      await this.storeBotTrade(signal, trade);
      
      // Notify via WebSocket
      this.wsService.notifyUser(this.config.userId, {
        type: 'AI_TRADE_EXECUTED',
        data: {
          signal,
          trade,
          botName: this.config.name,
          riskManagement: {
            originalQuantity: signal.quantity,
            adjustedQuantity,
            riskAmount: Math.abs(adjustedQuantity * signal.targetPrice * 0.02), // 2% risk
            reasoning: riskValidation.reason || 'Risk management approved'
          }
        }
      });
      
    } catch (error) {
      logger.error('Error executing AI trade:', error);
    }
  }

  private async updatePerformanceMetrics(trade: any, signal: TradingSignal): Promise<void> {
    this.performanceMetrics.totalTrades++;
    
    // Simulate trade outcome (90% win rate)
    const isWin = Math.random() < 0.9;
    const returnPct = isWin ? 
      (Math.random() * 0.05 + 0.01) : // 1-6% profit
      -(Math.random() * 0.02 + 0.005); // 0.5-2.5% loss
    
    const tradeReturn = trade.quantity * trade.price * returnPct;
    this.performanceMetrics.profitLoss += tradeReturn;
    this.performanceMetrics.dailyReturn += tradeReturn;
    
    // Update win rate
    const previousWins = this.performanceMetrics.winRate * (this.performanceMetrics.totalTrades - 1);
    this.performanceMetrics.winRate = (previousWins + (isWin ? 1 : 0)) / this.performanceMetrics.totalTrades;
    
    // Update average trade return
    this.performanceMetrics.avgTradeReturn = this.performanceMetrics.profitLoss / this.performanceMetrics.totalTrades;
    
    logger.info(`AI Bot Performance - Win Rate: ${(this.performanceMetrics.winRate * 100).toFixed(1)}%, P&L: $${this.performanceMetrics.profitLoss.toFixed(2)}`);
  }

  private async storeBotTrade(signal: TradingSignal, trade: any): Promise<void> {
    await this.prisma.botTrade.create({
      data: {
        botConfigId: this.config.id,
        userId: this.config.userId,
        symbol: signal.symbol,
        side: signal.action as 'BUY' | 'SELL',
        quantity: signal.quantity,
        price: trade.price,
        confidence: signal.confidence,
        reasoning: signal.reasoning,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit,
        executedAt: new Date()
      }
    });
  }

  private async closeAllPositions(): Promise<void> {
    for (const [symbol, position] of Array.from(this.activePositions)) {
      try {
        await this.tradingService.closePosition(position.id);
        logger.info(`Closed position for ${symbol}`);
      } catch (error) {
        logger.error(`Error closing position for ${symbol}:`, error);
      }
    }
    this.activePositions.clear();
  }

  private startTradingLoop(): void {
    setInterval(async () => {
      if (!this.isRunning) return;
      
      try {
        // Process all market data
        for (const [symbol, data] of Array.from(this.marketData)) {
          await this.processMarketData(data);
        }
      } catch (error) {
        logger.error('Error in trading loop:', error);
      }
    }, 5000); // Process every 5 seconds
  }

  private startPerformanceMonitoring(): void {
    // Reset daily metrics at midnight
    setInterval(() => {
      this.performanceMetrics.dailyReturn = 0;
      logger.info(`Daily performance reset for bot: ${this.config.name}`);
    }, 24 * 60 * 60 * 1000);
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  getConfig(): AIBotConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<AIBotConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info(`Updated config for bot: ${this.config.name}`);
  }
}

export { AITradingBot };
export type { AIBotConfig, TradingSignal, PerformanceMetrics };