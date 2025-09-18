import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import { WebSocketService } from './websocketService';
import OrderExecutionService, { Position } from './orderExecutionService';

// Portfolio Types
export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalValue: number;
  cashBalance: number;
  investedValue: number;
  totalPnL: number;
  dayPnL: number;
  totalReturn: number;
  dayReturn: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioPosition {
  portfolioId: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  realizedPnL: number;
  dayPnL: number;
  dayPnLPercent: number;
  weight: number; // Percentage of portfolio
  lastUpdated: Date;
}

export interface PortfolioPerformance {
  portfolioId: string;
  date: Date;
  totalValue: number;
  cashBalance: number;
  investedValue: number;
  totalPnL: number;
  dayPnL: number;
  totalReturn: number;
  dayReturn: number;
  benchmark?: number; // Optional benchmark comparison
}

export interface PortfolioSummary {
  portfolio: Portfolio;
  positions: PortfolioPosition[];
  performance: PortfolioPerformance;
  topGainers: PortfolioPosition[];
  topLosers: PortfolioPosition[];
  sectorAllocation: { [sector: string]: number };
  riskMetrics: {
    beta: number;
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
  };
}

export interface PnLUpdate {
  portfolioId: string;
  userId: string;
  totalPnL: number;
  dayPnL: number;
  totalReturn: number;
  dayReturn: number;
  positions: PortfolioPosition[];
  timestamp: Date;
}

class PortfolioTrackingService extends EventEmitter {
  private portfolios: Map<string, Portfolio> = new Map();
  private portfolioPositions: Map<string, PortfolioPosition[]> = new Map();
  private performanceHistory: Map<string, PortfolioPerformance[]> = new Map();
  private websocketService: WebSocketService;
  private orderExecutionService: OrderExecutionService;
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isTrackingEnabled = false;

  constructor(websocketService: WebSocketService, orderExecutionService: OrderExecutionService) {
    super();
    this.websocketService = websocketService;
    this.orderExecutionService = orderExecutionService;
    this.setupEventHandlers();
  }

  // Portfolio Management
  createPortfolio(userId: string, name: string, description?: string, initialCash: number = 100000): Portfolio {
    const portfolioId = `PF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const portfolio: Portfolio = {
      id: portfolioId,
      userId,
      name,
      description,
      totalValue: initialCash,
      cashBalance: initialCash,
      investedValue: 0,
      totalPnL: 0,
      dayPnL: 0,
      totalReturn: 0,
      dayReturn: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.portfolios.set(portfolioId, portfolio);
    this.portfolioPositions.set(portfolioId, []);
    this.performanceHistory.set(portfolioId, []);

    // Start tracking if enabled
    if (this.isTrackingEnabled) {
      this.startPortfolioTracking(portfolioId);
    }

    logger.info(`Portfolio created: ${portfolioId} for user ${userId}`);
    this.emit('portfolioCreated', portfolio);

    return portfolio;
  }

  getPortfolio(portfolioId: string): Portfolio | null {
    return this.portfolios.get(portfolioId) || null;
  }

  getUserPortfolios(userId: string): Portfolio[] {
    return Array.from(this.portfolios.values()).filter(p => p.userId === userId);
  }

  updatePortfolio(portfolioId: string, updates: Partial<Portfolio>): Portfolio | null {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) return null;

    const updatedPortfolio = { ...portfolio, ...updates, updatedAt: new Date() };
    this.portfolios.set(portfolioId, updatedPortfolio);

    this.emit('portfolioUpdated', updatedPortfolio);
    return updatedPortfolio;
  }

  // Real-time Tracking Control
  enableTracking(): void {
    this.isTrackingEnabled = true;
    
    // Start tracking all portfolios
    for (const portfolioId of Array.from(this.portfolios.keys())) {
      this.startPortfolioTracking(portfolioId);
    }

    logger.info('Portfolio tracking enabled');
    this.emit('trackingEnabled');
  }

  disableTracking(): void {
    this.isTrackingEnabled = false;
    
    // Stop all tracking intervals
    for (const [portfolioId, interval] of Array.from(this.updateIntervals.entries())) {
      clearInterval(interval);
      this.updateIntervals.delete(portfolioId);
    }

    logger.info('Portfolio tracking disabled');
    this.emit('trackingDisabled');
  }

  isTrackingActive(): boolean {
    return this.isTrackingEnabled;
  }

  // Position Management
  getPortfolioPositions(portfolioId: string): PortfolioPosition[] {
    return this.portfolioPositions.get(portfolioId) || [];
  }

  getPosition(portfolioId: string, symbol: string): PortfolioPosition | null {
    const positions = this.portfolioPositions.get(portfolioId) || [];
    return positions.find(pos => pos.symbol === symbol) || null;
  }

  // Real-time Updates
  private startPortfolioTracking(portfolioId: string): void {
    if (this.updateIntervals.has(portfolioId)) {
      return; // Already tracking
    }

    const interval = setInterval(() => {
      this.updatePortfolioRealtime(portfolioId);
    }, 1000); // Update every second

    this.updateIntervals.set(portfolioId, interval);
    logger.info(`Started real-time tracking for portfolio ${portfolioId}`);
  }

  private stopPortfolioTracking(portfolioId: string): void {
    const interval = this.updateIntervals.get(portfolioId);
    if (interval) {
      clearInterval(interval);
      this.updateIntervals.delete(portfolioId);
      logger.info(`Stopped real-time tracking for portfolio ${portfolioId}`);
    }
  }

  private async updatePortfolioRealtime(portfolioId: string): Promise<void> {
    try {
      const portfolio = this.portfolios.get(portfolioId);
      if (!portfolio) return;

      // Get current positions from order execution service
      const executionPositions = this.orderExecutionService.getUserPositions(portfolio.userId)
        .filter(pos => pos.portfolioId === portfolioId);

      // Update portfolio positions with current market prices
      const updatedPositions = await this.updatePositionsWithMarketData(portfolioId, executionPositions);
      
      // Calculate portfolio metrics
      const portfolioMetrics = this.calculatePortfolioMetrics(portfolio, updatedPositions);
      
      // Update portfolio
      const updatedPortfolio = {
        ...portfolio,
        ...portfolioMetrics,
        updatedAt: new Date()
      };
      
      this.portfolios.set(portfolioId, updatedPortfolio);
      this.portfolioPositions.set(portfolioId, updatedPositions);

      // Create P&L update
      const pnlUpdate: PnLUpdate = {
        portfolioId,
        userId: portfolio.userId,
        totalPnL: updatedPortfolio.totalPnL,
        dayPnL: updatedPortfolio.dayPnL,
        totalReturn: updatedPortfolio.totalReturn,
        dayReturn: updatedPortfolio.dayReturn,
        positions: updatedPositions,
        timestamp: new Date()
      };

      // Broadcast updates
      this.websocketService.broadcastPnLUpdate(portfolio.userId, pnlUpdate);
      
      this.emit('portfolioUpdated', updatedPortfolio);
      this.emit('pnlUpdated', pnlUpdate);

    } catch (error) {
      logger.error(`Error updating portfolio ${portfolioId}:`, error);
    }
  }

  private async updatePositionsWithMarketData(portfolioId: string, executionPositions: Position[]): Promise<PortfolioPosition[]> {
    const positions: PortfolioPosition[] = [];
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) return positions;

    for (const execPos of executionPositions) {
      if (execPos.quantity === 0) continue; // Skip closed positions

      const currentPrice = this.websocketService.getCurrentPrice(execPos.symbol)?.price || execPos.averagePrice;
      const costBasis = execPos.quantity * execPos.averagePrice;
      const marketValue = execPos.quantity * currentPrice;
      const unrealizedPnL = marketValue - costBasis;
      const unrealizedPnLPercent = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;
      
      // Calculate day P&L (simplified - would need previous day's closing price in real implementation)
      const dayPnL = unrealizedPnL * 0.1; // Placeholder calculation
      const dayPnLPercent = costBasis > 0 ? (dayPnL / costBasis) * 100 : 0;
      
      // Calculate weight in portfolio
      const weight = portfolio.totalValue > 0 ? (marketValue / portfolio.totalValue) * 100 : 0;

      const position: PortfolioPosition = {
        portfolioId,
        symbol: execPos.symbol,
        quantity: execPos.quantity,
        averagePrice: execPos.averagePrice,
        currentPrice,
        marketValue,
        costBasis,
        unrealizedPnL,
        unrealizedPnLPercent,
        realizedPnL: execPos.realizedPnL,
        dayPnL,
        dayPnLPercent,
        weight,
        lastUpdated: new Date()
      };

      positions.push(position);
    }

    return positions;
  }

  private calculatePortfolioMetrics(portfolio: Portfolio, positions: PortfolioPosition[]): Partial<Portfolio> {
    const investedValue = positions.reduce((sum, pos) => sum + pos.costBasis, 0);
    const marketValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalValue = portfolio.cashBalance + marketValue;
    
    const totalPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnL + pos.realizedPnL, 0);
    const dayPnL = positions.reduce((sum, pos) => sum + pos.dayPnL, 0);
    
    const totalReturn = investedValue > 0 ? (totalPnL / investedValue) * 100 : 0;
    const dayReturn = totalValue > 0 ? (dayPnL / totalValue) * 100 : 0;

    return {
      totalValue,
      investedValue,
      totalPnL,
      dayPnL,
      totalReturn,
      dayReturn
    };
  }

  // Portfolio Summary and Analytics
  getPortfolioSummary(portfolioId: string): PortfolioSummary | null {
    const portfolio = this.portfolios.get(portfolioId);
    const positions = this.portfolioPositions.get(portfolioId) || [];
    
    if (!portfolio) return null;

    // Create performance snapshot
    const performance: PortfolioPerformance = {
      portfolioId,
      date: new Date(),
      totalValue: portfolio.totalValue,
      cashBalance: portfolio.cashBalance,
      investedValue: portfolio.investedValue,
      totalPnL: portfolio.totalPnL,
      dayPnL: portfolio.dayPnL,
      totalReturn: portfolio.totalReturn,
      dayReturn: portfolio.dayReturn
    };

    // Get top gainers and losers
    const sortedByPnL = [...positions].sort((a, b) => b.unrealizedPnLPercent - a.unrealizedPnLPercent);
    const topGainers = sortedByPnL.filter(pos => pos.unrealizedPnLPercent > 0).slice(0, 5);
    const topLosers = sortedByPnL.filter(pos => pos.unrealizedPnLPercent < 0).slice(-5).reverse();

    // Calculate sector allocation (simplified)
    const sectorAllocation = this.calculateSectorAllocation(positions);

    // Calculate risk metrics (simplified)
    const riskMetrics = this.calculateRiskMetrics(portfolioId);

    return {
      portfolio,
      positions,
      performance,
      topGainers,
      topLosers,
      sectorAllocation,
      riskMetrics
    };
  }

  private calculateSectorAllocation(positions: PortfolioPosition[]): { [sector: string]: number } {
    // Simplified sector mapping - in real implementation, would use external data
    const sectorMap: { [symbol: string]: string } = {
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology',
      'TSLA': 'Automotive',
      'AMZN': 'Consumer Discretionary',
      'BTC': 'Cryptocurrency',
      'ETH': 'Cryptocurrency'
    };

    const allocation: { [sector: string]: number } = {};
    const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);

    for (const position of positions) {
      const sector = sectorMap[position.symbol] || 'Other';
      const weight = totalValue > 0 ? (position.marketValue / totalValue) * 100 : 0;
      allocation[sector] = (allocation[sector] || 0) + weight;
    }

    return allocation;
  }

  private calculateRiskMetrics(portfolioId: string): { beta: number; sharpeRatio: number; maxDrawdown: number; volatility: number } {
    // Simplified risk calculations - in real implementation, would use historical data
    const performanceHistory = this.performanceHistory.get(portfolioId) || [];
    
    // Placeholder calculations
    return {
      beta: 1.0,
      sharpeRatio: 0.8,
      maxDrawdown: -5.2,
      volatility: 15.3
    };
  }

  // Performance History
  recordPerformance(portfolioId: string): void {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) return;

    const performance: PortfolioPerformance = {
      portfolioId,
      date: new Date(),
      totalValue: portfolio.totalValue,
      cashBalance: portfolio.cashBalance,
      investedValue: portfolio.investedValue,
      totalPnL: portfolio.totalPnL,
      dayPnL: portfolio.dayPnL,
      totalReturn: portfolio.totalReturn,
      dayReturn: portfolio.dayReturn
    };

    let history = this.performanceHistory.get(portfolioId) || [];
    history.push(performance);
    
    // Keep only last 365 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 365);
    history = history.filter(p => p.date >= cutoffDate);
    
    this.performanceHistory.set(portfolioId, history);
  }

  getPerformanceHistory(portfolioId: string, days: number = 30): PortfolioPerformance[] {
    const history = this.performanceHistory.get(portfolioId) || [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return history.filter(p => p.date >= cutoffDate).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Event Handlers
  private setupEventHandlers(): void {
    // Listen for order fills to update positions
    this.orderExecutionService.on('orderFilled', (data) => {
      const { order } = data;
      this.handleOrderFill(order);
    });

    // Listen for position updates
    this.orderExecutionService.on('positionUpdated', (position) => {
      this.handlePositionUpdate(position);
    });

    // Record daily performance at market close (simplified)
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 16 && now.getMinutes() === 0) { // 4 PM market close
        for (const portfolioId of Array.from(this.portfolios.keys())) {
          this.recordPerformance(portfolioId);
        }
      }
    }, 60000); // Check every minute
  }

  private handleOrderFill(order: any): void {
    // Update cash balance when order is filled
    const portfolio = this.portfolios.get(order.portfolioId);
    if (!portfolio) return;

    const orderValue = order.filledQuantity * order.averagePrice;
    const fees = order.fees || 0;
    const commission = order.commission || 0;
    const totalCost = orderValue + fees + commission;

    if (order.side === 'buy') {
      portfolio.cashBalance -= totalCost;
    } else {
      portfolio.cashBalance += orderValue - fees - commission;
    }

    portfolio.updatedAt = new Date();
    this.portfolios.set(order.portfolioId, portfolio);

    logger.info(`Portfolio ${order.portfolioId} cash balance updated after order fill`);
  }

  private handlePositionUpdate(position: Position): void {
    // Trigger real-time update for the portfolio
    if (this.isTrackingEnabled) {
      this.updatePortfolioRealtime(position.portfolioId);
    }
  }

  // Cleanup
  destroy(): void {
    this.disableTracking();
    this.portfolios.clear();
    this.portfolioPositions.clear();
    this.performanceHistory.clear();
    this.removeAllListeners();
  }
}

export default PortfolioTrackingService;