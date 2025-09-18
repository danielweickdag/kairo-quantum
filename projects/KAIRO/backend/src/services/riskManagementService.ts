import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Types
interface RiskLimits {
  maxDailyLoss: number;
  maxPositionSize: number;
  maxPortfolioRisk: number;
  maxDailyTrades: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxLeverage: number;
  allowedSymbols: string[];
  tradingHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  side: 'long' | 'short';
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce: 'day' | 'gtc' | 'ioc' | 'fok';
}

interface RiskMetrics {
  portfolioValue: number;
  dailyPnL: number;
  dailyTradeCount: number;
  currentRisk: number;
  maxRiskReached: boolean;
  riskUtilization: number;
}

interface RiskCheckResult {
  allowed: boolean;
  reason?: string;
  suggestedQuantity?: number;
  riskScore: number;
}

class RiskManagementService extends EventEmitter {
  private prisma: PrismaClient;
  private userRiskLimits: Map<string, RiskLimits> = new Map();
  private dailyMetrics: Map<string, RiskMetrics> = new Map();
  private emergencyStopUsers: Set<string> = new Set();
  private lastResetDate: string;

  constructor(prisma: PrismaClient) {
    super();
    this.prisma = prisma;
    this.lastResetDate = new Date().toDateString();
    
    // Reset daily metrics at midnight
    this.scheduleMetricsReset();
  }

  // Initialize risk limits for a user
  async initializeUserRiskLimits(userId: string, limits?: Partial<RiskLimits>): Promise<void> {
    const defaultLimits: RiskLimits = {
      maxDailyLoss: 1000, // $1000
      maxPositionSize: 10000, // $10,000
      maxPortfolioRisk: 0.02, // 2% of portfolio
      maxDailyTrades: 50,
      stopLossPercentage: 0.05, // 5%
      takeProfitPercentage: 0.10, // 10%
      maxLeverage: 1.0, // No leverage by default
      allowedSymbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX'],
      tradingHours: {
        start: '09:30',
        end: '16:00',
        timezone: 'America/New_York'
      }
    };

    const userLimits = { ...defaultLimits, ...limits };
    this.userRiskLimits.set(userId, userLimits);

    // Initialize daily metrics
    this.dailyMetrics.set(userId, {
      portfolioValue: 0,
      dailyPnL: 0,
      dailyTradeCount: 0,
      currentRisk: 0,
      maxRiskReached: false,
      riskUtilization: 0
    });

    logger.info(`Risk limits initialized for user ${userId}`);
  }

  // Update risk limits for a user
  async updateRiskLimits(userId: string, limits: Partial<RiskLimits>): Promise<void> {
    const currentLimits = this.userRiskLimits.get(userId);
    if (!currentLimits) {
      throw new Error('User risk limits not initialized');
    }

    const updatedLimits = { ...currentLimits, ...limits };
    this.userRiskLimits.set(userId, updatedLimits);

    this.emit('riskLimitsUpdated', { userId, limits: updatedLimits });
    logger.info(`Risk limits updated for user ${userId}`);
  }

  // Get risk limits for a user
  getRiskLimits(userId: string): RiskLimits | null {
    return this.userRiskLimits.get(userId) || null;
  }

  // Check if an order is allowed based on risk management rules
  async checkOrderRisk(userId: string, order: Order, currentPositions: Position[], portfolioValue: number): Promise<RiskCheckResult> {
    const limits = this.userRiskLimits.get(userId);
    const metrics = this.dailyMetrics.get(userId);

    if (!limits || !metrics) {
      return {
        allowed: false,
        reason: 'Risk limits not initialized',
        riskScore: 1.0
      };
    }

    // Check if user is in emergency stop mode
    if (this.emergencyStopUsers.has(userId)) {
      return {
        allowed: false,
        reason: 'Emergency stop activated',
        riskScore: 1.0
      };
    }

    // Check trading hours
    if (!this.isWithinTradingHours(limits.tradingHours)) {
      return {
        allowed: false,
        reason: 'Outside trading hours',
        riskScore: 0.8
      };
    }

    // Check if symbol is allowed
    if (!limits.allowedSymbols.includes(order.symbol)) {
      return {
        allowed: false,
        reason: `Symbol ${order.symbol} not in allowed list`,
        riskScore: 0.9
      };
    }

    // Check daily trade limit
    if (metrics.dailyTradeCount >= limits.maxDailyTrades) {
      return {
        allowed: false,
        reason: 'Daily trade limit exceeded',
        riskScore: 1.0
      };
    }

    // Calculate order value
    const orderValue = order.quantity * (order.price || 0);

    // Check position size limit
    if (orderValue > limits.maxPositionSize) {
      const suggestedQuantity = Math.floor(limits.maxPositionSize / (order.price || 1));
      return {
        allowed: false,
        reason: 'Position size exceeds limit',
        suggestedQuantity,
        riskScore: 0.7
      };
    }

    // Check portfolio risk
    const portfolioRisk = this.calculatePortfolioRisk(currentPositions, portfolioValue);
    const newRisk = this.calculateNewPositionRisk(order, portfolioValue);
    const totalRisk = portfolioRisk + newRisk;

    if (totalRisk > limits.maxPortfolioRisk) {
      const maxAllowedRisk = limits.maxPortfolioRisk - portfolioRisk;
      const suggestedQuantity = Math.floor((maxAllowedRisk * portfolioValue) / (order.price || 1));
      
      return {
        allowed: false,
        reason: 'Portfolio risk limit exceeded',
        suggestedQuantity: Math.max(0, suggestedQuantity),
        riskScore: totalRisk / limits.maxPortfolioRisk
      };
    }

    // Check daily loss limit
    const potentialLoss = this.calculatePotentialLoss(order, limits.stopLossPercentage);
    if (metrics.dailyPnL - potentialLoss < -limits.maxDailyLoss) {
      return {
        allowed: false,
        reason: 'Daily loss limit would be exceeded',
        riskScore: 0.9
      };
    }

    // Calculate overall risk score
    const riskScore = this.calculateRiskScore(order, currentPositions, portfolioValue, limits, metrics);

    return {
      allowed: true,
      riskScore
    };
  }

  // Update daily metrics after a trade
  async updateDailyMetrics(userId: string, trade: { pnl: number; value: number }): Promise<void> {
    const metrics = this.dailyMetrics.get(userId);
    if (!metrics) {
      logger.warn(`No daily metrics found for user ${userId}`);
      return;
    }

    metrics.dailyPnL += trade.pnl;
    metrics.dailyTradeCount += 1;
    
    this.dailyMetrics.set(userId, metrics);

    // Check if daily loss limit is reached
    const limits = this.userRiskLimits.get(userId);
    if (limits && metrics.dailyPnL <= -limits.maxDailyLoss) {
      await this.triggerEmergencyStop(userId, 'Daily loss limit exceeded');
    }

    this.emit('metricsUpdated', { userId, metrics });
  }

  // Get current risk metrics for a user
  getRiskMetrics(userId: string): RiskMetrics | null {
    return this.dailyMetrics.get(userId) || null;
  }

  // Trigger emergency stop for a user
  async triggerEmergencyStop(userId: string, reason: string): Promise<void> {
    this.emergencyStopUsers.add(userId);
    
    this.emit('emergencyStop', { userId, reason, timestamp: new Date() });
    logger.warn(`Emergency stop triggered for user ${userId}: ${reason}`);
  }

  // Remove emergency stop for a user
  async removeEmergencyStop(userId: string): Promise<void> {
    this.emergencyStopUsers.delete(userId);
    
    this.emit('emergencyStopRemoved', { userId, timestamp: new Date() });
    logger.info(`Emergency stop removed for user ${userId}`);
  }

  // Check if user is in emergency stop mode
  isEmergencyStop(userId: string): boolean {
    return this.emergencyStopUsers.has(userId);
  }

  // Calculate portfolio risk
  private calculatePortfolioRisk(positions: Position[], portfolioValue: number): number {
    if (portfolioValue === 0) return 0;
    
    const totalRisk = positions.reduce((risk, position) => {
      const positionRisk = Math.abs(position.marketValue) / portfolioValue;
      return risk + positionRisk;
    }, 0);
    
    return totalRisk;
  }

  // Calculate risk for a new position
  private calculateNewPositionRisk(order: Order, portfolioValue: number): number {
    if (portfolioValue === 0) return 0;
    
    const orderValue = order.quantity * (order.price || 0);
    return orderValue / portfolioValue;
  }

  // Calculate potential loss for an order
  private calculatePotentialLoss(order: Order, stopLossPercentage: number): number {
    const orderValue = order.quantity * (order.price || 0);
    return orderValue * stopLossPercentage;
  }

  // Calculate overall risk score for an order
  private calculateRiskScore(
    order: Order,
    positions: Position[],
    portfolioValue: number,
    limits: RiskLimits,
    metrics: RiskMetrics
  ): number {
    const orderValue = order.quantity * (order.price || 0);
    
    // Position size risk (0-1)
    const positionSizeRisk = orderValue / limits.maxPositionSize;
    
    // Portfolio risk (0-1)
    const portfolioRisk = this.calculatePortfolioRisk(positions, portfolioValue) / limits.maxPortfolioRisk;
    
    // Daily trade frequency risk (0-1)
    const tradeFrequencyRisk = metrics.dailyTradeCount / limits.maxDailyTrades;
    
    // Daily P&L risk (0-1)
    const dailyPnLRisk = Math.abs(metrics.dailyPnL) / limits.maxDailyLoss;
    
    // Weighted average of all risk factors
    const weights = {
      positionSize: 0.3,
      portfolio: 0.3,
      tradeFrequency: 0.2,
      dailyPnL: 0.2
    };
    
    const totalRisk = 
      positionSizeRisk * weights.positionSize +
      portfolioRisk * weights.portfolio +
      tradeFrequencyRisk * weights.tradeFrequency +
      dailyPnLRisk * weights.dailyPnL;
    
    return Math.min(1.0, totalRisk);
  }

  // Check if current time is within trading hours
  private isWithinTradingHours(tradingHours: { start: string; end: string; timezone: string }): boolean {
    try {
      const now = new Date();
      const timeZone = tradingHours.timezone;
      
      // Get current time in the specified timezone
      const currentTime = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }).format(now);
      
      const [currentHour, currentMinute] = currentTime.split(':').map(Number);
      const currentMinutes = currentHour * 60 + currentMinute;
      
      const [startHour, startMinute] = tradingHours.start.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      
      const [endHour, endMinute] = tradingHours.end.split(':').map(Number);
      const endMinutes = endHour * 60 + endMinute;
      
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } catch (error) {
      logger.error('Error checking trading hours:', error);
      return true; // Default to allowing trades if there's an error
    }
  }

  // Schedule daily metrics reset
  private scheduleMetricsReset(): void {
    setInterval(() => {
      const currentDate = new Date().toDateString();
      if (currentDate !== this.lastResetDate) {
        this.resetDailyMetrics();
        this.lastResetDate = currentDate;
      }
    }, 60000); // Check every minute
  }

  // Reset daily metrics for all users
  private resetDailyMetrics(): void {
    for (const [userId, metrics] of Array.from(this.dailyMetrics.entries())) {
      this.dailyMetrics.set(userId, {
        ...metrics,
        dailyPnL: 0,
        dailyTradeCount: 0,
        maxRiskReached: false
      });
    }
    
    this.emit('dailyMetricsReset', { date: new Date() });
    logger.info('Daily metrics reset for all users');
  }

  // Get risk summary for a user
  async getRiskSummary(userId: string): Promise<{
    limits: RiskLimits | null;
    metrics: RiskMetrics | null;
    emergencyStop: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }> {
    const limits = this.getRiskLimits(userId);
    const metrics = this.getRiskMetrics(userId);
    const emergencyStop = this.isEmergencyStop(userId);
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (emergencyStop) {
      riskLevel = 'critical';
    } else if (metrics && limits) {
      const riskUtilization = Math.max(
        metrics.dailyTradeCount / limits.maxDailyTrades,
        Math.abs(metrics.dailyPnL) / limits.maxDailyLoss,
        metrics.currentRisk / limits.maxPortfolioRisk
      );
      
      if (riskUtilization >= 0.8) {
        riskLevel = 'high';
      } else if (riskUtilization >= 0.5) {
        riskLevel = 'medium';
      }
    }
    
    return {
      limits,
      metrics,
      emergencyStop,
      riskLevel
    };
  }

  // Cleanup resources
  async cleanup(): Promise<void> {
    this.removeAllListeners();
    this.userRiskLimits.clear();
    this.dailyMetrics.clear();
    this.emergencyStopUsers.clear();
    
    logger.info('Risk management service cleaned up');
  }
}

export default RiskManagementService;
export type { RiskLimits, Position, Order, RiskMetrics, RiskCheckResult };