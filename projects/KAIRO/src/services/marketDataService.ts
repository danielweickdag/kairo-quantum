'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  bid: number;
  ask: number;
  spread: number;
  marketCap?: number;
  sector?: string;
  type: 'stock' | 'crypto' | 'forex' | 'commodity';
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdate: number;
}

export interface Trade {
  price: number;
  quantity: number;
  time: string;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

// Market symbols configuration
export const MARKET_SYMBOLS = {
  crypto: [
    { symbol: 'BTCUSDT', name: 'Bitcoin', basePrice: 43000 },
    { symbol: 'ETHUSDT', name: 'Ethereum', basePrice: 2600 },
    { symbol: 'LINKUSDT', name: 'Chainlink', basePrice: 21.5 },
    { symbol: 'ADAUSDT', name: 'Cardano', basePrice: 0.65 },
    { symbol: 'DOTUSDT', name: 'Polkadot', basePrice: 8.5 },
    { symbol: 'SOLUSDT', name: 'Solana', basePrice: 95 },
    { symbol: 'MATICUSDT', name: 'Polygon', basePrice: 1.1 },
    { symbol: 'AVAXUSDT', name: 'Avalanche', basePrice: 42 }
  ],
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 185 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 140 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', basePrice: 380 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 155 },
    { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 240 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', basePrice: 480 },
    { symbol: 'META', name: 'Meta Platforms', basePrice: 350 },
    { symbol: 'NFLX', name: 'Netflix Inc.', basePrice: 450 }
  ],
  forex: [
    { symbol: 'EURUSD', name: 'Euro/US Dollar', basePrice: 1.08 },
    { symbol: 'GBPUSD', name: 'British Pound/US Dollar', basePrice: 1.27 },
    { symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', basePrice: 150 },
    { symbol: 'AUDUSD', name: 'Australian Dollar/US Dollar', basePrice: 0.66 },
    { symbol: 'USDCAD', name: 'US Dollar/Canadian Dollar', basePrice: 1.35 }
  ]
};

class MarketDataService {
  private subscribers: Map<string, Set<(data: MarketData) => void>> = new Map();
  private orderBookSubscribers: Map<string, Set<(data: OrderBook) => void>> = new Map();
  private tradeSubscribers: Map<string, Set<(data: Trade[]) => void>> = new Map();
  private marketData: Map<string, MarketData> = new Map();
  private orderBooks: Map<string, OrderBook> = new Map();
  private recentTrades: Map<string, Trade[]> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isConnected = false;

  constructor() {
    this.initializeMarketData();
  }

  private initializeMarketData() {
    // Initialize crypto data
    MARKET_SYMBOLS.crypto.forEach(({ symbol, name, basePrice }) => {
      this.marketData.set(symbol, {
        symbol,
        name,
        price: basePrice + (Math.random() - 0.5) * basePrice * 0.1,
        change: (Math.random() - 0.5) * basePrice * 0.05,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.random() * 10000000 + 1000000,
        high24h: basePrice * (1 + Math.random() * 0.1),
        low24h: basePrice * (1 - Math.random() * 0.1),
        bid: basePrice * (1 - Math.random() * 0.001),
        ask: basePrice * (1 + Math.random() * 0.001),
        spread: basePrice * Math.random() * 0.002,
        type: 'crypto'
      });
      
      this.initializeOrderBook(symbol);
      this.initializeRecentTrades(symbol);
    });

    // Initialize stock data
    MARKET_SYMBOLS.stocks.forEach(({ symbol, name, basePrice }) => {
      this.marketData.set(symbol, {
        symbol,
        name,
        price: basePrice + (Math.random() - 0.5) * basePrice * 0.05,
        change: (Math.random() - 0.5) * basePrice * 0.03,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.random() * 50000000 + 5000000,
        high24h: basePrice * (1 + Math.random() * 0.05),
        low24h: basePrice * (1 - Math.random() * 0.05),
        bid: basePrice * (1 - Math.random() * 0.0005),
        ask: basePrice * (1 + Math.random() * 0.0005),
        spread: basePrice * Math.random() * 0.001,
        marketCap: basePrice * Math.random() * 1000000000 + 100000000000,
        sector: ['Technology', 'Consumer', 'Healthcare', 'Finance'][Math.floor(Math.random() * 4)],
        type: 'stock'
      });
      
      this.initializeOrderBook(symbol);
      this.initializeRecentTrades(symbol);
    });

    // Initialize forex data
    MARKET_SYMBOLS.forex.forEach(({ symbol, name, basePrice }) => {
      this.marketData.set(symbol, {
        symbol,
        name,
        price: basePrice + (Math.random() - 0.5) * basePrice * 0.02,
        change: (Math.random() - 0.5) * basePrice * 0.01,
        changePercent: (Math.random() - 0.5) * 2,
        volume: Math.random() * 100000000 + 10000000,
        high24h: basePrice * (1 + Math.random() * 0.02),
        low24h: basePrice * (1 - Math.random() * 0.02),
        bid: basePrice * (1 - Math.random() * 0.0001),
        ask: basePrice * (1 + Math.random() * 0.0001),
        spread: basePrice * Math.random() * 0.0002,
        type: 'forex'
      });
      
      this.initializeOrderBook(symbol);
      this.initializeRecentTrades(symbol);
    });
  }

  private initializeOrderBook(symbol: string) {
    const marketData = this.marketData.get(symbol);
    if (!marketData) return;

    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];
    
    // Generate order book data
    for (let i = 0; i < 10; i++) {
      const bidPrice = marketData.price * (1 - (i + 1) * 0.001);
      const askPrice = marketData.price * (1 + (i + 1) * 0.001);
      const bidQuantity = Math.random() * 1000 + 100;
      const askQuantity = Math.random() * 1000 + 100;
      
      bids.push({
        price: bidPrice,
        quantity: bidQuantity,
        total: bidPrice * bidQuantity
      });
      
      asks.push({
        price: askPrice,
        quantity: askQuantity,
        total: askPrice * askQuantity
      });
    }

    this.orderBooks.set(symbol, {
      bids: bids.sort((a, b) => b.price - a.price),
      asks: asks.sort((a, b) => a.price - b.price),
      lastUpdate: Date.now()
    });
  }

  private initializeRecentTrades(symbol: string) {
    const marketData = this.marketData.get(symbol);
    if (!marketData) return;

    const trades: Trade[] = [];
    const now = Date.now();
    
    for (let i = 0; i < 20; i++) {
      const timestamp = now - i * 1000 * Math.random() * 60;
      const price = marketData.price * (1 + (Math.random() - 0.5) * 0.01);
      const quantity = Math.random() * 100 + 10;
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      
      trades.push({
        price,
        quantity,
        time: new Date(timestamp).toLocaleTimeString(),
        side,
        timestamp
      });
    }

    this.recentTrades.set(symbol, trades.sort((a, b) => b.timestamp - a.timestamp));
  }

  connect() {
    if (this.isConnected) return;
    
    this.isConnected = true;
    
    // Start real-time updates for all symbols
    Array.from(this.marketData.keys()).forEach(symbol => {
      this.startRealTimeUpdates(symbol);
    });
  }

  disconnect() {
    this.isConnected = false;
    
    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }

  private startRealTimeUpdates(symbol: string) {
    // Price updates every 1-3 seconds
    const priceInterval = setInterval(() => {
      this.updateMarketData(symbol);
    }, 1000 + Math.random() * 2000);
    
    // Order book updates every 2-5 seconds
    const orderBookInterval = setInterval(() => {
      this.updateOrderBook(symbol);
    }, 2000 + Math.random() * 3000);
    
    // Trade updates every 3-8 seconds
    const tradeInterval = setInterval(() => {
      this.addNewTrade(symbol);
    }, 3000 + Math.random() * 5000);
    
    this.intervals.set(`${symbol}_price`, priceInterval);
    this.intervals.set(`${symbol}_orderbook`, orderBookInterval);
    this.intervals.set(`${symbol}_trades`, tradeInterval);
  }

  private updateMarketData(symbol: string) {
    const data = this.marketData.get(symbol);
    if (!data) return;

    const volatility = data.type === 'crypto' ? 0.02 : data.type === 'stock' ? 0.01 : 0.005;
    const priceChange = (Math.random() - 0.5) * data.price * volatility;
    const newPrice = Math.max(0.001, data.price + priceChange);
    
    const updatedData: MarketData = {
      ...data,
      price: newPrice,
      change: data.change + priceChange * 0.1,
      changePercent: ((newPrice - (data.price - data.change)) / (data.price - data.change)) * 100,
      volume: data.volume + Math.random() * 100000,
      bid: newPrice * (1 - Math.random() * 0.001),
      ask: newPrice * (1 + Math.random() * 0.001)
    };
    
    updatedData.spread = updatedData.ask - updatedData.bid;
    
    this.marketData.set(symbol, updatedData);
    
    // Notify subscribers
    const symbolSubscribers = this.subscribers.get(symbol);
    if (symbolSubscribers) {
      symbolSubscribers.forEach(callback => callback(updatedData));
    }
  }

  private updateOrderBook(symbol: string) {
    const orderBook = this.orderBooks.get(symbol);
    const marketData = this.marketData.get(symbol);
    if (!orderBook || !marketData) return;

    // Update a few random entries
    const updateCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < updateCount; i++) {
      // Update bids
      const bidIndex = Math.floor(Math.random() * orderBook.bids.length);
      if (orderBook.bids[bidIndex]) {
        orderBook.bids[bidIndex].quantity += (Math.random() - 0.5) * 100;
        orderBook.bids[bidIndex].quantity = Math.max(1, orderBook.bids[bidIndex].quantity);
        orderBook.bids[bidIndex].total = orderBook.bids[bidIndex].price * orderBook.bids[bidIndex].quantity;
      }
      
      // Update asks
      const askIndex = Math.floor(Math.random() * orderBook.asks.length);
      if (orderBook.asks[askIndex]) {
        orderBook.asks[askIndex].quantity += (Math.random() - 0.5) * 100;
        orderBook.asks[askIndex].quantity = Math.max(1, orderBook.asks[askIndex].quantity);
        orderBook.asks[askIndex].total = orderBook.asks[askIndex].price * orderBook.asks[askIndex].quantity;
      }
    }

    orderBook.lastUpdate = Date.now();
    
    // Notify subscribers
    const subscribers = this.orderBookSubscribers.get(symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(orderBook));
    }
  }

  private addNewTrade(symbol: string) {
    const trades = this.recentTrades.get(symbol);
    const marketData = this.marketData.get(symbol);
    if (!trades || !marketData) return;

    const newTrade: Trade = {
      price: marketData.price * (1 + (Math.random() - 0.5) * 0.005),
      quantity: Math.random() * 100 + 10,
      time: new Date().toLocaleTimeString(),
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      timestamp: Date.now()
    };

    trades.unshift(newTrade);
    if (trades.length > 50) {
      trades.pop();
    }

    // Notify subscribers
    const subscribers = this.tradeSubscribers.get(symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback([...trades]));
    }
  }

  // Public API
  subscribe(symbol: string, callback: (data: MarketData) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol)!.add(callback);
    
    // Send initial data
    const data = this.marketData.get(symbol);
    if (data) {
      callback(data);
    }
    
    return () => {
      const symbolSubscribers = this.subscribers.get(symbol);
      if (symbolSubscribers) {
        symbolSubscribers.delete(callback);
      }
    };
  }

  subscribeOrderBook(symbol: string, callback: (data: OrderBook) => void) {
    if (!this.orderBookSubscribers.has(symbol)) {
      this.orderBookSubscribers.set(symbol, new Set());
    }
    this.orderBookSubscribers.get(symbol)!.add(callback);
    
    // Send initial data
    const data = this.orderBooks.get(symbol);
    if (data) {
      callback(data);
    }
    
    return () => {
      const subscribers = this.orderBookSubscribers.get(symbol);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  subscribeTrades(symbol: string, callback: (data: Trade[]) => void) {
    if (!this.tradeSubscribers.has(symbol)) {
      this.tradeSubscribers.set(symbol, new Set());
    }
    this.tradeSubscribers.get(symbol)!.add(callback);
    
    // Send initial data
    const data = this.recentTrades.get(symbol);
    if (data) {
      callback([...data]);
    }
    
    return () => {
      const subscribers = this.tradeSubscribers.get(symbol);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  getMarketData(symbol: string): MarketData | undefined {
    return this.marketData.get(symbol);
  }

  getOrderBook(symbol: string): OrderBook | undefined {
    return this.orderBooks.get(symbol);
  }

  getRecentTrades(symbol: string): Trade[] {
    return this.recentTrades.get(symbol) || [];
  }

  getAllSymbols(): string[] {
    return Array.from(this.marketData.keys());
  }

  searchSymbols(query: string): MarketData[] {
    const results: MarketData[] = [];
    const lowerQuery = query.toLowerCase();
    
    this.marketData.forEach(data => {
      if (data.symbol.toLowerCase().includes(lowerQuery) || 
          data.name.toLowerCase().includes(lowerQuery)) {
        results.push(data);
      }
    });
    
    return results;
  }
}

// Singleton instance
const marketDataService = new MarketDataService();

// React hooks
export const useMarketData = (symbol: string) => {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = marketDataService.subscribe(symbol, (newData) => {
      setData(newData);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [symbol]);

  return { data, isLoading };
};

export const useOrderBook = (symbol: string) => {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = marketDataService.subscribeOrderBook(symbol, (newData) => {
      setOrderBook(newData);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [symbol]);

  return { orderBook, isLoading };
};

export const useTrades = (symbol: string) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = marketDataService.subscribeTrades(symbol, (newTrades) => {
      setTrades(newTrades);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [symbol]);

  return { trades, isLoading };
};

export const useMarketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    marketDataService.connect();
    setIsConnected(true);
  }, []);

  const disconnect = useCallback(() => {
    marketDataService.disconnect();
    setIsConnected(false);
  }, []);

  useEffect(() => {
    // Auto-connect on mount
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { isConnected, connect, disconnect };
};

export default marketDataService;