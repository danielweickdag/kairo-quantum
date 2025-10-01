'use client';

import React from 'react';
import { logger } from '@/lib/logger';

// Live Market Data Service for TradingView-style functionality

export interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
  lastUpdate: number;
}

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdate: number;
}

export interface Trade {
  id: string;
  symbol: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface MarketStats {
  symbol: string;
  volume24h: number;
  volumeChange24h: number;
  trades24h: number;
  high24h: number;
  low24h: number;
  openPrice: number;
  closePrice: number;
  lastUpdate: number;
}

export interface FuturesData {
  symbol: string;
  contractMonth: string;
  expirationDate: string;
  openInterest: number;
  settlementPrice: number;
  marginRequirement: number;
  tickSize: number;
  contractSize: number;
  lastTradingDay: string;
}

export interface OptionsData {
  symbol: string;
  underlying: string;
  strike: number;
  expiration: string;
  optionType: 'call' | 'put';
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  openInterest: number;
  timeToExpiration: number;
  intrinsicValue: number;
  timeValue: number;
}

export interface DerivativeInstrument {
  type: 'spot' | 'futures' | 'options';
  symbol: string;
  marketData: MarketTicker;
  futuresData?: FuturesData;
  optionsData?: OptionsData;
}

class LiveMarketService {
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private marketData: Map<string, MarketTicker> = new Map();
  private candlestickData: Map<string, CandlestickData[]> = new Map();
  private orderBooks: Map<string, OrderBook> = new Map();
  private recentTrades: Map<string, Trade[]> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isConnected = false;

  // Supported trading pairs
  private readonly SUPPORTED_SYMBOLS = [
    // Cryptocurrencies
    'BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT', 'LINKUSDT',
    'MATICUSDT', 'AVAXUSDT', 'ATOMUSDT', 'NEARUSDT', 'FTMUSDT', 'SANDUSDT',
    'MANAUSDT', 'CHZUSDT', 'ENJUSDT', 'GALAUSDT',
    // Major Indices
    'SPY', 'QQQ', 'DJI', 'IXIC', 'RUT', 'VTI', 'IWM',
    // Futures
    'ES', 'NQ', 'YM', 'RTY', 'CL', 'GC', 'SI', 'NG', 'ZB', 'ZN', 'ZF', 'ZT',
    'BTC-PERP', 'ETH-PERP', 'SOL-PERP', 'ADA-PERP',
    // Options
    'SPY-C-430-2024-03-15', 'SPY-P-430-2024-03-15', 'QQQ-C-370-2024-03-15', 'QQQ-P-370-2024-03-15',
    'AAPL-C-180-2024-03-15', 'AAPL-P-180-2024-03-15', 'TSLA-C-200-2024-03-15', 'TSLA-P-200-2024-03-15',
    'BTC-C-50000-2024-03-29', 'BTC-P-50000-2024-03-29', 'ETH-C-3000-2024-03-29', 'ETH-P-3000-2024-03-29'
  ];

  constructor() {
    this.initializeMarketData();
    this.startDataSimulation();
  }

  // Initialize mock market data
  private initializeMarketData(): void {
    const baseData = {
      // Cryptocurrencies
      BTCUSDT: { basePrice: 45000, volatility: 0.02 },
      ETHUSDT: { basePrice: 2800, volatility: 0.025 },
      ADAUSDT: { basePrice: 0.45, volatility: 0.03 },
      SOLUSDT: { basePrice: 98, volatility: 0.035 },
      DOTUSDT: { basePrice: 6.5, volatility: 0.03 },
      LINKUSDT: { basePrice: 14.2, volatility: 0.028 },
      MATICUSDT: { basePrice: 0.85, volatility: 0.032 },
      AVAXUSDT: { basePrice: 35, volatility: 0.03 },
      ATOMUSDT: { basePrice: 9.8, volatility: 0.029 },
      NEARUSDT: { basePrice: 2.1, volatility: 0.034 },
      FTMUSDT: { basePrice: 0.32, volatility: 0.036 },
      SANDUSDT: { basePrice: 0.48, volatility: 0.038 },
      MANAUSDT: { basePrice: 0.42, volatility: 0.037 },
      CHZUSDT: { basePrice: 0.089, volatility: 0.04 },
      ENJUSDT: { basePrice: 0.28, volatility: 0.035 },
      GALAUSDT: { basePrice: 0.035, volatility: 0.042 },
      // Major Indices
      SPY: { basePrice: 428.50, volatility: 0.015 },
      QQQ: { basePrice: 365.20, volatility: 0.018 },
      DJI: { basePrice: 37689.54, volatility: 0.012 },
      IXIC: { basePrice: 14845.73, volatility: 0.020 },
      RUT: { basePrice: 2045.32, volatility: 0.025 },
      VTI: { basePrice: 245.30, volatility: 0.014 },
      IWM: { basePrice: 198.75, volatility: 0.022 },
      // Futures
      ES: { basePrice: 4285.50, volatility: 0.018 },
      NQ: { basePrice: 14850.25, volatility: 0.022 },
      YM: { basePrice: 37650.00, volatility: 0.015 },
      RTY: { basePrice: 2045.80, volatility: 0.028 },
      CL: { basePrice: 78.45, volatility: 0.035 },
      GC: { basePrice: 2025.60, volatility: 0.025 },
      SI: { basePrice: 24.85, volatility: 0.040 },
      NG: { basePrice: 2.85, volatility: 0.055 },
      ZB: { basePrice: 112.25, volatility: 0.012 },
      ZN: { basePrice: 108.75, volatility: 0.015 },
      ZF: { basePrice: 105.50, volatility: 0.010 },
      ZT: { basePrice: 102.25, volatility: 0.008 },
      'BTC-PERP': { basePrice: 45200.00, volatility: 0.025 },
      'ETH-PERP': { basePrice: 2820.00, volatility: 0.030 },
      'SOL-PERP': { basePrice: 99.50, volatility: 0.040 },
      'ADA-PERP': { basePrice: 0.46, volatility: 0.035 },
      // Options
      'SPY-C-430-2024-03-15': { basePrice: 8.50, volatility: 0.45 },
      'SPY-P-430-2024-03-15': { basePrice: 9.25, volatility: 0.42 },
      'QQQ-C-370-2024-03-15': { basePrice: 12.75, volatility: 0.38 },
      'QQQ-P-370-2024-03-15': { basePrice: 17.50, volatility: 0.40 },
      'AAPL-C-180-2024-03-15': { basePrice: 5.25, volatility: 0.35 },
      'AAPL-P-180-2024-03-15': { basePrice: 6.80, volatility: 0.37 },
      'TSLA-C-200-2024-03-15': { basePrice: 15.60, volatility: 0.55 },
      'TSLA-P-200-2024-03-15': { basePrice: 18.90, volatility: 0.52 },
      'BTC-C-50000-2024-03-29': { basePrice: 2850.00, volatility: 0.65 },
      'BTC-P-50000-2024-03-29': { basePrice: 7650.00, volatility: 0.68 },
      'ETH-C-3000-2024-03-29': { basePrice: 285.50, volatility: 0.60 },
      'ETH-P-3000-2024-03-29': { basePrice: 465.25, volatility: 0.62 }
    };

    this.SUPPORTED_SYMBOLS.forEach(symbol => {
      const config = baseData[symbol as keyof typeof baseData];
      if (config) {
        const currentPrice = config.basePrice * (1 + (Math.random() - 0.5) * 0.1);
        const change = (Math.random() - 0.5) * config.basePrice * 0.05;
        const changePercent = (change / (currentPrice - change)) * 100;
        
        this.marketData.set(symbol, {
          symbol,
          price: currentPrice,
          change,
          changePercent,
          volume: Math.random() * 10000000 + 1000000,
          high24h: currentPrice * (1 + Math.random() * 0.05),
          low24h: currentPrice * (1 - Math.random() * 0.05),
          marketCap: currentPrice * (Math.random() * 1000000000 + 100000000),
          lastUpdate: Date.now()
        });

        // Initialize candlestick data
        this.initializeCandlestickData(symbol, currentPrice, config.volatility);
        
        // Initialize order book
        this.initializeOrderBook(symbol, currentPrice);
        
        // Initialize recent trades
        this.initializeRecentTrades(symbol, currentPrice);
      }
    });
  }

  private initializeCandlestickData(symbol: string, basePrice: number, volatility: number): void {
    const candles: CandlestickData[] = [];
    let currentPrice = basePrice;
    const now = Date.now();
    
    // Generate 100 historical candles (1 minute each)
    for (let i = 99; i >= 0; i--) {
      const time = now - (i * 60 * 1000);
      const open = currentPrice;
      const priceChange = (Math.random() - 0.5) * basePrice * volatility;
      const close = Math.max(0.01, open + priceChange);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.random() * 1000000 + 10000;
      
      candles.push({
        time,
        open,
        high,
        low,
        close,
        volume
      });
      
      currentPrice = close;
    }
    
    this.candlestickData.set(symbol, candles);
  }

  private initializeOrderBook(symbol: string, currentPrice: number): void {
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];
    
    // Generate 20 bid levels
    for (let i = 1; i <= 20; i++) {
      const price = currentPrice - (i * currentPrice * 0.001);
      const size = Math.random() * 10 + 0.1;
      bids.push({
        price,
        size,
        total: size * price
      });
    }
    
    // Generate 20 ask levels
    for (let i = 1; i <= 20; i++) {
      const price = currentPrice + (i * currentPrice * 0.001);
      const size = Math.random() * 10 + 0.1;
      asks.push({
        price,
        size,
        total: size * price
      });
    }
    
    this.orderBooks.set(symbol, {
      symbol,
      bids,
      asks,
      lastUpdate: Date.now()
    });
  }

  private initializeRecentTrades(symbol: string, currentPrice: number): void {
    const trades: Trade[] = [];
    const now = Date.now();
    
    // Generate 50 recent trades
    for (let i = 0; i < 50; i++) {
      trades.push({
        id: `trade_${symbol}_${i}`,
        symbol,
        price: currentPrice * (1 + (Math.random() - 0.5) * 0.01),
        size: Math.random() * 5 + 0.01,
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        timestamp: now - (i * 1000)
      });
    }
    
    this.recentTrades.set(symbol, trades.reverse());
  }

  // Start real-time data simulation
  private startDataSimulation(): void {
    this.isConnected = true;
    
    // Update market data every 1 second
    const marketUpdateInterval = setInterval(() => {
      this.updateMarketData();
    }, 1000);
    
    // Update candlestick data every 5 seconds
    const candleUpdateInterval = setInterval(() => {
      this.updateCandlestickData();
    }, 5000);
    
    // Update order books every 500ms
    const orderBookUpdateInterval = setInterval(() => {
      this.updateOrderBooks();
    }, 500);
    
    // Add new trades every 2 seconds
    const tradesUpdateInterval = setInterval(() => {
      this.updateRecentTrades();
    }, 2000);
    
    this.updateIntervals.set('market', marketUpdateInterval);
    this.updateIntervals.set('candles', candleUpdateInterval);
    this.updateIntervals.set('orderbook', orderBookUpdateInterval);
    this.updateIntervals.set('trades', tradesUpdateInterval);
  }

  private updateMarketData(): void {
    this.marketData.forEach((ticker, symbol) => {
      const volatility = this.getVolatilityForSymbol(symbol);
      const priceChange = (Math.random() - 0.5) * ticker.price * volatility * 0.1;
      const newPrice = Math.max(0.01, ticker.price + priceChange);
      const change = newPrice - ticker.price;
      const changePercent = (change / ticker.price) * 100;
      
      const updatedTicker: MarketTicker = {
        ...ticker,
        price: newPrice,
        change: ticker.change + change,
        changePercent: ticker.changePercent + changePercent,
        volume: ticker.volume + Math.random() * 10000,
        high24h: Math.max(ticker.high24h, newPrice),
        low24h: Math.min(ticker.low24h, newPrice),
        lastUpdate: Date.now()
      };
      
      this.marketData.set(symbol, updatedTicker);
      this.notifySubscribers(`ticker:${symbol}`, updatedTicker);
    });
  }

  private updateCandlestickData(): void {
    this.candlestickData.forEach((candles, symbol) => {
      const ticker = this.marketData.get(symbol);
      if (!ticker) return;
      
      const lastCandle = candles[candles.length - 1];
      const now = Date.now();
      
      // If last candle is older than 1 minute, create a new one
      if (now - lastCandle.time > 60000) {
        const newCandle: CandlestickData = {
          time: now,
          open: lastCandle.close,
          high: ticker.price,
          low: ticker.price,
          close: ticker.price,
          volume: Math.random() * 100000 + 1000
        };
        
        candles.push(newCandle);
        
        // Keep only last 200 candles
        if (candles.length > 200) {
          candles.shift();
        }
      } else {
        // Update current candle
        lastCandle.close = ticker.price;
        lastCandle.high = Math.max(lastCandle.high, ticker.price);
        lastCandle.low = Math.min(lastCandle.low, ticker.price);
        lastCandle.volume += Math.random() * 1000;
      }
      
      this.notifySubscribers(`candles:${symbol}`, candles.slice(-100));
    });
  }

  private updateOrderBooks(): void {
    this.orderBooks.forEach((orderBook, symbol) => {
      const ticker = this.marketData.get(symbol);
      if (!ticker) return;
      
      // Simulate order book changes
      const updatedBids = orderBook.bids.map(bid => ({
        ...bid,
        size: Math.max(0.01, bid.size + (Math.random() - 0.5) * 0.5),
        price: ticker.price * (1 - Math.random() * 0.01)
      }));
      
      const updatedAsks = orderBook.asks.map(ask => ({
        ...ask,
        size: Math.max(0.01, ask.size + (Math.random() - 0.5) * 0.5),
        price: ticker.price * (1 + Math.random() * 0.01)
      }));
      
      const updatedOrderBook: OrderBook = {
        symbol,
        bids: updatedBids.sort((a, b) => b.price - a.price),
        asks: updatedAsks.sort((a, b) => a.price - b.price),
        lastUpdate: Date.now()
      };
      
      this.orderBooks.set(symbol, updatedOrderBook);
      this.notifySubscribers(`orderbook:${symbol}`, updatedOrderBook);
    });
  }

  private updateRecentTrades(): void {
    this.recentTrades.forEach((trades, symbol) => {
      const ticker = this.marketData.get(symbol);
      if (!ticker) return;
      
      // Add new trade
      const newTrade: Trade = {
        id: `trade_${symbol}_${Date.now()}`,
        symbol,
        price: ticker.price * (1 + (Math.random() - 0.5) * 0.005),
        size: Math.random() * 2 + 0.01,
        side: Math.random() > 0.5 ? 'buy' : 'sell',
        timestamp: Date.now()
      };
      
      trades.push(newTrade);
      
      // Keep only last 100 trades
      if (trades.length > 100) {
        trades.shift();
      }
      
      this.notifySubscribers(`trades:${symbol}`, trades.slice(-20));
    });
  }

  private getVolatilityForSymbol(symbol: string): number {
    const volatilityMap: { [key: string]: number } = {
      'BTCUSDT': 0.02,
      'ETHUSDT': 0.025,
      'ADAUSDT': 0.03,
      'SOLUSDT': 0.035,
      'DOTUSDT': 0.03,
      'LINKUSDT': 0.028,
      'MATICUSDT': 0.032,
      'AVAXUSDT': 0.03,
      'ATOMUSDT': 0.029,
      'NEARUSDT': 0.034,
      'FTMUSDT': 0.036,
      'SANDUSDT': 0.038,
      'MANAUSDT': 0.037,
      'CHZUSDT': 0.04,
      'ENJUSDT': 0.035,
      'GALAUSDT': 0.042
    };
    
    return volatilityMap[symbol] || 0.03;
  }

  private notifySubscribers(channel: string, data: any): void {
    const subscribers = this.subscribers.get(channel);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          logger.error('Failed to notify market data subscriber', error, 'LiveMarketService');
        }
      });
    }
  }

  // Public API methods
  public subscribe(channel: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    
    this.subscribers.get(channel)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(channel);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(channel);
        }
      }
    };
  }

  public getMarketData(symbol?: string): MarketTicker | MarketTicker[] | null {
    if (symbol) {
      return this.marketData.get(symbol) || null;
    }
    return Array.from(this.marketData.values());
  }

  public getCandlestickData(symbol: string, limit = 100): CandlestickData[] {
    const candles = this.candlestickData.get(symbol) || [];
    return candles.slice(-limit);
  }

  public getOrderBook(symbol: string): OrderBook | null {
    return this.orderBooks.get(symbol) || null;
  }

  public getRecentTrades(symbol: string, limit = 20): Trade[] {
    const trades = this.recentTrades.get(symbol) || [];
    return trades.slice(-limit);
  }

  public getSupportedSymbols(): string[] {
    return [...this.SUPPORTED_SYMBOLS];
  }

  public isConnectedToMarket(): boolean {
    return this.isConnected;
  }

  public connect(): void {
    if (!this.isConnected) {
      this.initializeMarketData();
      this.startDataSimulation();
      logger.info('Live market service connected', 'LiveMarketService');
    }
  }

  public disconnect(): void {
    this.isConnected = false;
    this.updateIntervals.forEach(interval => clearInterval(interval));
    this.updateIntervals.clear();
    this.subscribers.clear();
    logger.info('Live market service disconnected', 'LiveMarketService');
  }

  // Market analysis helpers
  public getMarketStats(symbol: string): MarketStats | null {
    const ticker = this.marketData.get(symbol);
    const candles = this.candlestickData.get(symbol);
    
    if (!ticker || !candles || candles.length === 0) {
      return null;
    }
    
    const last24hCandles = candles.filter(c => Date.now() - c.time <= 24 * 60 * 60 * 1000);
    const volume24h = last24hCandles.reduce((sum, c) => sum + c.volume, 0);
    const trades24h = last24hCandles.length;
    
    return {
      symbol,
      volume24h,
      volumeChange24h: Math.random() * 20 - 10, // Mock data
      trades24h,
      high24h: ticker.high24h,
      low24h: ticker.low24h,
      openPrice: last24hCandles[0]?.open || ticker.price,
      closePrice: ticker.price,
      lastUpdate: Date.now()
    };
  }

  public calculateTechnicalIndicators(symbol: string): any {
    const candles = this.getCandlestickData(symbol, 50);
    if (candles.length < 20) return null;
    
    // Simple Moving Average (20 periods)
    const sma20 = candles.slice(-20).reduce((sum, c) => sum + c.close, 0) / 20;
    
    // Exponential Moving Average (12 periods)
    let ema12 = candles[0].close;
    const multiplier = 2 / (12 + 1);
    for (let i = 1; i < candles.length; i++) {
      ema12 = (candles[i].close * multiplier) + (ema12 * (1 - multiplier));
    }
    
    // RSI (14 periods)
    const rsiPeriod = 14;
    if (candles.length >= rsiPeriod + 1) {
      let gains = 0;
      let losses = 0;
      
      for (let i = candles.length - rsiPeriod; i < candles.length; i++) {
        const change = candles[i].close - candles[i - 1].close;
        if (change > 0) {
          gains += change;
        } else {
          losses += Math.abs(change);
        }
      }
      
      const avgGain = gains / rsiPeriod;
      const avgLoss = losses / rsiPeriod;
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      
      return {
        sma20,
        ema12,
        rsi,
        lastUpdate: Date.now()
      };
    }
    
    return {
      sma20,
      ema12,
      rsi: null,
      lastUpdate: Date.now()
    };
  }

  // Futures-specific methods
  public getFuturesData(symbol: string): FuturesData | null {
    if (!this.isFuturesSymbol(symbol)) return null;
    
    const contractMonth = this.extractContractMonth(symbol);
    const expirationDate = this.calculateExpirationDate(symbol);
    
    return {
      symbol,
      contractMonth,
      expirationDate,
      openInterest: Math.floor(Math.random() * 100000) + 50000,
      settlementPrice: this.marketData.get(symbol)?.price || 0,
      marginRequirement: this.calculateMarginRequirement(symbol),
      tickSize: this.getTickSize(symbol),
      contractSize: this.getContractSize(symbol),
      lastTradingDay: this.calculateLastTradingDay(symbol)
    };
  }

  // Options-specific methods
  public getOptionsData(symbol: string): OptionsData | null {
    if (!this.isOptionsSymbol(symbol)) return null;
    
    const { underlying, strike, expiration, optionType } = this.parseOptionsSymbol(symbol);
    const currentPrice = this.marketData.get(symbol)?.price || 0;
    const underlyingPrice = this.getUnderlyingPrice(underlying);
    
    const timeToExpiration = this.calculateTimeToExpiration(expiration);
    const impliedVolatility = 0.2 + Math.random() * 0.6; // 20-80% IV
    
    const greeks = this.calculateGreeks(currentPrice, underlyingPrice, strike, timeToExpiration, impliedVolatility, optionType);
    
    return {
      symbol,
      underlying,
      strike,
      expiration,
      optionType,
      impliedVolatility,
      ...greeks,
      openInterest: Math.floor(Math.random() * 10000) + 1000,
      timeToExpiration,
      intrinsicValue: this.calculateIntrinsicValue(underlyingPrice, strike, optionType),
      timeValue: currentPrice - this.calculateIntrinsicValue(underlyingPrice, strike, optionType)
    };
  }

  public getDerivativeInstrument(symbol: string): DerivativeInstrument | null {
    const marketData = this.marketData.get(symbol);
    if (!marketData) return null;
    
    let type: 'spot' | 'futures' | 'options' = 'spot';
    let futuresData: FuturesData | undefined;
    let optionsData: OptionsData | undefined;
    
    if (this.isFuturesSymbol(symbol)) {
      type = 'futures';
      futuresData = this.getFuturesData(symbol) || undefined;
    } else if (this.isOptionsSymbol(symbol)) {
      type = 'options';
      optionsData = this.getOptionsData(symbol) || undefined;
    }
    
    return {
      type,
      symbol,
      marketData,
      futuresData,
      optionsData
    };
  }

  // Helper methods
  private isFuturesSymbol(symbol: string): boolean {
    return symbol.includes('-PERP') || ['ES', 'NQ', 'YM', 'RTY', 'CL', 'GC', 'SI', 'NG', 'ZB', 'ZN', 'ZF', 'ZT'].includes(symbol);
  }

  private isOptionsSymbol(symbol: string): boolean {
    return symbol.includes('-C-') || symbol.includes('-P-');
  }

  private extractContractMonth(symbol: string): string {
    if (symbol.includes('-PERP')) return 'Perpetual';
    const date = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[date.getMonth()]}${date.getFullYear().toString().slice(-2)}`;
  }

  private calculateExpirationDate(symbol: string): string {
    if (symbol.includes('-PERP')) return 'N/A';
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  }

  private calculateMarginRequirement(symbol: string): number {
    const price = this.marketData.get(symbol)?.price || 0;
    const marginRates: { [key: string]: number } = {
      'ES': 0.05, 'NQ': 0.05, 'YM': 0.05, 'RTY': 0.06,
      'CL': 0.08, 'GC': 0.04, 'SI': 0.06, 'NG': 0.10
    };
    return price * (marginRates[symbol] || 0.05);
  }

  private getTickSize(symbol: string): number {
    const tickSizes: { [key: string]: number } = {
      'ES': 0.25, 'NQ': 0.25, 'YM': 1.0, 'RTY': 0.10,
      'CL': 0.01, 'GC': 0.10, 'SI': 0.005, 'NG': 0.001
    };
    return tickSizes[symbol] || 0.01;
  }

  private getContractSize(symbol: string): number {
    const contractSizes: { [key: string]: number } = {
      'ES': 50, 'NQ': 20, 'YM': 5, 'RTY': 50,
      'CL': 1000, 'GC': 100, 'SI': 5000, 'NG': 10000
    };
    return contractSizes[symbol] || 1;
  }

  private calculateLastTradingDay(symbol: string): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(15); // Typically 3rd Friday, simplified to 15th
    return date.toISOString().split('T')[0];
  }

  private parseOptionsSymbol(symbol: string): { underlying: string; strike: number; expiration: string; optionType: 'call' | 'put' } {
    const parts = symbol.split('-');
    return {
      underlying: parts[0],
      optionType: parts[1].toLowerCase() === 'c' ? 'call' : 'put',
      strike: parseFloat(parts[2]),
      expiration: parts[3]
    };
  }

  private getUnderlyingPrice(underlying: string): number {
    // Map options underlying to actual symbols
    const underlyingMap: { [key: string]: string } = {
      'SPY': 'SPY', 'QQQ': 'QQQ', 'AAPL': 'AAPL', 'TSLA': 'TSLA',
      'BTC': 'BTCUSDT', 'ETH': 'ETHUSDT'
    };
    const actualSymbol = underlyingMap[underlying] || underlying;
    return this.marketData.get(actualSymbol)?.price || 0;
  }

  private calculateTimeToExpiration(expiration: string): number {
    const expirationDate = new Date(expiration);
    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    return Math.max(0, diffTime / (1000 * 60 * 60 * 24 * 365)); // Years
  }

  private calculateGreeks(optionPrice: number, underlyingPrice: number, strike: number, timeToExpiration: number, iv: number, optionType: 'call' | 'put') {
    // Simplified Black-Scholes Greeks calculation
    const riskFreeRate = 0.05; // 5% risk-free rate
    const d1 = (Math.log(underlyingPrice / strike) + (riskFreeRate + 0.5 * iv * iv) * timeToExpiration) / (iv * Math.sqrt(timeToExpiration));
    const d2 = d1 - iv * Math.sqrt(timeToExpiration);
    
    const normalCDF = (x: number) => 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    const normalPDF = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    
    const delta = optionType === 'call' ? normalCDF(d1) : normalCDF(d1) - 1;
    const gamma = normalPDF(d1) / (underlyingPrice * iv * Math.sqrt(timeToExpiration));
    const theta = optionType === 'call' 
      ? -(underlyingPrice * normalPDF(d1) * iv) / (2 * Math.sqrt(timeToExpiration)) - riskFreeRate * strike * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(d2)
      : -(underlyingPrice * normalPDF(d1) * iv) / (2 * Math.sqrt(timeToExpiration)) + riskFreeRate * strike * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(-d2);
    const vega = underlyingPrice * normalPDF(d1) * Math.sqrt(timeToExpiration);
    const rho = optionType === 'call'
      ? strike * timeToExpiration * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(d2)
      : -strike * timeToExpiration * Math.exp(-riskFreeRate * timeToExpiration) * normalCDF(-d2);
    
    return { delta, gamma, theta: theta / 365, vega: vega / 100, rho: rho / 100 };
  }

  private calculateIntrinsicValue(underlyingPrice: number, strike: number, optionType: 'call' | 'put'): number {
    if (optionType === 'call') {
      return Math.max(0, underlyingPrice - strike);
    } else {
      return Math.max(0, strike - underlyingPrice);
    }
  }

  private erf(x: number): number {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  }
}

// Export singleton instance
export const liveMarketService = new LiveMarketService();
export default liveMarketService;

// React hook for easy integration
export function useMarketData(symbol?: string) {
  const [data, setData] = React.useState<MarketTicker | MarketTicker[] | null>(null);
  
  React.useEffect(() => {
    const updateData = () => {
      setData(liveMarketService.getMarketData(symbol));
    };
    
    updateData();
    
    const channel = symbol ? `ticker:${symbol}` : 'ticker:all';
    const unsubscribe = liveMarketService.subscribe(channel, updateData);
    
    return unsubscribe;
  }, [symbol]);
  
  return data;
}

export function useCandlestickData(symbol: string, limit = 100) {
  const [data, setData] = React.useState<CandlestickData[]>([]);
  
  React.useEffect(() => {
    const updateData = (newData: CandlestickData[]) => {
      setData(newData);
    };
    
    setData(liveMarketService.getCandlestickData(symbol, limit));
    
    const unsubscribe = liveMarketService.subscribe(`candles:${symbol}`, updateData);
    
    return unsubscribe;
  }, [symbol, limit]);
  
  return data;
}

export function useOrderBook(symbol: string) {
  const [data, setData] = React.useState<OrderBook | null>(null);
  
  React.useEffect(() => {
    const updateData = (newData: OrderBook) => {
      setData(newData);
    };
    
    setData(liveMarketService.getOrderBook(symbol));
    
    const unsubscribe = liveMarketService.subscribe(`orderbook:${symbol}`, updateData);
    
    return unsubscribe;
  }, [symbol]);
  
  return data;
}

export function useRecentTrades(symbol: string, limit = 20) {
  const [data, setData] = React.useState<Trade[]>([]);
  
  React.useEffect(() => {
    const updateData = (newData: Trade[]) => {
      setData(newData);
    };
    
    setData(liveMarketService.getRecentTrades(symbol, limit));
    
    const unsubscribe = liveMarketService.subscribe(`trades:${symbol}`, updateData);
    
    return unsubscribe;
  }, [symbol, limit]);
  
  return data;
}

// Futures and Options hooks
export function useFuturesData(symbol: string) {
  const [futuresData, setFuturesData] = React.useState<FuturesData | null>(null);

  React.useEffect(() => {
    const data = liveMarketService.getFuturesData(symbol);
    setFuturesData(data);

    const unsubscribe = liveMarketService.subscribe(`futures:${symbol}`, (newData: FuturesData) => {
      setFuturesData(newData);
    });

    return unsubscribe;
  }, [symbol]);

  return futuresData;
}

export function useOptionsData(symbol: string) {
  const [optionsData, setOptionsData] = React.useState<OptionsData | null>(null);

  React.useEffect(() => {
    const data = liveMarketService.getOptionsData(symbol);
    setOptionsData(data);

    const unsubscribe = liveMarketService.subscribe(`options:${symbol}`, (newData: OptionsData) => {
      setOptionsData(newData);
    });

    return unsubscribe;
  }, [symbol]);

  return optionsData;
}

export function useDerivativeInstrument(symbol: string) {
  const [instrument, setInstrument] = React.useState<DerivativeInstrument | null>(null);

  React.useEffect(() => {
    const data = liveMarketService.getDerivativeInstrument(symbol);
    setInstrument(data);

    const unsubscribe = liveMarketService.subscribe(`instrument:${symbol}`, (newData: DerivativeInstrument) => {
      setInstrument(newData);
    });

    return unsubscribe;
  }, [symbol]);

  return instrument;
}