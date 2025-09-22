import { MarketData, MarketType } from './types';

export interface DataFeed {
  id: string;
  name: string;
  market: keyof MarketType;
  active: boolean;
  latency: number;
  reliability: number;
}

export interface MarketDataSubscription {
  id: string;
  symbol: string;
  market: keyof MarketType;
  callback: (data: MarketData) => void;
  active: boolean;
  lastUpdate: Date;
}

export interface DataProviderConfig {
  stocks: {
    provider: 'ALPHA_VANTAGE' | 'IEX' | 'POLYGON';
    apiKey: string;
    rateLimit: number;
  };
  crypto: {
    provider: 'BINANCE' | 'COINBASE' | 'KRAKEN';
    apiKey?: string;
    rateLimit: number;
  };
  forex: {
    provider: 'OANDA' | 'FXCM' | 'FOREX_COM';
    apiKey: string;
    rateLimit: number;
  };
}

export class MarketDataProvider {
  private subscriptions: Map<string, MarketDataSubscription> = new Map();
  private dataFeeds: Map<string, DataFeed> = new Map();
  private config: DataProviderConfig;
  private websockets: Map<string, WebSocket> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 second

  constructor() {
    this.config = {
      stocks: {
        provider: 'POLYGON',
        apiKey: process.env.POLYGON_API_KEY || '',
        rateLimit: 5 // requests per second
      },
      crypto: {
        provider: 'BINANCE',
        rateLimit: 10
      },
      forex: {
        provider: 'OANDA',
        apiKey: process.env.OANDA_API_KEY || '',
        rateLimit: 3
      }
    };

    this.initializeDataFeeds();
  }

  /**
   * Initialize data feeds for all markets
   */
  private initializeDataFeeds(): void {
    this.dataFeeds.set('stocks', {
      id: 'stocks',
      name: 'Stock Market Data',
      market: 'STOCKS',
      active: false,
      latency: 0,
      reliability: 0
    });

    this.dataFeeds.set('crypto', {
      id: 'crypto',
      name: 'Cryptocurrency Data',
      market: 'CRYPTO',
      active: false,
      latency: 0,
      reliability: 0
    });

    this.dataFeeds.set('forex', {
      id: 'forex',
      name: 'Forex Market Data',
      market: 'FOREX',
      active: false,
      latency: 0,
      reliability: 0
    });
  }

  /**
   * Initialize the market data provider
   */
  async initialize(): Promise<void> {
    try {
      // Initialize connections to all market data providers
      await Promise.all([
        this.initializeStockDataFeed(),
        this.initializeCryptoDataFeed(),
        this.initializeForexDataFeed()
      ]);

      console.log('Market data provider initialized successfully');
    } catch (error) {
      console.error('Failed to initialize market data provider:', error);
      throw error;
    }
  }

  /**
   * Initialize stock market data feed
   */
  private async initializeStockDataFeed(): Promise<void> {
    try {
      const feed = this.dataFeeds.get('stocks')!;
      
      // Test connection to stock data provider
      const testSymbol = 'AAPL';
      const testData = await this.fetchStockData(testSymbol);
      
      if (testData) {
        feed.active = true;
        feed.reliability = 0.95;
        feed.latency = 100; // ms
        console.log('Stock data feed initialized');
      }
    } catch (error) {
      console.error('Failed to initialize stock data feed:', error);
    }
  }

  /**
   * Initialize cryptocurrency data feed
   */
  private async initializeCryptoDataFeed(): Promise<void> {
    try {
      const feed = this.dataFeeds.get('crypto')!;
      
      // Initialize Binance WebSocket connection
      await this.connectToBinanceWebSocket();
      
      feed.active = true;
      feed.reliability = 0.98;
      feed.latency = 50; // ms
      console.log('Crypto data feed initialized');
    } catch (error) {
      console.error('Failed to initialize crypto data feed:', error);
    }
  }

  /**
   * Initialize forex data feed
   */
  private async initializeForexDataFeed(): Promise<void> {
    try {
      const feed = this.dataFeeds.get('forex')!;
      
      // Test connection to forex data provider
      const testPair = 'EUR/USD';
      const testData = await this.fetchForexData(testPair);
      
      if (testData) {
        feed.active = true;
        feed.reliability = 0.92;
        feed.latency = 200; // ms
        console.log('Forex data feed initialized');
      }
    } catch (error) {
      console.error('Failed to initialize forex data feed:', error);
    }
  }

  /**
   * Subscribe to market data for a specific market
   */
  async subscribeToMarket(market: keyof MarketType, callback: (data: MarketData) => void): Promise<void> {
    const subscriptionId = `market_${market}_${Date.now()}`;
    
    const subscription: MarketDataSubscription = {
      id: subscriptionId,
      symbol: '*', // All symbols in market
      market,
      callback,
      active: true,
      lastUpdate: new Date()
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Start market-specific data streaming
    switch (market) {
      case 'STOCKS':
        await this.startStockMarketStream(callback);
        break;
      case 'CRYPTO':
        await this.startCryptoMarketStream(callback);
        break;
      case 'FOREX':
        await this.startForexMarketStream(callback);
        break;
    }

    console.log(`Subscribed to ${market} market data`);
  }

  /**
   * Subscribe to data for a specific symbol
   */
  async subscribeToSymbol(
    symbol: string,
    market: keyof MarketType,
    callback: (data: MarketData) => void
  ): Promise<void> {
    const subscriptionId = `symbol_${market}_${symbol}_${Date.now()}`;
    
    const subscription: MarketDataSubscription = {
      id: subscriptionId,
      symbol,
      market,
      callback,
      active: true,
      lastUpdate: new Date()
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Start symbol-specific data streaming
    switch (market) {
      case 'STOCKS':
        await this.subscribeToStockSymbol(symbol, callback);
        break;
      case 'CRYPTO':
        await this.subscribeToCryptoSymbol(symbol, callback);
        break;
      case 'FOREX':
        await this.subscribeToForexSymbol(symbol, callback);
        break;
    }

    console.log(`Subscribed to ${symbol} (${market}) data`);
  }

  /**
   * Start stock market data streaming
   */
  private async startStockMarketStream(callback: (data: MarketData) => void): Promise<void> {
    const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];
    
    // Poll stock data every 5 seconds (due to API rate limits)
    setInterval(async () => {
      for (const symbol of popularStocks) {
        try {
          const data = await this.fetchStockData(symbol);
          if (data) {
            callback(data);
          }
        } catch (error) {
          console.error(`Error fetching stock data for ${symbol}:`, error);
        }
      }
    }, 5000);
  }

  /**
   * Start crypto market data streaming
   */
  private async startCryptoMarketStream(callback: (data: MarketData) => void): Promise<void> {
    // This will be handled by the Binance WebSocket connection
    // The callback will be called from the WebSocket message handler
  }

  /**
   * Start forex market data streaming
   */
  private async startForexMarketStream(callback: (data: MarketData) => void): Promise<void> {
    const majorPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF'];
    
    // Poll forex data every 10 seconds
    setInterval(async () => {
      for (const pair of majorPairs) {
        try {
          const data = await this.fetchForexData(pair);
          if (data) {
            callback(data);
          }
        } catch (error) {
          console.error(`Error fetching forex data for ${pair}:`, error);
        }
      }
    }, 10000);
  }

  /**
   * Connect to Binance WebSocket for real-time crypto data
   */
  private async connectToBinanceWebSocket(): Promise<void> {
    const wsUrl = 'wss://stream.binance.com:9443/ws/!ticker@arr';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to Binance WebSocket');
      this.reconnectAttempts.set('binance', 0);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.processBinanceData(data);
      } catch (error) {
        console.error('Error processing Binance data:', error);
      }
    };

    ws.onclose = () => {
      console.log('Binance WebSocket connection closed');
      this.handleWebSocketReconnect('binance', () => this.connectToBinanceWebSocket());
    };

    ws.onerror = (error) => {
      console.error('Binance WebSocket error:', error);
    };

    this.websockets.set('binance', ws);
  }

  /**
   * Process Binance WebSocket data
   */
  private processBinanceData(data: any[]): void {
    if (!Array.isArray(data)) return;

    data.forEach(ticker => {
      if (ticker.s && ticker.s.endsWith('USDT')) {
        const marketData: MarketData = {
          symbol: ticker.s,
          market: 'CRYPTO',
          price: parseFloat(ticker.c),
          volume: parseFloat(ticker.v),
          high24h: parseFloat(ticker.h),
          low24h: parseFloat(ticker.l),
          change24h: parseFloat(ticker.P),
          timestamp: new Date(),
          ohlcv: this.generateOHLCVData(ticker)
        };

        this.notifySubscribers(marketData);
      }
    });
  }

  /**
   * Fetch stock data from API
   */
  private async fetchStockData(symbol: string): Promise<MarketData | null> {
    try {
      // Simulate API call (replace with actual API integration)
      const mockData: MarketData = {
        symbol,
        market: 'STOCKS',
        price: 150 + (Math.random() * 20 - 10), // Mock price
        volume: Math.floor(Math.random() * 1000000),
        high24h: 155 + (Math.random() * 10),
        low24h: 145 + (Math.random() * 10),
        change24h: (Math.random() * 6 - 3), // -3% to +3%
        timestamp: new Date(),
        ohlcv: this.generateMockOHLCVData()
      };

      return mockData;
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Fetch forex data from API
   */
  private async fetchForexData(pair: string): Promise<MarketData | null> {
    try {
      // Simulate API call (replace with actual API integration)
      const basePrice = pair === 'EUR/USD' ? 1.08 : 
                       pair === 'GBP/USD' ? 1.25 : 
                       pair === 'USD/JPY' ? 150 : 1.0;

      const mockData: MarketData = {
        symbol: pair,
        market: 'FOREX',
        price: basePrice + (Math.random() * 0.02 - 0.01), // Small forex movements
        volume: Math.floor(Math.random() * 100000),
        high24h: basePrice + (Math.random() * 0.01),
        low24h: basePrice - (Math.random() * 0.01),
        change24h: (Math.random() * 2 - 1), // -1% to +1%
        timestamp: new Date(),
        ohlcv: this.generateMockOHLCVData()
      };

      return mockData;
    } catch (error) {
      console.error(`Error fetching forex data for ${pair}:`, error);
      return null;
    }
  }

  /**
   * Subscribe to specific stock symbol
   */
  private async subscribeToStockSymbol(symbol: string, callback: (data: MarketData) => void): Promise<void> {
    // Poll specific stock every 2 seconds
    setInterval(async () => {
      const data = await this.fetchStockData(symbol);
      if (data) {
        callback(data);
      }
    }, 2000);
  }

  /**
   * Subscribe to specific crypto symbol
   */
  private async subscribeToCryptoSymbol(symbol: string, callback: (data: MarketData) => void): Promise<void> {
    // This will be handled by the existing Binance WebSocket
    // Filter messages for the specific symbol in processBinanceData
  }

  /**
   * Subscribe to specific forex symbol
   */
  private async subscribeToForexSymbol(symbol: string, callback: (data: MarketData) => void): Promise<void> {
    // Poll specific forex pair every 5 seconds
    setInterval(async () => {
      const data = await this.fetchForexData(symbol);
      if (data) {
        callback(data);
      }
    }, 5000);
  }

  /**
   * Generate OHLCV data from ticker data
   */
  private generateOHLCVData(ticker: any): MarketData['ohlcv'] {
    const price = parseFloat(ticker.c);
    const high = parseFloat(ticker.h);
    const low = parseFloat(ticker.l);
    const open = parseFloat(ticker.o);
    const volume = parseFloat(ticker.v);

    // Generate last 200 candles (mock data for technical analysis)
    const ohlcv = [];
    for (let i = 199; i >= 0; i--) {
      const variance = 0.02; // 2% variance
      const basePrice = price * (1 + (Math.random() * variance - variance/2));
      
      ohlcv.push({
        open: basePrice * (1 + (Math.random() * 0.01 - 0.005)),
        high: basePrice * (1 + Math.random() * 0.01),
        low: basePrice * (1 - Math.random() * 0.01),
        close: basePrice,
        volume: volume * (0.5 + Math.random())
      });
    }

    return ohlcv;
  }

  /**
   * Generate mock OHLCV data
   */
  private generateMockOHLCVData(): MarketData['ohlcv'] {
    const ohlcv = [];
    let basePrice = 100;

    for (let i = 0; i < 200; i++) {
      const variance = 0.02;
      const open = basePrice;
      const close = basePrice * (1 + (Math.random() * variance - variance/2));
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 1000000);

      ohlcv.push({ open, high, low, close, volume });
      basePrice = close;
    }

    return ohlcv;
  }

  /**
   * Notify all relevant subscribers of new market data
   */
  private notifySubscribers(data: MarketData): void {
    this.subscriptions.forEach(subscription => {
      if (subscription.active && 
          subscription.market === data.market &&
          (subscription.symbol === '*' || subscription.symbol === data.symbol)) {
        try {
          subscription.callback(data);
          subscription.lastUpdate = new Date();
        } catch (error) {
          console.error('Error in subscription callback:', error);
        }
      }
    });
  }

  /**
   * Handle WebSocket reconnection
   */
  private handleWebSocketReconnect(connectionId: string, reconnectFn: () => Promise<void>): void {
    const attempts = this.reconnectAttempts.get(connectionId) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      setTimeout(async () => {
        console.log(`Attempting to reconnect ${connectionId} (attempt ${attempts + 1})`);
        this.reconnectAttempts.set(connectionId, attempts + 1);
        
        try {
          await reconnectFn();
        } catch (error) {
          console.error(`Reconnection attempt ${attempts + 1} failed:`, error);
        }
      }, this.reconnectDelay * Math.pow(2, attempts)); // Exponential backoff
    } else {
      console.error(`Max reconnection attempts reached for ${connectionId}`);
    }
  }

  /**
   * Get historical market data
   */
  async getHistoricalData(
    symbol: string,
    timeframe: string,
    limit: number = 100
  ): Promise<MarketData[]> {
    // This is a simplified implementation
    // In a real application, this would fetch actual historical data
    const historicalData: MarketData[] = [];
    const now = new Date();
    
    for (let i = limit - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 60 * 1000)); // 1 minute intervals
      const basePrice = 100 + Math.random() * 50; // Mock price between 100-150
      
      historicalData.push({
        symbol,
        market: 'STOCKS', // Default to stocks for now
        price: basePrice,
        volume: Math.floor(Math.random() * 1000000),
        high24h: basePrice * 1.02,
        low24h: basePrice * 0.98,
        change24h: (Math.random() - 0.5) * 10,
        timestamp,
        ohlcv: [{
          open: basePrice * (0.99 + Math.random() * 0.02),
          high: basePrice * (1.005 + Math.random() * 0.015),
          low: basePrice * (0.985 + Math.random() * 0.015),
          close: basePrice,
          volume: Math.floor(Math.random() * 100000)
        }]
      });
    }
    
    return historicalData;
  }

  /**
   * Get data feed status
   */
  getDataFeedStatus(): DataFeed[] {
    return Array.from(this.dataFeeds.values());
  }

  /**
   * Get active subscriptions
   */
  getActiveSubscriptions(): MarketDataSubscription[] {
    return Array.from(this.subscriptions.values()).filter(sub => sub.active);
  }

  /**
   * Unsubscribe from market data
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.active = false;
      this.subscriptions.delete(subscriptionId);
      console.log(`Unsubscribed from ${subscriptionId}`);
    }
  }

  /**
   * Disconnect all data feeds
   */
  async disconnect(): Promise<void> {
    // Close all WebSocket connections
    this.websockets.forEach((ws, id) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });

    // Clear all subscriptions
    this.subscriptions.clear();
    this.websockets.clear();
    this.reconnectAttempts.clear();

    // Mark all feeds as inactive
    this.dataFeeds.forEach(feed => {
      feed.active = false;
    });

    console.log('Market data provider disconnected');
  }
}

export default MarketDataProvider;