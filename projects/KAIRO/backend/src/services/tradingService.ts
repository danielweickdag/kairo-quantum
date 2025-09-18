import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

interface ExecuteTradeRequest {
  userId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  portfolioId?: string;
  stopLoss?: number;
  takeProfit?: number;
  orderType?: 'MARKET' | 'LIMIT' | 'STOP';
}

interface TradeResult {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalValue: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED';
  executedAt: Date;
  fees: number;
}

class TradingService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async executeTrade(request: ExecuteTradeRequest): Promise<TradeResult> {
    try {
      logger.info(`Executing trade: ${request.type} ${request.quantity} ${request.symbol} at $${request.price}`);

      // Validate user balance
      const user = await this.prisma.user.findUnique({
        where: { id: request.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const totalCost = request.quantity * request.price;
      const fees = totalCost * 0.001; // 0.1% trading fee
      const totalRequired = totalCost + fees;

      if (request.type === 'BUY' && user.availableBalance < totalRequired) {
        throw new Error('Insufficient balance');
      }

      // Create trade record
      const trade = await this.prisma.trade.create({
        data: {
          userId: request.userId,
          symbol: request.symbol,
          side: request.type,
          quantity: request.quantity,
          price: request.price,
          totalValue: totalCost,
          fees,
          status: 'EXECUTED',
          executedAt: new Date(),
          orderType: request.orderType || 'MARKET',
          stopLoss: request.stopLoss,
          takeProfit: request.takeProfit,
          portfolioId: request.portfolioId,
        },
      });

      // Update user balance
      if (request.type === 'BUY') {
        await this.prisma.user.update({
          where: { id: request.userId },
          data: {
            availableBalance: {
              decrement: totalRequired,
            },
          },
        });
      } else {
        // For SELL orders, add to balance
        await this.prisma.user.update({
          where: { id: request.userId },
          data: {
            availableBalance: {
              increment: totalCost - fees,
            },
          },
        });
      }

      logger.info(`Trade executed successfully: ${trade.id}`);

      return {
        id: trade.id,
        symbol: trade.symbol,
        type: trade.side as 'BUY' | 'SELL',
        quantity: trade.quantity,
        price: trade.price,
        totalValue: trade.totalValue,
        status: trade.status as 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED',
        executedAt: trade.executedAt || new Date(),
        fees: trade.fees || 0,
      };
    } catch (error) {
      logger.error('Error executing trade:', error);
      throw error;
    }
  }

  async closePosition(positionId: string): Promise<void> {
    try {
      // Find the position/trade to close
      const position = await this.prisma.trade.findUnique({
        where: { id: positionId },
      });

      if (!position) {
        throw new Error('Position not found');
      }

      // Create a closing trade
      const closingTrade = await this.executeTrade({
        userId: position.userId,
        symbol: position.symbol,
        type: position.side === 'BUY' ? 'SELL' : 'BUY',
        quantity: position.quantity,
        price: position.price * (1 + (Math.random() - 0.5) * 0.02), // Simulate market price
      });

      logger.info(`Position closed: ${positionId} with trade: ${closingTrade.id}`);
    } catch (error) {
      logger.error('Error closing position:', error);
      throw error;
    }
  }

  async getMarketPrice(symbol: string): Promise<number> {
    // Simulate market price fetching
    // In a real implementation, this would fetch from a market data provider
    const basePrice = 50000; // Base price for simulation
    const volatility = Math.random() * 0.02; // 2% volatility
    return basePrice * (1 + (Math.random() - 0.5) * volatility);
  }

  async validateTrade(request: ExecuteTradeRequest): Promise<boolean> {
    try {
      // Validate symbol
      if (!request.symbol || request.symbol.length < 2) {
        throw new Error('Invalid symbol');
      }

      // Validate quantity
      if (request.quantity <= 0) {
        throw new Error('Quantity must be positive');
      }

      // Validate price
      if (request.price <= 0) {
        throw new Error('Price must be positive');
      }

      // Check user exists
      const user = await this.prisma.user.findUnique({
        where: { id: request.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return true;
    } catch (error) {
      logger.error('Trade validation failed:', error);
      return false;
    }
  }

  async getUserTrades(userId: string, limit: number = 50): Promise<TradeResult[]> {
    try {
      const trades = await this.prisma.trade.findMany({
        where: { userId },
        orderBy: { executedAt: 'desc' },
        take: limit,
      });

      return trades.map(trade => ({
        id: trade.id,
        symbol: trade.symbol,
        type: trade.side as 'BUY' | 'SELL',
        quantity: trade.quantity,
        price: trade.price,
        totalValue: trade.totalValue,
        status: trade.status as 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED',
        executedAt: trade.executedAt || new Date(),
        fees: trade.fees || 0,
      }));
    } catch (error) {
      logger.error('Error fetching user trades:', error);
      throw error;
    }
  }
}

export { TradingService };
export type { ExecuteTradeRequest, TradeResult };