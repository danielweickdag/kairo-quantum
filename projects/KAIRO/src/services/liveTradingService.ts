'use client';

import { useState, useEffect, useCallback } from 'react';
import { errorHandler, handleTradingError, handleNetworkError } from '@/lib/errorHandler';

// Trading interfaces
export interface TradingAccount {
  id: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  currency: string;
  leverage: number;
}

export interface TradingPosition {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
  swap: number;
  commission: number;
  openTime: Date;
  stopLoss?: number;
  takeProfit?: number;
}

export interface TradingOrder {
  id: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  size: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  timestamp: Date;
  fillPrice?: number;
  commission?: number;
}

export interface OrderRequest {
  symbol: string;
  type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  size: number;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage?: number;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  action: 'buy' | 'sell' | 'close';
  confidence: number;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  reasoning: string;
  timestamp: Date;
}

class LiveTradingService {
  private account: TradingAccount;
  private positions: Map<string, TradingPosition> = new Map();
  private orders: Map<string, TradingOrder> = new Map();
  private signals: TradingSignal[] = [];
  private subscribers: Set<() => void> = new Set();
  private priceSubscribers: Map<string, Set<(price: number) => void>> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    // Initialize demo account
    this.account = {
      id: 'demo-account-001',
      balance: 10000,
      equity: 10000,
      margin: 0,
      freeMargin: 10000,
      marginLevel: 0,
      currency: 'USD',
      leverage: 100
    };

    this.initializeConnection();
    this.startPriceUpdates();
    this.generateTradingSignals();
  }

  private initializeConnection() {
    // Simulate connection to trading server
    setTimeout(() => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifySubscribers();
    }, 1000);
  }

  private startPriceUpdates() {
    // Simulate real-time price updates
    setInterval(() => {
      if (!this.isConnected) return;

      // Update position prices and PnL
      this.positions.forEach(position => {
        const priceChange = (Math.random() - 0.5) * 0.01; // ±0.5% change
        position.currentPrice = position.currentPrice * (1 + priceChange);
        
        // Calculate PnL
        const priceDiff = position.currentPrice - position.entryPrice;
        const multiplier = position.side === 'long' ? 1 : -1;
        position.pnl = priceDiff * multiplier * position.size;
        position.pnlPercent = (priceDiff / position.entryPrice) * multiplier * 100;

        // Update account equity
        this.updateAccountEquity();

        // Notify price subscribers
        const symbolSubscribers = this.priceSubscribers.get(position.symbol);
        if (symbolSubscribers) {
          symbolSubscribers.forEach(callback => callback(position.currentPrice));
        }
      });

      this.notifySubscribers();
    }, 1000);
  }

  private updateAccountEquity() {
    let totalPnL = 0;
    this.positions.forEach(position => {
      totalPnL += position.pnl;
    });
    
    this.account.equity = this.account.balance + totalPnL;
    this.account.freeMargin = this.account.equity - this.account.margin;
    
    if (this.account.margin > 0) {
      this.account.marginLevel = (this.account.equity / this.account.margin) * 100;
    }
  }

  private generateTradingSignals() {
    const symbols = ['BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'USDJPY'];
    
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance to generate signal
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const action = Math.random() > 0.5 ? 'buy' : 'sell';
        const confidence = 60 + Math.random() * 35; // 60-95% confidence
        const basePrice = this.getMarketPrice(symbol);
        
        const signal: TradingSignal = {
          id: `signal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          symbol,
          action,
          confidence,
          entryPrice: basePrice,
          stopLoss: action === 'buy' ? basePrice * 0.98 : basePrice * 1.02,
          takeProfit: action === 'buy' ? basePrice * 1.04 : basePrice * 0.96,
          reasoning: this.generateSignalReasoning(symbol, action, confidence),
          timestamp: new Date()
        };
        
        this.signals.unshift(signal);
        if (this.signals.length > 20) {
          this.signals = this.signals.slice(0, 20);
        }
        
        this.notifySubscribers();
      }
    }, 5000); // Check every 5 seconds
  }

  private generateSignalReasoning(symbol: string, action: string, confidence: number): string {
    const reasons = [
      `Technical analysis shows strong ${action === 'buy' ? 'bullish' : 'bearish'} momentum on ${symbol}`,
      `RSI indicates ${action === 'buy' ? 'oversold' : 'overbought'} conditions for ${symbol}`,
      `Moving average crossover suggests ${action === 'buy' ? 'upward' : 'downward'} trend for ${symbol}`,
      `Support/resistance levels favor ${action === 'buy' ? 'long' : 'short'} position on ${symbol}`,
      `Volume analysis confirms ${action === 'buy' ? 'buying' : 'selling'} pressure on ${symbol}`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private getMarketPrice(symbol: string): number {
    // Simulate market prices
    const basePrices: { [key: string]: number } = {
      'BTCUSD': 45000,
      'ETHUSD': 2800,
      'EURUSD': 1.0850,
      'GBPUSD': 1.2650,
      'USDJPY': 148.50
    };
    
    const basePrice = basePrices[symbol] || 1.0000;
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    return basePrice * (1 + variation);
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  // Public API methods
  async placeOrder(orderRequest: OrderRequest): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      if (!this.isConnected) {
        throw new Error('Not connected to trading server');
      }

      // Validate order
      const validation = this.validateOrder(orderRequest);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const currentPrice = this.getMarketPrice(orderRequest.symbol);
      
      const order: TradingOrder = {
        id: orderId,
        symbol: orderRequest.symbol,
        type: orderRequest.type,
        side: orderRequest.side,
        size: orderRequest.size,
        price: orderRequest.price,
        status: 'pending',
        timestamp: new Date()
      };

      this.orders.set(orderId, order);

      // Simulate order execution
      setTimeout(() => {
        this.executeOrder(orderId, orderRequest);
      }, Math.random() * 2000 + 500); // 0.5-2.5 seconds

      this.notifySubscribers();
      return { success: true, orderId };
    } catch (error) {
      const handledError = handleTradingError((error as Error).message, { orderRequest }, 'Live Trading - Place Order');
      return { success: false, error: handledError.message };
    }
  }

  private validateOrder(orderRequest: OrderRequest): { valid: boolean; error?: string } {
    // Check account balance
    const requiredMargin = this.calculateRequiredMargin(orderRequest);
    if (requiredMargin > this.account.freeMargin) {
      const error = handleTradingError('Insufficient margin', { requiredMargin, freeMargin: this.account.freeMargin }, 'Order Validation');
      return { valid: false, error: error.message };
    }

    // Check minimum size
    if (orderRequest.size < 0.01) {
      const error = handleTradingError('Minimum order size is 0.01', { size: orderRequest.size }, 'Order Validation');
      return { valid: false, error: error.message };
    }

    // Check maximum size
    if (orderRequest.size > 100) {
      const error = handleTradingError('Maximum order size is 100', { size: orderRequest.size }, 'Order Validation');
      return { valid: false, error: error.message };
    }

    return { valid: true };
  }

  private calculateRequiredMargin(orderRequest: OrderRequest): number {
    const currentPrice = this.getMarketPrice(orderRequest.symbol);
    const notionalValue = orderRequest.size * currentPrice;
    const leverage = orderRequest.leverage || this.account.leverage;
    return notionalValue / leverage;
  }

  private executeOrder(orderId: string, orderRequest: OrderRequest) {
    const order = this.orders.get(orderId);
    if (!order) return;

    const currentPrice = this.getMarketPrice(orderRequest.symbol);
    const executionPrice = orderRequest.type === 'market' ? currentPrice : (orderRequest.price || currentPrice);
    
    // Update order status
    order.status = 'filled';
    order.fillPrice = executionPrice;
    order.commission = orderRequest.size * executionPrice * 0.0001; // 0.01% commission

    // Create position
    const positionId = `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const side = orderRequest.side === 'buy' ? 'long' : 'short';
    
    const position: TradingPosition = {
      id: positionId,
      symbol: orderRequest.symbol,
      side,
      size: orderRequest.size,
      entryPrice: executionPrice,
      currentPrice: executionPrice,
      pnl: 0,
      pnlPercent: 0,
      margin: this.calculateRequiredMargin(orderRequest),
      swap: 0,
      commission: order.commission,
      openTime: new Date(),
      stopLoss: orderRequest.stopLoss,
      takeProfit: orderRequest.takeProfit
    };

    this.positions.set(positionId, position);
    
    // Update account
    this.account.margin += position.margin;
    this.account.balance -= order.commission;
    this.updateAccountEquity();
    
    this.notifySubscribers();
  }

  async closePosition(positionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const position = this.positions.get(positionId);
      if (!position) {
        throw new Error('Position not found');
      }

      // Create closing order
      const closingSide = position.side === 'long' ? 'sell' : 'buy';
      const currentPrice = this.getMarketPrice(position.symbol);
      const commission = position.size * currentPrice * 0.0001;
      
      // Update account
      this.account.balance += position.pnl - commission;
      this.account.margin -= position.margin;
      this.updateAccountEquity();
      
      // Remove position
      this.positions.delete(positionId);
      
      this.notifySubscribers();
      return { success: true };
    } catch (error) {
      const handledError = handleTradingError((error as Error).message, { positionId }, 'Live Trading - Close Position');
      return { success: false, error: handledError.message };
    }
  }

  async modifyPosition(positionId: string, stopLoss?: number, takeProfit?: number): Promise<{ success: boolean; error?: string }> {
    try {
      const position = this.positions.get(positionId);
      if (!position) {
        throw new Error('Position not found');
      }

      if (stopLoss !== undefined) {
        position.stopLoss = stopLoss;
      }
      if (takeProfit !== undefined) {
        position.takeProfit = takeProfit;
      }
      
      this.notifySubscribers();
      return { success: true };
    } catch (error) {
      const handledError = handleTradingError((error as Error).message, { positionId, stopLoss, takeProfit }, 'Live Trading - Modify Position');
      return { success: false, error: handledError.message };
    }
  }

  // Getters
  getAccount(): TradingAccount {
    return { ...this.account };
  }

  getPositions(): TradingPosition[] {
    return Array.from(this.positions.values());
  }

  getOrders(): TradingOrder[] {
    return Array.from(this.orders.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getSignals(): TradingSignal[] {
    return [...this.signals];
  }

  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  // Subscription methods
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  subscribeToPrices(symbol: string, callback: (price: number) => void): () => void {
    if (!this.priceSubscribers.has(symbol)) {
      this.priceSubscribers.set(symbol, new Set());
    }
    this.priceSubscribers.get(symbol)!.add(callback);
    
    return () => {
      const symbolSubscribers = this.priceSubscribers.get(symbol);
      if (symbolSubscribers) {
        symbolSubscribers.delete(callback);
        if (symbolSubscribers.size === 0) {
          this.priceSubscribers.delete(symbol);
        }
      }
    };
  }
}

// Singleton instance
const liveTradingService = new LiveTradingService();
export default liveTradingService;

// React hooks
export function useLiveTrading() {
  const [account, setAccount] = useState<TradingAccount>(liveTradingService.getAccount());
  const [positions, setPositions] = useState<TradingPosition[]>(liveTradingService.getPositions());
  const [orders, setOrders] = useState<TradingOrder[]>(liveTradingService.getOrders());
  const [signals, setSignals] = useState<TradingSignal[]>(liveTradingService.getSignals());
  const [isConnected, setIsConnected] = useState<boolean>(liveTradingService.isConnectedToServer());

  useEffect(() => {
    const unsubscribe = liveTradingService.subscribe(() => {
      setAccount(liveTradingService.getAccount());
      setPositions(liveTradingService.getPositions());
      setOrders(liveTradingService.getOrders());
      setSignals(liveTradingService.getSignals());
      setIsConnected(liveTradingService.isConnectedToServer());
    });

    return unsubscribe;
  }, []);

  const placeOrder = useCallback(async (orderRequest: OrderRequest) => {
    return await liveTradingService.placeOrder(orderRequest);
  }, []);

  const closePosition = useCallback(async (positionId: string) => {
    return await liveTradingService.closePosition(positionId);
  }, []);

  const modifyPosition = useCallback(async (positionId: string, stopLoss?: number, takeProfit?: number) => {
    return await liveTradingService.modifyPosition(positionId, stopLoss, takeProfit);
  }, []);

  return {
    account,
    positions,
    orders,
    signals,
    isConnected,
    placeOrder,
    closePosition,
    modifyPosition
  };
}

export function useLivePrice(symbol: string) {
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = liveTradingService.subscribeToPrices(symbol, setPrice);
    return unsubscribe;
  }, [symbol]);

  return price;
}