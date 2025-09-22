import { EventEmitter } from 'events';
import { MarketData, TradingSignal, TradeResult } from './types';

export interface ExchangeConfig {
  id: string;
  name: string;
  type: 'SPOT' | 'FUTURES' | 'OPTIONS' | 'MARGIN';
  enabled: boolean;
  apiKey: string;
  apiSecret: string;
  passphrase?: string; // For some exchanges like Coinbase Pro
  sandbox: boolean;
  rateLimits: {
    requestsPerSecond: number;
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  fees: {
    maker: number;
    taker: number;
    withdrawal: { [symbol: string]: number };
  };
  supportedMarkets: string[];
  features: {
    spot: boolean;
    margin: boolean;
    futures: boolean;
    options: boolean;
    lending: boolean;
    staking: boolean;
  };
  websocketUrl?: string;
  restApiUrl: string;
  testnetUrl?: string;
}

export interface ExchangeBalance {
  symbol: string;
  free: number;
  used: number;
  total: number;
  usdValue?: number;
}

export interface ExchangeOrder {
  id: string;
  exchangeId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  amount: number;
  price?: number;
  stopPrice?: number;
  status: 'PENDING' | 'OPEN' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  filled: number;
  remaining: number;
  cost: number;
  fee: {
    currency: string;
    cost: number;
  };
  timestamp: Date;
  lastTradeTimestamp?: Date;
  trades?: ExchangeTrade[];
}

export interface ExchangeTrade {
  id: string;
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  amount: number;
  price: number;
  cost: number;
  fee: {
    currency: string;
    cost: number;
  };
  timestamp: Date;
}

export interface ExchangeOrderBook {
  symbol: string;
  exchangeId: string;
  bids: [number, number][]; // [price, amount]
  asks: [number, number][]; // [price, amount]
  timestamp: Date;
  nonce?: number;
}

export interface ExchangeTicker {
  symbol: string;
  exchangeId: string;
  bid: number;
  ask: number;
  last: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume: number;
  change: number;
  percentage: number;
  timestamp: Date;
}

export interface ExchangeCandle {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ArbitrageOpportunity {
  id: string;
  symbol: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  spreadPercent: number;
  volume: number;
  profit: number;
  profitPercent: number;
  timestamp: Date;
  confidence: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedExecutionTime: number; // milliseconds
}

export interface ExchangeMetrics {
  exchangeId: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'ERROR';
  latency: number;
  uptime: number;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  totalVolume: number;
  totalFees: number;
  lastUpdate: Date;
  errorRate: number;
  apiCallsToday: number;
  rateLimitRemaining: number;
}

export interface CrossExchangePosition {
  symbol: string;
  totalAmount: number;
  totalValue: number;
  averagePrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  positions: {
    exchangeId: string;
    amount: number;
    value: number;
    price: number;
  }[];
  lastUpdated: Date;
}

export abstract class BaseExchange extends EventEmitter {
  protected config: ExchangeConfig;
  protected isConnected: boolean = false;
  protected rateLimitTracker: Map<string, number[]> = new Map();
  protected lastRequestTime: number = 0;
  protected metrics: ExchangeMetrics;

  constructor(config: ExchangeConfig) {
    super();
    this.config = config;
    this.metrics = this.initializeMetrics();
  }

  private initializeMetrics(): ExchangeMetrics {
    return {
      exchangeId: this.config.id,
      name: this.config.name,
      status: 'OFFLINE',
      latency: 0,
      uptime: 0,
      totalOrders: 0,
      successfulOrders: 0,
      failedOrders: 0,
      totalVolume: 0,
      totalFees: 0,
      lastUpdate: new Date(),
      errorRate: 0,
      apiCallsToday: 0,
      rateLimitRemaining: this.config.rateLimits.requestsPerMinute
    };
  }

  // Abstract methods that must be implemented by each exchange
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract getBalance(): Promise<ExchangeBalance[]>;
  abstract createOrder(order: Partial<ExchangeOrder>): Promise<ExchangeOrder>;
  abstract cancelOrder(orderId: string, symbol: string): Promise<boolean>;
  abstract getOrder(orderId: string, symbol: string): Promise<ExchangeOrder>;
  abstract getOrders(symbol?: string): Promise<ExchangeOrder[]>;
  abstract getTicker(symbol: string): Promise<ExchangeTicker>;
  abstract getOrderBook(symbol: string, limit?: number): Promise<ExchangeOrderBook>;
  abstract getCandles(symbol: string, timeframe: string, limit?: number): Promise<ExchangeCandle[]>;
  abstract subscribeToTicker(symbol: string): void;
  abstract subscribeToOrderBook(symbol: string): void;
  abstract subscribeToTrades(symbol: string): void;

  // Common methods
  getConfig(): ExchangeConfig {
    return { ...this.config };
  }

  getMetrics(): ExchangeMetrics {
    return { ...this.metrics };
  }

  isOnline(): boolean {
    return this.isConnected && this.metrics.status === 'ONLINE';
  }

  protected async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 1000 / this.config.rateLimits.requestsPerSecond;
    
    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
    this.metrics.apiCallsToday++;
  }

  protected updateMetrics(success: boolean, latency: number): void {
    this.metrics.latency = latency;
    this.metrics.lastUpdate = new Date();
    
    if (success) {
      this.metrics.successfulOrders++;
    } else {
      this.metrics.failedOrders++;
    }
    
    this.metrics.totalOrders = this.metrics.successfulOrders + this.metrics.failedOrders;
    this.metrics.errorRate = this.metrics.totalOrders > 0 ? 
      (this.metrics.failedOrders / this.metrics.totalOrders) * 100 : 0;
  }
}

// Binance Exchange Implementation
export class BinanceExchange extends BaseExchange {
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(config: ExchangeConfig) {
    super(config);
  }

  async connect(): Promise<void> {
    try {
      console.log(`Connecting to Binance exchange...`);
      
      // Test API connection
      await this.testConnection();
      
      // Connect WebSocket
      await this.connectWebSocket();
      
      this.isConnected = true;
      this.metrics.status = 'ONLINE';
      
      console.log(`✅ Connected to Binance exchange`);
      this.emit('connected', { exchangeId: this.config.id });
      
    } catch (error) {
      this.metrics.status = 'ERROR';
      console.error(`❌ Failed to connect to Binance:`, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.metrics.status = 'OFFLINE';
    
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    
    console.log(`Disconnected from Binance exchange`);
    this.emit('disconnected', { exchangeId: this.config.id });
  }

  private async testConnection(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Mock API call to test connection
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const latency = Date.now() - startTime;
      this.updateMetrics(true, latency);
      
    } catch (error) {
      const latency = Date.now() - startTime;
      this.updateMetrics(false, latency);
      throw error;
    }
  }

  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.config.websocketUrl || 'wss://stream.binance.com:9443/ws';
        this.wsConnection = new WebSocket(wsUrl);
        
        this.wsConnection.onopen = () => {
          console.log('Binance WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };
        
        this.wsConnection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.wsConnection.onclose = () => {
          console.log('Binance WebSocket disconnected');
          this.handleWebSocketReconnect();
        };
        
        this.wsConnection.onerror = (error) => {
          console.error('Binance WebSocket error:', error);
          reject(error);
        };
        
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleWebSocketReconnect(): void {
    if (!this.isConnected || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`Attempting to reconnect to Binance WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    setTimeout(() => {
      this.connectWebSocket().catch(error => {
        console.error('WebSocket reconnection failed:', error);
      });
    }, delay);
  }

  private handleWebSocketMessage(data: any): void {
    // Handle different message types
    if (data.e === '24hrTicker') {
      this.emit('ticker', this.parseTickerData(data));
    } else if (data.e === 'depthUpdate') {
      this.emit('orderBookUpdate', this.parseOrderBookData(data));
    } else if (data.e === 'trade') {
      this.emit('trade', this.parseTradeData(data));
    }
  }

  private parseTickerData(data: any): ExchangeTicker {
    return {
      symbol: data.s,
      exchangeId: this.config.id,
      bid: parseFloat(data.b),
      ask: parseFloat(data.a),
      last: parseFloat(data.c),
      open: parseFloat(data.o),
      high: parseFloat(data.h),
      low: parseFloat(data.l),
      close: parseFloat(data.c),
      volume: parseFloat(data.v),
      quoteVolume: parseFloat(data.q),
      change: parseFloat(data.P),
      percentage: parseFloat(data.P),
      timestamp: new Date(data.E)
    };
  }

  private parseOrderBookData(data: any): Partial<ExchangeOrderBook> {
    return {
      symbol: data.s,
      exchangeId: this.config.id,
      bids: data.b?.map((bid: any) => [parseFloat(bid[0]), parseFloat(bid[1])]) || [],
      asks: data.a?.map((ask: any) => [parseFloat(ask[0]), parseFloat(ask[1])]) || [],
      timestamp: new Date(data.E)
    };
  }

  private parseTradeData(data: any): ExchangeTrade {
    return {
      id: data.t.toString(),
      orderId: data.t.toString(),
      symbol: data.s,
      side: data.m ? 'SELL' : 'BUY',
      amount: parseFloat(data.q),
      price: parseFloat(data.p),
      cost: parseFloat(data.q) * parseFloat(data.p),
      fee: {
        currency: 'BNB',
        cost: 0
      },
      timestamp: new Date(data.T)
    };
  }

  async getBalance(): Promise<ExchangeBalance[]> {
    await this.checkRateLimit();
    
    // Mock balance data
    return [
      { symbol: 'BTC', free: 0.5, used: 0.1, total: 0.6, usdValue: 30000 },
      { symbol: 'ETH', free: 2.0, used: 0.5, total: 2.5, usdValue: 5000 },
      { symbol: 'USDT', free: 10000, used: 2000, total: 12000, usdValue: 12000 }
    ];
  }

  async createOrder(orderData: Partial<ExchangeOrder>): Promise<ExchangeOrder> {
    await this.checkRateLimit();
    
    const order: ExchangeOrder = {
      id: `binance_${Date.now()}`,
      exchangeId: this.config.id,
      symbol: orderData.symbol!,
      side: orderData.side!,
      type: orderData.type || 'MARKET',
      amount: orderData.amount!,
      price: orderData.price,
      status: 'PENDING',
      filled: 0,
      remaining: orderData.amount!,
      cost: 0,
      fee: { currency: 'BNB', cost: 0 },
      timestamp: new Date()
    };
    
    // Simulate order processing
    setTimeout(() => {
      order.status = 'FILLED';
      order.filled = order.amount;
      order.remaining = 0;
      order.cost = order.amount * (order.price || 50000);
      order.lastTradeTimestamp = new Date();
      
      this.emit('orderUpdate', order);
    }, 1000);
    
    return order;
  }

  async cancelOrder(orderId: string, symbol: string): Promise<boolean> {
    await this.checkRateLimit();
    
    // Mock cancellation
    console.log(`Cancelling order ${orderId} for ${symbol}`);
    return true;
  }

  async getOrder(orderId: string, symbol: string): Promise<ExchangeOrder> {
    await this.checkRateLimit();
    
    // Mock order data
    return {
      id: orderId,
      exchangeId: this.config.id,
      symbol,
      side: 'BUY',
      type: 'LIMIT',
      amount: 1.0,
      price: 50000,
      status: 'FILLED',
      filled: 1.0,
      remaining: 0,
      cost: 50000,
      fee: { currency: 'BNB', cost: 0.1 },
      timestamp: new Date()
    };
  }

  async getOrders(symbol?: string): Promise<ExchangeOrder[]> {
    await this.checkRateLimit();
    
    // Mock orders data
    return [];
  }

  async getTicker(symbol: string): Promise<ExchangeTicker> {
    await this.checkRateLimit();
    
    // Mock ticker data
    return {
      symbol,
      exchangeId: this.config.id,
      bid: 49950,
      ask: 50050,
      last: 50000,
      open: 49000,
      high: 51000,
      low: 48000,
      close: 50000,
      volume: 1000,
      quoteVolume: 50000000,
      change: 1000,
      percentage: 2.04,
      timestamp: new Date()
    };
  }

  async getOrderBook(symbol: string, limit: number = 100): Promise<ExchangeOrderBook> {
    await this.checkRateLimit();
    
    // Mock order book data
    const bids: [number, number][] = [];
    const asks: [number, number][] = [];
    
    for (let i = 0; i < limit; i++) {
      bids.push([50000 - i * 10, Math.random() * 10]);
      asks.push([50000 + i * 10, Math.random() * 10]);
    }
    
    return {
      symbol,
      exchangeId: this.config.id,
      bids,
      asks,
      timestamp: new Date()
    };
  }

  async getCandles(symbol: string, timeframe: string, limit: number = 100): Promise<ExchangeCandle[]> {
    await this.checkRateLimit();
    
    // Mock candle data
    const candles: ExchangeCandle[] = [];
    const now = Date.now();
    const interval = this.getTimeframeMs(timeframe);
    
    for (let i = limit - 1; i >= 0; i--) {
      const timestamp = new Date(now - i * interval);
      const open = 50000 + Math.random() * 1000 - 500;
      const close = open + Math.random() * 200 - 100;
      const high = Math.max(open, close) + Math.random() * 100;
      const low = Math.min(open, close) - Math.random() * 100;
      
      candles.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.random() * 100
      });
    }
    
    return candles;
  }

  private getTimeframeMs(timeframe: string): number {
    const timeframes: { [key: string]: number } = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000
    };
    
    return timeframes[timeframe] || timeframes['1h'];
  }

  subscribeToTicker(symbol: string): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      const subscription = {
        method: 'SUBSCRIBE',
        params: [`${symbol.toLowerCase()}@ticker`],
        id: Date.now()
      };
      
      this.wsConnection.send(JSON.stringify(subscription));
      console.log(`Subscribed to ticker for ${symbol}`);
    }
  }

  subscribeToOrderBook(symbol: string): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      const subscription = {
        method: 'SUBSCRIBE',
        params: [`${symbol.toLowerCase()}@depth`],
        id: Date.now()
      };
      
      this.wsConnection.send(JSON.stringify(subscription));
      console.log(`Subscribed to order book for ${symbol}`);
    }
  }

  subscribeToTrades(symbol: string): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      const subscription = {
        method: 'SUBSCRIBE',
        params: [`${symbol.toLowerCase()}@trade`],
        id: Date.now()
      };
      
      this.wsConnection.send(JSON.stringify(subscription));
      console.log(`Subscribed to trades for ${symbol}`);
    }
  }
}

// Coinbase Exchange Implementation
export class CoinbaseExchange extends BaseExchange {
  constructor(config: ExchangeConfig) {
    super(config);
  }

  async connect(): Promise<void> {
    console.log(`Connecting to Coinbase exchange...`);
    // Implementation similar to Binance but with Coinbase-specific API
    this.isConnected = true;
    this.metrics.status = 'ONLINE';
    console.log(`✅ Connected to Coinbase exchange`);
    this.emit('connected', { exchangeId: this.config.id });
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.metrics.status = 'OFFLINE';
    console.log(`Disconnected from Coinbase exchange`);
    this.emit('disconnected', { exchangeId: this.config.id });
  }

  // Implement all abstract methods with Coinbase-specific logic
  async getBalance(): Promise<ExchangeBalance[]> {
    await this.checkRateLimit();
    return [];
  }

  async createOrder(orderData: Partial<ExchangeOrder>): Promise<ExchangeOrder> {
    await this.checkRateLimit();
    throw new Error('Not implemented');
  }

  async cancelOrder(orderId: string, symbol: string): Promise<boolean> {
    await this.checkRateLimit();
    return false;
  }

  async getOrder(orderId: string, symbol: string): Promise<ExchangeOrder> {
    await this.checkRateLimit();
    throw new Error('Not implemented');
  }

  async getOrders(symbol?: string): Promise<ExchangeOrder[]> {
    await this.checkRateLimit();
    return [];
  }

  async getTicker(symbol: string): Promise<ExchangeTicker> {
    await this.checkRateLimit();
    throw new Error('Not implemented');
  }

  async getOrderBook(symbol: string, limit?: number): Promise<ExchangeOrderBook> {
    await this.checkRateLimit();
    throw new Error('Not implemented');
  }

  async getCandles(symbol: string, timeframe: string, limit?: number): Promise<ExchangeCandle[]> {
    await this.checkRateLimit();
    return [];
  }

  subscribeToTicker(symbol: string): void {
    console.log(`Subscribing to Coinbase ticker for ${symbol}`);
  }

  subscribeToOrderBook(symbol: string): void {
    console.log(`Subscribing to Coinbase order book for ${symbol}`);
  }

  subscribeToTrades(symbol: string): void {
    console.log(`Subscribing to Coinbase trades for ${symbol}`);
  }
}

// Multi-Exchange Integration Manager
export class MultiExchangeIntegration extends EventEmitter {
  private exchanges: Map<string, BaseExchange> = new Map();
  private aggregatedData: {
    tickers: Map<string, ExchangeTicker[]>;
    orderBooks: Map<string, ExchangeOrderBook[]>;
    balances: Map<string, ExchangeBalance[]>;
  };
  private arbitrageOpportunities: ArbitrageOpportunity[] = [];
  private crossExchangePositions: Map<string, CrossExchangePosition> = new Map();
  
  private isRunning: boolean = false;
  private updateInterval: NodeJS.Timeout | null = null;
  private arbitrageScanner: NodeJS.Timeout | null = null;
  
  constructor() {
    super();
    
    this.aggregatedData = {
      tickers: new Map(),
      orderBooks: new Map(),
      balances: new Map()
    };
    
    console.log('Multi-Exchange Integration initialized');
  }

  /**
   * Add exchange to the integration
   */
  addExchange(exchange: BaseExchange): void {
    const config = exchange.getConfig();
    this.exchanges.set(config.id, exchange);
    
    // Set up event listeners
    exchange.on('connected', (data) => {
      console.log(`Exchange ${config.name} connected`);
      this.emit('exchangeConnected', data);
    });
    
    exchange.on('disconnected', (data) => {
      console.log(`Exchange ${config.name} disconnected`);
      this.emit('exchangeDisconnected', data);
    });
    
    exchange.on('ticker', (ticker: ExchangeTicker) => {
      this.updateAggregatedTicker(ticker);
    });
    
    exchange.on('orderBookUpdate', (orderBook: Partial<ExchangeOrderBook>) => {
      this.updateAggregatedOrderBook(orderBook);
    });
    
    exchange.on('orderUpdate', (order: ExchangeOrder) => {
      this.emit('orderUpdate', order);
    });
    
    console.log(`Added exchange: ${config.name} (${config.id})`);
    this.emit('exchangeAdded', { exchangeId: config.id, name: config.name });
  }

  /**
   * Remove exchange from integration
   */
  async removeExchange(exchangeId: string): Promise<boolean> {
    const exchange = this.exchanges.get(exchangeId);
    if (!exchange) return false;
    
    await exchange.disconnect();
    exchange.removeAllListeners();
    
    this.exchanges.delete(exchangeId);
    
    console.log(`Removed exchange: ${exchangeId}`);
    this.emit('exchangeRemoved', { exchangeId });
    
    return true;
  }

  /**
   * Connect to all exchanges
   */
  async connectAll(): Promise<void> {
    console.log(`Connecting to ${this.exchanges.size} exchanges...`);
    
    const connectionPromises = Array.from(this.exchanges.values()).map(async (exchange) => {
      try {
        await exchange.connect();
      } catch (error) {
        console.error(`Failed to connect to exchange ${exchange.getConfig().name}:`, error);
      }
    });
    
    await Promise.all(connectionPromises);
    
    const connectedCount = Array.from(this.exchanges.values())
      .filter(exchange => exchange.isOnline()).length;
    
    console.log(`Connected to ${connectedCount}/${this.exchanges.size} exchanges`);
  }

  /**
   * Disconnect from all exchanges
   */
  async disconnectAll(): Promise<void> {
    console.log('Disconnecting from all exchanges...');
    
    const disconnectionPromises = Array.from(this.exchanges.values()).map(async (exchange) => {
      try {
        await exchange.disconnect();
      } catch (error) {
        console.error(`Failed to disconnect from exchange ${exchange.getConfig().name}:`, error);
      }
    });
    
    await Promise.all(disconnectionPromises);
    console.log('Disconnected from all exchanges');
  }

  /**
   * Start the integration system
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Multi-Exchange Integration already running');
      return;
    }
    
    this.isRunning = true;
    console.log('🔄 Starting Multi-Exchange Integration...');
    
    // Connect to all exchanges
    await this.connectAll();
    
    // Start data aggregation
    this.startDataAggregation();
    
    // Start arbitrage scanning
    this.startArbitrageScanning();
    
    console.log('✅ Multi-Exchange Integration started');
    this.emit('systemStarted', { timestamp: new Date() });
  }

  /**
   * Stop the integration system
   */
  async stop(): Promise<void> {
    this.isRunning = false;
    
    // Stop intervals
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    if (this.arbitrageScanner) {
      clearInterval(this.arbitrageScanner);
      this.arbitrageScanner = null;
    }
    
    // Disconnect from all exchanges
    await this.disconnectAll();
    
    console.log('⏹️ Multi-Exchange Integration stopped');
    this.emit('systemStopped', { timestamp: new Date() });
  }

  /**
   * Start data aggregation
   */
  private startDataAggregation(): void {
    this.updateInterval = setInterval(async () => {
      if (!this.isRunning) return;
      
      await this.aggregateBalances();
      await this.updateCrossExchangePositions();
      
      this.emit('dataAggregated', {
        timestamp: new Date(),
        exchanges: this.exchanges.size,
        tickers: this.aggregatedData.tickers.size,
        orderBooks: this.aggregatedData.orderBooks.size
      });
    }, 10000); // Update every 10 seconds
  }

  /**
   * Start arbitrage opportunity scanning
   */
  private startArbitrageScanning(): void {
    this.arbitrageScanner = setInterval(() => {
      if (!this.isRunning) return;
      
      this.scanArbitrageOpportunities();
    }, 5000); // Scan every 5 seconds
  }

  /**
   * Update aggregated ticker data
   */
  private updateAggregatedTicker(ticker: ExchangeTicker): void {
    const symbol = ticker.symbol;
    
    if (!this.aggregatedData.tickers.has(symbol)) {
      this.aggregatedData.tickers.set(symbol, []);
    }
    
    const tickers = this.aggregatedData.tickers.get(symbol)!;
    
    // Remove old ticker from same exchange
    const filteredTickers = tickers.filter(t => t.exchangeId !== ticker.exchangeId);
    
    // Add new ticker
    filteredTickers.push(ticker);
    
    this.aggregatedData.tickers.set(symbol, filteredTickers);
    
    this.emit('tickerAggregated', { symbol, tickers: filteredTickers });
  }

  /**
   * Update aggregated order book data
   */
  private updateAggregatedOrderBook(orderBook: Partial<ExchangeOrderBook>): void {
    if (!orderBook.symbol || !orderBook.exchangeId) return;
    
    const symbol = orderBook.symbol;
    
    if (!this.aggregatedData.orderBooks.has(symbol)) {
      this.aggregatedData.orderBooks.set(symbol, []);
    }
    
    const orderBooks = this.aggregatedData.orderBooks.get(symbol)!;
    
    // Remove old order book from same exchange
    const filteredOrderBooks = orderBooks.filter(ob => ob.exchangeId !== orderBook.exchangeId);
    
    // Add new order book (if complete)
    if (orderBook.bids && orderBook.asks) {
      filteredOrderBooks.push(orderBook as ExchangeOrderBook);
    }
    
    this.aggregatedData.orderBooks.set(symbol, filteredOrderBooks);
    
    this.emit('orderBookAggregated', { symbol, orderBooks: filteredOrderBooks });
  }

  /**
   * Aggregate balances from all exchanges
   */
  private async aggregateBalances(): Promise<void> {
    const allBalances = new Map<string, ExchangeBalance[]>();
    
    for (const [exchangeId, exchange] of Array.from(this.exchanges.entries())) {
      if (!exchange.isOnline()) continue;
      
      try {
        const balances = await exchange.getBalance();
        allBalances.set(exchangeId, balances);
      } catch (error) {
        console.error(`Failed to get balance from ${exchangeId}:`, error);
      }
    }
    
    this.aggregatedData.balances = allBalances;
    this.emit('balancesAggregated', { balances: allBalances });
  }

  /**
   * Update cross-exchange positions
   */
  private async updateCrossExchangePositions(): Promise<void> {
    const symbolTotals = new Map<string, {
      totalAmount: number;
      totalValue: number;
      positions: { exchangeId: string; amount: number; value: number; price: number }[];
    }>();
    
    // Aggregate positions across exchanges
    for (const [exchangeId, balances] of Array.from(this.aggregatedData.balances)) {
      for (const balance of balances) {
        if (balance.total <= 0) continue;
        
        const symbol = balance.symbol;
        
        if (!symbolTotals.has(symbol)) {
          symbolTotals.set(symbol, {
            totalAmount: 0,
            totalValue: 0,
            positions: []
          });
        }
        
        const symbolData = symbolTotals.get(symbol)!;
        const value = balance.usdValue || 0;
        const price = value > 0 ? value / balance.total : 0;
        
        symbolData.totalAmount += balance.total;
        symbolData.totalValue += value;
        symbolData.positions.push({
          exchangeId,
          amount: balance.total,
          value,
          price
        });
      }
    }
    
    // Create cross-exchange positions
    for (const [symbol, data] of Array.from(symbolTotals)) {
      const averagePrice = data.totalAmount > 0 ? data.totalValue / data.totalAmount : 0;
      
      const position: CrossExchangePosition = {
        symbol,
        totalAmount: data.totalAmount,
        totalValue: data.totalValue,
        averagePrice,
        unrealizedPnL: 0, // Would need current market price to calculate
        realizedPnL: 0, // Would need trade history to calculate
        positions: data.positions,
        lastUpdated: new Date()
      };
      
      this.crossExchangePositions.set(symbol, position);
    }
    
    this.emit('positionsUpdated', { positions: Array.from(this.crossExchangePositions.values()) });
  }

  /**
   * Scan for arbitrage opportunities
   */
  private scanArbitrageOpportunities(): void {
    const opportunities: ArbitrageOpportunity[] = [];
    
    // Check each symbol across exchanges
    for (const [symbol, tickers] of Array.from(this.aggregatedData.tickers)) {
      if (tickers.length < 2) continue;
      
      // Find best bid and ask across exchanges
      let highestBid = { price: 0, exchangeId: '', volume: 0 };
      let lowestAsk = { price: Infinity, exchangeId: '', volume: 0 };
      
      for (const ticker of tickers) {
        if (ticker.bid > highestBid.price) {
          highestBid = {
            price: ticker.bid,
            exchangeId: ticker.exchangeId,
            volume: ticker.volume
          };
        }
        
        if (ticker.ask < lowestAsk.price) {
          lowestAsk = {
            price: ticker.ask,
            exchangeId: ticker.exchangeId,
            volume: ticker.volume
          };
        }
      }
      
      // Check for arbitrage opportunity
      if (highestBid.price > lowestAsk.price && highestBid.exchangeId !== lowestAsk.exchangeId) {
        const spread = highestBid.price - lowestAsk.price;
        const spreadPercent = (spread / lowestAsk.price) * 100;
        
        // Only consider opportunities with spread > 0.1%
        if (spreadPercent > 0.1) {
          const volume = Math.min(highestBid.volume, lowestAsk.volume, 10); // Limit to 10 units
          const profit = spread * volume;
          const profitPercent = (profit / (lowestAsk.price * volume)) * 100;
          
          const opportunity: ArbitrageOpportunity = {
            id: `arb_${symbol}_${Date.now()}`,
            symbol,
            buyExchange: lowestAsk.exchangeId,
            sellExchange: highestBid.exchangeId,
            buyPrice: lowestAsk.price,
            sellPrice: highestBid.price,
            spread,
            spreadPercent,
            volume,
            profit,
            profitPercent,
            timestamp: new Date(),
            confidence: this.calculateArbitrageConfidence(spreadPercent, volume),
            risk: this.assessArbitrageRisk(spreadPercent, volume),
            estimatedExecutionTime: 5000 // 5 seconds
          };
          
          opportunities.push(opportunity);
        }
      }
    }
    
    // Update arbitrage opportunities
    this.arbitrageOpportunities = opportunities
      .sort((a, b) => b.profitPercent - a.profitPercent)
      .slice(0, 20); // Keep top 20 opportunities
    
    if (opportunities.length > 0) {
      this.emit('arbitrageOpportunities', { opportunities: this.arbitrageOpportunities });
    }
  }

  /**
   * Calculate arbitrage confidence score
   */
  private calculateArbitrageConfidence(spreadPercent: number, volume: number): number {
    let confidence = 0;
    
    // Higher spread = higher confidence
    confidence += Math.min(spreadPercent * 10, 50);
    
    // Higher volume = higher confidence
    confidence += Math.min(volume * 5, 30);
    
    // Base confidence
    confidence += 20;
    
    return Math.min(confidence, 100);
  }

  /**
   * Assess arbitrage risk level
   */
  private assessArbitrageRisk(spreadPercent: number, volume: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (spreadPercent > 2 && volume > 5) return 'LOW';
    if (spreadPercent > 1 && volume > 2) return 'MEDIUM';
    return 'HIGH';
  }

  /**
   * Execute arbitrage opportunity
   */
  async executeArbitrage(opportunityId: string): Promise<boolean> {
    const opportunity = this.arbitrageOpportunities.find(op => op.id === opportunityId);
    if (!opportunity) {
      console.error(`Arbitrage opportunity ${opportunityId} not found`);
      return false;
    }
    
    const buyExchange = this.exchanges.get(opportunity.buyExchange);
    const sellExchange = this.exchanges.get(opportunity.sellExchange);
    
    if (!buyExchange || !sellExchange) {
      console.error('Required exchanges not available for arbitrage');
      return false;
    }
    
    try {
      console.log(`Executing arbitrage for ${opportunity.symbol}: Buy on ${opportunity.buyExchange} at ${opportunity.buyPrice}, Sell on ${opportunity.sellExchange} at ${opportunity.sellPrice}`);
      
      // Execute buy order
      const buyOrder = await buyExchange.createOrder({
        symbol: opportunity.symbol,
        side: 'BUY',
        type: 'MARKET',
        amount: opportunity.volume
      });
      
      // Execute sell order
      const sellOrder = await sellExchange.createOrder({
        symbol: opportunity.symbol,
        side: 'SELL',
        type: 'MARKET',
        amount: opportunity.volume
      });
      
      console.log(`✅ Arbitrage executed successfully: Buy order ${buyOrder.id}, Sell order ${sellOrder.id}`);
      
      this.emit('arbitrageExecuted', {
        opportunity,
        buyOrder,
        sellOrder,
        timestamp: new Date()
      });
      
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to execute arbitrage:`, error);
      
      this.emit('arbitrageFailed', {
        opportunity,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
      
      return false;
    }
  }

  /**
   * Get best price across exchanges
   */
  getBestPrice(symbol: string, side: 'BUY' | 'SELL'): { price: number; exchangeId: string } | null {
    const tickers = this.aggregatedData.tickers.get(symbol);
    if (!tickers || tickers.length === 0) return null;
    
    let bestPrice = side === 'BUY' ? Infinity : 0;
    let bestExchange = '';
    
    for (const ticker of tickers) {
      const price = side === 'BUY' ? ticker.ask : ticker.bid;
      
      if (side === 'BUY' && price < bestPrice) {
        bestPrice = price;
        bestExchange = ticker.exchangeId;
      } else if (side === 'SELL' && price > bestPrice) {
        bestPrice = price;
        bestExchange = ticker.exchangeId;
      }
    }
    
    return bestExchange ? { price: bestPrice, exchangeId: bestExchange } : null;
  }

  /**
   * Execute smart order across exchanges
   */
  async executeSmartOrder(symbol: string, side: 'BUY' | 'SELL', amount: number): Promise<ExchangeOrder[]> {
    const bestPrice = this.getBestPrice(symbol, side);
    if (!bestPrice) {
      throw new Error(`No price available for ${symbol}`);
    }
    
    const exchange = this.exchanges.get(bestPrice.exchangeId);
    if (!exchange) {
      throw new Error(`Exchange ${bestPrice.exchangeId} not available`);
    }
    
    console.log(`Executing smart order: ${side} ${amount} ${symbol} on ${bestPrice.exchangeId} at ${bestPrice.price}`);
    
    const order = await exchange.createOrder({
      symbol,
      side,
      type: 'MARKET',
      amount
    });
    
    this.emit('smartOrderExecuted', {
      order,
      bestPrice,
      timestamp: new Date()
    });
    
    return [order];
  }

  // Public API methods

  /**
   * Get all exchanges
   */
  getExchanges(): BaseExchange[] {
    return Array.from(this.exchanges.values());
  }

  /**
   * Get exchange by ID
   */
  getExchange(exchangeId: string): BaseExchange | undefined {
    return this.exchanges.get(exchangeId);
  }

  /**
   * Get aggregated data
   */
  getAggregatedData() {
    return {
      tickers: Object.fromEntries(this.aggregatedData.tickers),
      orderBooks: Object.fromEntries(this.aggregatedData.orderBooks),
      balances: Object.fromEntries(this.aggregatedData.balances)
    };
  }

  /**
   * Get arbitrage opportunities
   */
  getArbitrageOpportunities(): ArbitrageOpportunity[] {
    return [...this.arbitrageOpportunities];
  }

  /**
   * Get cross-exchange positions
   */
  getCrossExchangePositions(): CrossExchangePosition[] {
    return Array.from(this.crossExchangePositions.values());
  }

  /**
   * Get exchange metrics
   */
  getExchangeMetrics(): ExchangeMetrics[] {
    return Array.from(this.exchanges.values()).map(exchange => exchange.getMetrics());
  }

  /**
   * Get system status
   */
  getStatus() {
    const onlineExchanges = Array.from(this.exchanges.values()).filter(ex => ex.isOnline()).length;
    
    return {
      isRunning: this.isRunning,
      totalExchanges: this.exchanges.size,
      onlineExchanges,
      aggregatedSymbols: this.aggregatedData.tickers.size,
      arbitrageOpportunities: this.arbitrageOpportunities.length,
      crossExchangePositions: this.crossExchangePositions.size,
      lastUpdate: new Date()
    };
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    await this.stop();
    
    // Clean up all exchanges
    for (const exchange of Array.from(this.exchanges.values())) {
      exchange.removeAllListeners();
    }
    
    this.exchanges.clear();
    this.aggregatedData.tickers.clear();
    this.aggregatedData.orderBooks.clear();
    this.aggregatedData.balances.clear();
    this.arbitrageOpportunities = [];
    this.crossExchangePositions.clear();
    
    this.removeAllListeners();
    console.log('Multi-Exchange Integration destroyed');
  }
}