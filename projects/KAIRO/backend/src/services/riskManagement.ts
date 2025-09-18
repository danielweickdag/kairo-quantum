import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

interface RiskParameters {
  maxPositionSize: number; // Maximum position size as percentage of portfolio
  maxDailyLoss: number; // Maximum daily loss as percentage
  maxDrawdown: number; // Maximum drawdown percentage
  stopLossPercentage: number; // Default stop loss percentage
  takeProfitRatio: number; // Take profit to stop loss ratio
  maxOpenPositions: number; // Maximum number of open positions
  riskPerTrade: number; // Risk per trade as percentage of portfolio
}

interface PositionSizeResult {
  recommendedSize: number;
  maxAllowedSize: number;
  riskAmount: number;
  reasoning: string;
}

interface RiskAssessment {
  canTrade: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  warnings: string[];
  recommendations: string[];
}

class RiskManagementService {
  private prisma: PrismaClient;
  private defaultRiskParams: RiskParameters;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.defaultRiskParams = {
      maxPositionSize: 10, // 10% of portfolio
      maxDailyLoss: 2, // 2% daily loss limit
      maxDrawdown: 15, // 15% maximum drawdown
      stopLossPercentage: 2, // 2% stop loss
      takeProfitRatio: 2, // 2:1 reward to risk ratio
      maxOpenPositions: 5,
      riskPerTrade: 1 // 1% risk per trade
    };
  }

  async calculatePositionSize(
    portfolioId: string,
    symbol: string,
    entryPrice: number,
    stopLossPrice: number,
    riskParams?: Partial<RiskParameters>
  ): Promise<PositionSizeResult> {
    try {
      const params = { ...this.defaultRiskParams, ...riskParams };
      
      // Get portfolio value
      const portfolio = await this.prisma.portfolio.findUnique({
        where: { id: portfolioId },
        include: {
          holdings: true,
          trades: {
            where: {
              status: 'EXECUTED'
            }
          }
        }
      });

      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const portfolioValue = portfolio.totalValue;
      const riskAmount = portfolioValue * (params.riskPerTrade / 100);
      
      // Calculate position size based on stop loss
      const riskPerShare = Math.abs(entryPrice - stopLossPrice);
      const sharesBasedOnRisk = riskPerShare > 0 ? riskAmount / riskPerShare : 0;
      
      // Calculate maximum position size based on portfolio percentage
      const maxPositionValue = portfolioValue * (params.maxPositionSize / 100);
      const maxSharesBasedOnSize = maxPositionValue / entryPrice;
      
      // Take the smaller of the two
      const recommendedSize = Math.min(sharesBasedOnRisk, maxSharesBasedOnSize);
      
      let reasoning = `Risk-based size: ${sharesBasedOnRisk.toFixed(2)} shares, `;
      reasoning += `Max size-based: ${maxSharesBasedOnSize.toFixed(2)} shares. `;
      reasoning += `Using smaller value for safety.`;

      return {
        recommendedSize: Math.floor(recommendedSize),
        maxAllowedSize: Math.floor(maxSharesBasedOnSize),
        riskAmount,
        reasoning
      };
    } catch (error) {
      logger.error('Error calculating position size:', error);
      throw error;
    }
  }

  async assessPortfolioRisk(
    portfolioId: string,
    riskParams?: Partial<RiskParameters>
  ): Promise<RiskAssessment> {
    try {
      const params = { ...this.defaultRiskParams, ...riskParams };
      const warnings: string[] = [];
      const recommendations: string[] = [];
      
      // Get portfolio and recent performance
      const portfolio = await this.prisma.portfolio.findUnique({
        where: { id: portfolioId },
        include: {
          holdings: true,
          trades: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          performance: {
            orderBy: { date: 'desc' },
            take: 30 // Last 30 days
          }
        }
      });

      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Check daily loss
      const todayTrades = portfolio.trades.filter(
        trade => trade.createdAt >= new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      
      const dailyPnL = todayTrades.reduce((sum, trade) => {
        const pnl = (trade.price - trade.price) * trade.quantity; // Simplified PnL calculation
        return sum + pnl;
      }, 0);
      
      const dailyLossPercentage = Math.abs(dailyPnL) / portfolio.totalValue * 100;
      
      if (dailyLossPercentage > params.maxDailyLoss) {
        warnings.push(`Daily loss (${dailyLossPercentage.toFixed(2)}%) exceeds limit (${params.maxDailyLoss}%)`);
      }

      // Check number of open positions
      const openPositions = portfolio.holdings.filter(h => h.quantity > 0).length;
      if (openPositions >= params.maxOpenPositions) {
        warnings.push(`Maximum open positions (${params.maxOpenPositions}) reached`);
      }

      // Calculate drawdown
      if (portfolio.performance.length > 0) {
        const recentPerformance = portfolio.performance.slice(0, 30);
        const maxValue = Math.max(...recentPerformance.map(p => p.totalValue));
        const currentValue = portfolio.totalValue;
        const drawdown = ((maxValue - currentValue) / maxValue) * 100;
        
        if (drawdown > params.maxDrawdown) {
          warnings.push(`Portfolio drawdown (${drawdown.toFixed(2)}%) exceeds limit (${params.maxDrawdown}%)`);
        }
      }

      // Determine risk level
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' = 'LOW';
      
      if (warnings.length === 0) {
        riskLevel = 'LOW';
        recommendations.push('Portfolio risk is within acceptable limits');
      } else if (warnings.length <= 2) {
        riskLevel = 'MEDIUM';
        recommendations.push('Consider reducing position sizes');
      } else if (warnings.length <= 3) {
        riskLevel = 'HIGH';
        recommendations.push('Reduce exposure and review risk parameters');
      } else {
        riskLevel = 'EXTREME';
        recommendations.push('Stop trading and reassess strategy');
      }

      const canTrade = riskLevel !== 'EXTREME' && dailyLossPercentage < params.maxDailyLoss;

      return {
        canTrade,
        riskLevel,
        warnings,
        recommendations
      };
    } catch (error) {
      logger.error('Error assessing portfolio risk:', error);
      throw error;
    }
  }

  async validateTrade(
    portfolioId: string,
    symbol: string,
    quantity: number,
    price: number,
    side: 'BUY' | 'SELL',
    riskParams?: Partial<RiskParameters>
  ): Promise<{ isValid: boolean; reason?: string }> {
    try {
      const riskAssessment = await this.assessPortfolioRisk(portfolioId, riskParams);
      
      if (!riskAssessment.canTrade) {
        return {
          isValid: false,
          reason: 'Trading suspended due to high risk level'
        };
      }

      const params = { ...this.defaultRiskParams, ...riskParams };
      const portfolio = await this.prisma.portfolio.findUnique({
        where: { id: portfolioId }
      });

      if (!portfolio) {
        return { isValid: false, reason: 'Portfolio not found' };
      }

      // Check position size limits
      const positionValue = quantity * price;
      const positionPercentage = (positionValue / portfolio.totalValue) * 100;
      
      if (positionPercentage > params.maxPositionSize) {
        return {
          isValid: false,
          reason: `Position size (${positionPercentage.toFixed(2)}%) exceeds limit (${params.maxPositionSize}%)`
        };
      }

      return { isValid: true };
    } catch (error) {
      logger.error('Error validating trade:', error);
      return { isValid: false, reason: 'Error validating trade' };
    }
  }

  async getOptimalStopLoss(
    entryPrice: number,
    side: 'BUY' | 'SELL',
    volatility?: number,
    riskParams?: Partial<RiskParameters>
  ): Promise<number> {
    const params = { ...this.defaultRiskParams, ...riskParams };
    
    // Use volatility-adjusted stop loss if available, otherwise use default percentage
    const stopLossPercentage = volatility ? 
      Math.max(params.stopLossPercentage, volatility * 1.5) : 
      params.stopLossPercentage;
    
    if (side === 'BUY') {
      return entryPrice * (1 - stopLossPercentage / 100);
    } else {
      return entryPrice * (1 + stopLossPercentage / 100);
    }
  }

  async getOptimalTakeProfit(
    entryPrice: number,
    stopLossPrice: number,
    side: 'BUY' | 'SELL',
    riskParams?: Partial<RiskParameters>
  ): Promise<number> {
    const params = { ...this.defaultRiskParams, ...riskParams };
    const riskAmount = Math.abs(entryPrice - stopLossPrice);
    const rewardAmount = riskAmount * params.takeProfitRatio;
    
    if (side === 'BUY') {
      return entryPrice + rewardAmount;
    } else {
      return entryPrice - rewardAmount;
    }
  }
}

export { RiskManagementService };
export type { RiskParameters, PositionSizeResult, RiskAssessment };