import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

interface NotificationData {
  type: string;
  data: any;
}

interface LivePrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
  bid?: number;
  ask?: number;
  high24h?: number;
  low24h?: number;
}

interface OrderBookData {
  symbol: string;
  bids: Array<{ price: number; quantity: number }>;
  asks: Array<{ price: number; quantity: number }>;
  timestamp: number;
}

interface TradeData {
  symbol: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

interface MarketDataSubscription {
  symbol: string;
  type: 'ticker' | 'orderbook' | 'trades';
  userId: string;
}

class WebSocketService extends EventEmitter {
  private io: SocketIOServer;
  private marketDataSubscriptions: Map<string, MarketDataSubscription[]> = new Map();
  private priceCache: Map<string, LivePrice> = new Map();
  private marketDataIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isLiveTradingEnabled = false;

  constructor(io: SocketIOServer) {
    super();
    this.io = io;
    this.setupSocketHandlers();
  }

  notifyUser(userId: string, notification: NotificationData): void {
    try {
      this.io.to(`user:${userId}`).emit('notification', notification);
      logger.info(`Notification sent to user ${userId}: ${notification.type}`);
    } catch (error) {
      logger.error('Error sending notification:', error);
    }
  }

  notifyPortfolio(portfolioId: string, notification: NotificationData): void {
    try {
      this.io.to(`portfolio:${portfolioId}`).emit('portfolio-update', notification);
      logger.info(`Portfolio notification sent: ${portfolioId}`);
    } catch (error) {
      logger.error('Error sending portfolio notification:', error);
    }
  }

  broadcastMarketData(symbol: string, data: any): void {
    try {
      this.io.to(`market:${symbol}`).emit('market-update', data);
    } catch (error) {
      logger.error('Error broadcasting market data:', error);
    }
  }

  getUserConnections(userId: string): number {
    const room = this.io.sockets.adapter.rooms.get(`user:${userId}`);
    return room ? room.size : 0;
  }

  isUserOnline(userId: string): boolean {
    return this.getUserConnections(userId) > 0;
  }

  // Live Trading Methods
  enableLiveTrading(): void {
    this.isLiveTradingEnabled = true;
    logger.info('Live trading enabled');
    this.emit('liveTradingEnabled');
  }

  disableLiveTrading(): void {
    this.isLiveTradingEnabled = false;
    logger.info('Live trading disabled');
    this.emit('liveTradingDisabled');
  }

  isLiveTradingActive(): boolean {
    return this.isLiveTradingEnabled;
  }

  // Market Data Methods
  subscribeToMarketData(userId: string, symbol: string, type: 'ticker' | 'orderbook' | 'trades'): void {
    const subscription: MarketDataSubscription = { symbol, type, userId };
    
    if (!this.marketDataSubscriptions.has(symbol)) {
      this.marketDataSubscriptions.set(symbol, []);
    }
    
    this.marketDataSubscriptions.get(symbol)!.push(subscription);
    
    // Join user to market data room
    const userSockets = this.io.sockets.sockets;
    userSockets.forEach(socket => {
      if (socket.data.userId === userId) {
        socket.join(`market:${symbol}:${type}`);
      }
    });
    
    logger.info(`User ${userId} subscribed to ${type} data for ${symbol}`);
    
    // Start market data feed if not already running
    this.startMarketDataFeed(symbol, type);
  }

  unsubscribeFromMarketData(userId: string, symbol: string, type?: 'ticker' | 'orderbook' | 'trades'): void {
    if (!this.marketDataSubscriptions.has(symbol)) return;
    
    const subscriptions = this.marketDataSubscriptions.get(symbol)!;
    const filtered = subscriptions.filter(sub => 
      !(sub.userId === userId && (!type || sub.type === type))
    );
    
    if (filtered.length === 0) {
      this.marketDataSubscriptions.delete(symbol);
      this.stopMarketDataFeed(symbol);
    } else {
      this.marketDataSubscriptions.set(symbol, filtered);
    }
    
    // Remove user from market data rooms
    const userSockets = this.io.sockets.sockets;
    userSockets.forEach(socket => {
      if (socket.data.userId === userId) {
        if (type) {
          socket.leave(`market:${symbol}:${type}`);
        } else {
          socket.leave(`market:${symbol}:ticker`);
          socket.leave(`market:${symbol}:orderbook`);
          socket.leave(`market:${symbol}:trades`);
        }
      }
    });
    
    logger.info(`User ${userId} unsubscribed from ${type || 'all'} data for ${symbol}`);
  }

  getCurrentPrice(symbol: string): LivePrice | null {
    return this.priceCache.get(symbol) || null;
  }

  getAllPrices(): LivePrice[] {
    return Array.from(this.priceCache.values());
  }

  // Broadcast live trade execution
  broadcastTradeExecution(userId: string, tradeData: any): void {
    try {
      this.io.to(`user:${userId}`).emit('trade-executed', tradeData);
      this.io.to(`portfolio:${tradeData.portfolioId}`).emit('portfolio-trade', tradeData);
      logger.info(`Trade execution broadcasted for user ${userId}`);
    } catch (error) {
      logger.error('Error broadcasting trade execution:', error);
    }
  }

  // Broadcast position updates
  broadcastPositionUpdate(userId: string, positionData: any): void {
    try {
      this.io.to(`user:${userId}`).emit('position-update', positionData);
      logger.info(`Position update broadcasted for user ${userId}`);
    } catch (error) {
      logger.error('Error broadcasting position update:', error);
    }
  }

  // Broadcast P&L updates
  broadcastPnLUpdate(userId: string, pnlData: any): void {
    try {
      this.io.to(`user:${userId}`).emit('pnl-update', pnlData);
      logger.info(`P&L update broadcasted for user ${userId}`);
    } catch (error) {
      logger.error('Error broadcasting P&L update:', error);
    }
  }

  // Setup socket event handlers
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);
      
      socket.on('authenticate', (data) => {
        socket.data.userId = data.userId;
        socket.join(`user:${data.userId}`);
        logger.info(`User ${data.userId} authenticated`);
      });
      
      socket.on('subscribe-market-data', (data) => {
        const { symbol, type } = data;
        if (socket.data.userId) {
          this.subscribeToMarketData(socket.data.userId, symbol, type);
        }
      });
      
      socket.on('unsubscribe-market-data', (data) => {
        const { symbol, type } = data;
        if (socket.data.userId) {
          this.unsubscribeFromMarketData(socket.data.userId, symbol, type);
        }
      });
      
      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  // Start market data feed for a symbol
  private startMarketDataFeed(symbol: string, type: 'ticker' | 'orderbook' | 'trades'): void {
    const feedKey = `${symbol}:${type}`;
    
    if (this.marketDataIntervals.has(feedKey)) {
      return; // Already running
    }
    
    const interval = setInterval(() => {
      let data: any;
      
      switch (type) {
        case 'ticker':
          data = this.generateTickerData(symbol);
          this.priceCache.set(symbol, data);
          break;
        case 'orderbook':
          data = this.generateOrderBookData(symbol);
          break;
        case 'trades':
          data = this.generateTradeData(symbol);
          break;
      }
      
      // Broadcast to all subscribers
      this.io.to(`market:${symbol}:${type}`).emit('market-data', {
        symbol,
        type,
        data,
        timestamp: Date.now()
      });
      
    }, type === 'ticker' ? 1000 : type === 'orderbook' ? 500 : 2000);
    
    this.marketDataIntervals.set(feedKey, interval);
    logger.info(`Started market data feed for ${feedKey}`);
  }

  // Stop market data feed
  private stopMarketDataFeed(symbol: string): void {
    ['ticker', 'orderbook', 'trades'].forEach(type => {
      const feedKey = `${symbol}:${type}`;
      const interval = this.marketDataIntervals.get(feedKey);
      
      if (interval) {
        clearInterval(interval);
        this.marketDataIntervals.delete(feedKey);
        logger.info(`Stopped market data feed for ${feedKey}`);
      }
    });
  }

  // Generate simulated ticker data
  private generateTickerData(symbol: string): LivePrice {
    const basePrice = this.getBasePrice(symbol);
    const volatility = 0.02; // 2% volatility
    const change = (Math.random() - 0.5) * volatility * basePrice;
    const newPrice = Math.max(0.01, basePrice + change);
    
    const currentPrice = this.priceCache.get(symbol);
    const previousPrice = currentPrice?.price || basePrice;
    
    const priceChange = newPrice - previousPrice;
    const changePercent = (priceChange / previousPrice) * 100;
    
    return {
      symbol,
      price: Number(newPrice.toFixed(2)),
      change: Number(priceChange.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
      timestamp: Date.now(),
      bid: Number((newPrice - 0.01).toFixed(2)),
      ask: Number((newPrice + 0.01).toFixed(2)),
      high24h: Number((newPrice * 1.05).toFixed(2)),
      low24h: Number((newPrice * 0.95).toFixed(2))
    };
  }

  // Generate simulated order book data
  private generateOrderBookData(symbol: string): OrderBookData {
    const currentPrice = this.getCurrentPrice(symbol)?.price || this.getBasePrice(symbol);
    
    const bids = [];
    const asks = [];
    
    // Generate 10 bid levels
    for (let i = 0; i < 10; i++) {
      bids.push({
        price: Number((currentPrice - (i + 1) * 0.01).toFixed(2)),
        quantity: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    // Generate 10 ask levels
    for (let i = 0; i < 10; i++) {
      asks.push({
        price: Number((currentPrice + (i + 1) * 0.01).toFixed(2)),
        quantity: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    return {
      symbol,
      bids,
      asks,
      timestamp: Date.now()
    };
  }

  // Generate simulated trade data
  private generateTradeData(symbol: string): TradeData {
    const currentPrice = this.getCurrentPrice(symbol)?.price || this.getBasePrice(symbol);
    const priceVariation = (Math.random() - 0.5) * 0.02 * currentPrice;
    
    return {
      symbol,
      price: Number((currentPrice + priceVariation).toFixed(2)),
      quantity: Math.floor(Math.random() * 100) + 1,
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      timestamp: Date.now()
    };
  }

  // Get base price for symbol (simulated)
  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'AAPL': 175.80,
      'TSLA': 245.30,
      'MSFT': 420.50,
      'GOOGL': 2800.00,
      'AMZN': 3200.00,
      'BTC': 52000.00,
      'ETH': 3200.50,
      'EURUSD': 1.0875,
      'GBPUSD': 1.2650,
      'USDJPY': 149.50
    };
    
    return basePrices[symbol] || 100.00;
  }

  // Cleanup resources
  destroy(): void {
    this.marketDataIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    
    this.marketDataIntervals.clear();
    this.marketDataSubscriptions.clear();
    this.priceCache.clear();
    
    this.removeAllListeners();
  }
}

export { WebSocketService };
export type { NotificationData };