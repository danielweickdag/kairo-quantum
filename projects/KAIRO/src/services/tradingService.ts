import axios from 'axios';
import toast from 'react-hot-toast';
import { errorHandler, handleNetworkError, handleTradingError, handleValidationError } from '@/lib/errorHandler';

// Market types supported by GainzAlgo integration
export type MarketType = 'STOCKS' | 'CRYPTO' | 'FOREX';
export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
export type SignalType = 'BUY' | 'SELL' | 'HOLD';

// GainzAlgo Signal Interface
export interface TradingSignal {
  id: string;
  symbol: string;
  marketType: MarketType;
  signalType: SignalType;
  confidence: number; // 0-100%
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timeFrame: TimeFrame;
  timestamp: string;
  riskRewardRatio: number;
  profitFactor?: number;
}

// Enhanced Trade Request with GainzAlgo features
export interface CreateTradeRequest {
  portfolioId: string;
  symbol: string;
  marketType: MarketType;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
  orderType?: 'MARKET' | 'LIMIT' | 'STOP';
  signalId?: string; // Reference to GainzAlgo signal
  timeFrame?: TimeFrame;
  brokerAccountId?: string; // Selected broker account for execution
  brokerConnectionId?: string; // Broker connection ID
}

// Enhanced Trade interface with GainzAlgo features
export interface Trade {
  id: string;
  symbol: string;
  userId: string;
  portfolioId: string;
  marketType: MarketType;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
  totalValue: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED';
  executedAt?: string;
  createdAt: string;
  signalId?: string;
  timeFrame?: TimeFrame;
  actualPnL?: number;
  winRate?: number;
  profitFactor?: number;
  portfolio?: {
    id: string;
    name: string;
  };
}

// Performance Tracking Interfaces
export interface PerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number; // percentage
  profitFactor: number;
  totalPnL: number;
  maxDrawdown: number;
  currentDrawdown: number;
  averageWin: number;
  averageLoss: number;
  riskRewardRatio: number;
}

export interface MarketPerformance {
  marketType: MarketType;
  metrics: PerformanceMetrics;
  signals: TradingSignal[];
  lastUpdated: string;
}

export interface TradesResponse {
  success: boolean;
  data: {
    trades: Trade[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateTradeResponse {
  success: boolean;
  data: {
    trade: Trade;
  };
}

class TradingService {
  /**
   * Create a new trade
   */
  async createTrade(tradeData: CreateTradeRequest): Promise<Trade> {
    try {
      const response = await axios.post<CreateTradeResponse>('/trades', tradeData);
      
      if (response.data.success) {
        toast.success(`${tradeData.side} order for ${tradeData.symbol} placed successfully!`);
        return response.data.data.trade;
      } else {
        throw new Error('Failed to create trade');
      }
    } catch (error: any) {
      const handledError = handleNetworkError(error, 'Trading Service - Create Trade');
      throw handledError;
    }
  }

  /**
   * Get user's trades with optional filters
   */
  async getTrades(params?: {
    page?: number;
    limit?: number;
    portfolioId?: string;
    symbol?: string;
    side?: 'BUY' | 'SELL';
    status?: 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED';
  }): Promise<TradesResponse['data']> {
    try {
      const response = await axios.get<TradesResponse>('/trades', { params });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to fetch trades');
      }
    } catch (error: any) {
      const handledError = handleNetworkError(error, 'Trading Service - Get Trades');
      throw handledError;
    }
  }

  /**
   * Get a specific trade by ID
   */
  async getTradeById(tradeId: string): Promise<Trade> {
    try {
      const response = await axios.get<CreateTradeResponse>(`/trades/${tradeId}`);
      
      if (response.data.success) {
        return response.data.data.trade;
      } else {
        throw new Error('Failed to fetch trade');
      }
    } catch (error: any) {
      const handledError = handleNetworkError(error, 'Trading Service - Get Trade By ID');
      throw handledError;
    }
  }

  /**
   * Cancel a pending trade
   */
  async cancelTrade(tradeId: string): Promise<Trade> {
    try {
      const response = await axios.put<CreateTradeResponse>(`/trades/${tradeId}/cancel`);
      
      if (response.data.success) {
        toast.success('Trade cancelled successfully!');
        return response.data.data.trade;
      } else {
        throw new Error('Failed to cancel trade');
      }
    } catch (error: any) {
      const handledError = handleNetworkError(error, 'Trading Service - Cancel Trade');
      throw handledError;
    }
  }

  /**
   * Validate trade data before submission
   */
  validateTradeData(tradeData: CreateTradeRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!tradeData.portfolioId) {
      const error = handleValidationError('Portfolio is required', 'Trade Validation');
      errors.push(error.message);
    }

    if (!tradeData.symbol) {
      const error = handleValidationError('Symbol is required', 'Trade Validation');
      errors.push(error.message);
    }

    if (!tradeData.side) {
      const error = handleValidationError('Order side (BUY/SELL) is required', 'Trade Validation');
      errors.push(error.message);
    }

    if (!tradeData.quantity || tradeData.quantity <= 0) {
      const error = handleValidationError('Quantity must be greater than 0', 'Trade Validation');
      errors.push(error.message);
    }

    if (!tradeData.price || tradeData.price <= 0) {
      const error = handleValidationError('Price must be greater than 0', 'Trade Validation');
      errors.push(error.message);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // GainzAlgo Integration Methods

  /**
   * Generate trading signals using GainzAlgo algorithm
   */
  async generateSignals(marketType: MarketType, timeFrame: TimeFrame, symbols?: string[]): Promise<TradingSignal[]> {
    try {
      const response = await axios.post('/trading/signals/generate', {
        marketType,
        timeFrame,
        symbols
      });
      
      if (response.data.success) {
        return response.data.data.signals;
      } else {
        throw new Error('Failed to generate signals');
      }
    } catch (error: any) {
      const handledError = handleNetworkError(error, 'Trading Service - Generate Signals');
      throw handledError;
    }
  }

  /**
   * Get active trading signals
   */
  async getActiveSignals(marketType?: MarketType): Promise<TradingSignal[]> {
    try {
      const params = marketType ? { marketType } : {};
      const response = await axios.get('/trading/signals/active', { params });
      
      if (response.data.success) {
        return response.data.data.signals;
      } else {
        throw new Error('Failed to fetch active signals');
      }
    } catch (error: any) {
      const handledError = handleNetworkError(error, 'Trading Service - Get Active Signals');
      throw handledError;
    }
  }

  /**
   * Calculate Stop Loss and Take Profit levels
   */
  calculateSLTP(entryPrice: number, signalType: SignalType, riskPercent: number = 2, rewardRatio: number = 2): { stopLoss: number; takeProfit: number } {
    const riskAmount = entryPrice * (riskPercent / 100);
    
    if (signalType === 'BUY') {
      const stopLoss = entryPrice - riskAmount;
      const takeProfit = entryPrice + (riskAmount * rewardRatio);
      return { stopLoss, takeProfit };
    } else {
      const stopLoss = entryPrice + riskAmount;
      const takeProfit = entryPrice - (riskAmount * rewardRatio);
      return { stopLoss, takeProfit };
    }
  }

  /**
   * Get performance metrics for a specific market or overall
   */
  async getPerformanceMetrics(marketType?: MarketType, timeRange?: string): Promise<PerformanceMetrics> {
    try {
      const params = { marketType, timeRange };
      const response = await axios.get('/trading/performance/metrics', { params });
      
      if (response.data.success) {
        return response.data.data.metrics;
      } else {
        throw new Error('Failed to fetch performance metrics');
      }
    } catch (error: any) {
      const handledError = handleNetworkError(error, 'Trading Service - Get Performance Metrics');
      throw handledError;
    }
  }

  /**
   * Get market-specific performance data
   */
  async getMarketPerformance(): Promise<MarketPerformance[]> {
    try {
      const response = await axios.get('/trading/performance/markets');
      
      if (response.data.success) {
        return response.data.data.markets;
      } else {
        throw new Error('Failed to fetch market performance');
      }
    } catch (error: any) {
      const handledError = handleNetworkError(error, 'Trading Service - Get Market Performance');
      throw handledError;
    }
  }

  /**
   * Calculate win rate from trades
   */
  calculateWinRate(trades: Trade[]): number {
    if (trades.length === 0) return 0;
    
    const executedTrades = trades.filter(trade => trade.status === 'EXECUTED' && trade.actualPnL !== undefined);
    if (executedTrades.length === 0) return 0;
    
    const winningTrades = executedTrades.filter(trade => (trade.actualPnL || 0) > 0);
    return (winningTrades.length / executedTrades.length) * 100;
  }

  /**
   * Calculate profit factor from trades
   */
  calculateProfitFactor(trades: Trade[]): number {
    const executedTrades = trades.filter(trade => trade.status === 'EXECUTED' && trade.actualPnL !== undefined);
    if (executedTrades.length === 0) return 0;
    
    const grossProfit = executedTrades
      .filter(trade => (trade.actualPnL || 0) > 0)
      .reduce((sum, trade) => sum + (trade.actualPnL || 0), 0);
    
    const grossLoss = Math.abs(executedTrades
      .filter(trade => (trade.actualPnL || 0) < 0)
      .reduce((sum, trade) => sum + (trade.actualPnL || 0), 0));
    
    return grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss;
  }

  /**
   * Calculate maximum drawdown
   */
  calculateMaxDrawdown(trades: Trade[]): number {
    const executedTrades = trades
      .filter(trade => trade.status === 'EXECUTED' && trade.actualPnL !== undefined)
      .sort((a, b) => new Date(a.executedAt || a.createdAt).getTime() - new Date(b.executedAt || b.createdAt).getTime());
    
    if (executedTrades.length === 0) return 0;
    
    let peak = 0;
    let maxDrawdown = 0;
    let runningPnL = 0;
    
    for (const trade of executedTrades) {
      runningPnL += trade.actualPnL || 0;
      
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown;
  }

  /**
   * Execute trade based on signal with automatic SL/TP
   */
  async executeSignalTrade(signal: TradingSignal, portfolioId: string, quantity: number, riskPercent: number = 2): Promise<Trade> {
    const { stopLoss, takeProfit } = this.calculateSLTP(signal.entryPrice, signal.signalType, riskPercent);
    
    const tradeData: CreateTradeRequest = {
      portfolioId,
      symbol: signal.symbol,
      marketType: signal.marketType,
      side: signal.signalType === 'BUY' ? 'BUY' : 'SELL',
      quantity,
      price: signal.entryPrice,
      stopLoss,
      takeProfit,
      signalId: signal.id,
      timeFrame: signal.timeFrame,
      orderType: 'MARKET'
    };
    
    return this.createTrade(tradeData);
  }
}

export const tradingService = new TradingService();
export default tradingService;