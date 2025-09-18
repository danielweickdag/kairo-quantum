import { PrismaClient } from '@prisma/client';

interface PerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
  bestTrade: number;
  worstTrade: number;
  totalFees: number;
  netPnL: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  dailyReturns: DailyReturn[];
}

interface DailyReturn {
  date: string;
  pnl: number;
  trades: number;
  winRate: number;
}

interface TradeAnalysis {
  symbol: string;
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  averageConfidence: number;
}

export class PerformanceTracker {
  constructor(private prisma: PrismaClient) {}

  async calculateBotPerformance(
    userId: string,
    botConfigId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<PerformanceMetrics> {
    const whereClause: any = {
      userId,
      status: 'EXECUTED',
      executedAt: {
        not: null
      }
    };

    if (botConfigId) {
      whereClause.botConfigId = botConfigId;
    }

    if (startDate || endDate) {
      whereClause.executedAt = {
        ...whereClause.executedAt,
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate })
      };
    }

    const trades = await this.prisma.botTrade.findMany({
      where: whereClause,
      orderBy: { executedAt: 'asc' }
    });

    if (trades.length === 0) {
      return this.getEmptyMetrics();
    }

    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => (t.pnl || 0) > 0).length;
    const losingTrades = trades.filter(t => (t.pnl || 0) < 0).length;
    const winRate = (winningTrades / totalTrades) * 100;

    const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalFees = trades.reduce((sum, t) => sum + (t.fees || 0), 0);
    const netPnL = totalPnL - totalFees;
    const averagePnL = totalPnL / totalTrades;

    const pnlValues = trades.map(t => t.pnl || 0);
    const bestTrade = Math.max(...pnlValues);
    const worstTrade = Math.min(...pnlValues);

    const winningPnL = trades.filter(t => (t.pnl || 0) > 0).reduce((sum, t) => sum + (t.pnl || 0), 0);
    const losingPnL = Math.abs(trades.filter(t => (t.pnl || 0) < 0).reduce((sum, t) => sum + (t.pnl || 0), 0));
    
    const averageWin = winningTrades > 0 ? winningPnL / winningTrades : 0;
    const averageLoss = losingTrades > 0 ? losingPnL / losingTrades : 0;
    const profitFactor = losingPnL > 0 ? winningPnL / losingPnL : winningPnL > 0 ? Infinity : 0;

    const sharpeRatio = this.calculateSharpeRatio(trades);
    const maxDrawdown = this.calculateMaxDrawdown(trades);
    const { consecutiveWins, consecutiveLosses } = this.calculateConsecutiveStreaks(trades);
    const dailyReturns = this.calculateDailyReturns(trades);

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalPnL,
      averagePnL,
      bestTrade,
      worstTrade,
      totalFees,
      netPnL,
      sharpeRatio,
      maxDrawdown,
      profitFactor,
      averageWin,
      averageLoss,
      consecutiveWins,
      consecutiveLosses,
      dailyReturns
    };
  }

  async getTradeAnalysisBySymbol(
    userId: string,
    botConfigId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<TradeAnalysis[]> {
    const whereClause: any = {
      userId,
      status: 'EXECUTED',
      executedAt: {
        not: null
      }
    };

    if (botConfigId) {
      whereClause.botConfigId = botConfigId;
    }

    if (startDate || endDate) {
      whereClause.executedAt = {
        ...whereClause.executedAt,
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate })
      };
    }

    const trades = await this.prisma.botTrade.findMany({
      where: whereClause
    });

    const symbolGroups = trades.reduce((acc, trade) => {
      if (!acc[trade.symbol]) {
        acc[trade.symbol] = [];
      }
      acc[trade.symbol].push(trade);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(symbolGroups).map(([symbol, symbolTrades]) => {
      const totalTrades = symbolTrades.length;
      const winningTrades = symbolTrades.filter(t => (t.pnl || 0) > 0).length;
      const winRate = (winningTrades / totalTrades) * 100;
      const totalPnL = symbolTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const averageConfidence = symbolTrades.reduce((sum, t) => sum + t.confidence, 0) / totalTrades;

      return {
        symbol,
        totalTrades,
        winRate,
        totalPnL,
        averageConfidence
      };
    }).sort((a, b) => b.totalPnL - a.totalPnL);
  }

  private calculateSharpeRatio(trades: any[]): number {
    if (trades.length < 2) return 0;

    const returns = trades.map(t => (t.pnl || 0) / (t.price * t.quantity) * 100);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1);
    const stdDev = Math.sqrt(variance);

    return stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0; // Annualized
  }

  private calculateMaxDrawdown(trades: any[]): number {
    let runningPnL = 0;
    let peak = 0;
    let maxDrawdown = 0;

    for (const trade of trades) {
      runningPnL += (trade.pnl || 0);
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

  private calculateConsecutiveStreaks(trades: any[]): { consecutiveWins: number; consecutiveLosses: number } {
    let maxWins = 0;
    let maxLosses = 0;
    let currentWins = 0;
    let currentLosses = 0;

    for (const trade of trades) {
      const pnl = trade.pnl || 0;
      if (pnl > 0) {
        currentWins++;
        currentLosses = 0;
        maxWins = Math.max(maxWins, currentWins);
      } else if (pnl < 0) {
        currentLosses++;
        currentWins = 0;
        maxLosses = Math.max(maxLosses, currentLosses);
      } else {
        currentWins = 0;
        currentLosses = 0;
      }
    }

    return { consecutiveWins: maxWins, consecutiveLosses: maxLosses };
  }

  private calculateDailyReturns(trades: any[]): DailyReturn[] {
    const dailyGroups = trades.reduce((acc, trade) => {
      if (!trade.executedAt) return acc;
      
      const date = trade.executedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trade);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(dailyGroups).map(([date, dayTrades]) => {
      const typedDayTrades = dayTrades as any[];
      const pnl = typedDayTrades.reduce((sum: number, t: any) => sum + (t.pnl || 0), 0);
      const trades = typedDayTrades.length;
      const winningTrades = typedDayTrades.filter((t: any) => (t.pnl || 0) > 0).length;
      const winRate = trades > 0 ? (winningTrades / trades) * 100 : 0;

      return { date, pnl, trades, winRate };
    }).sort((a, b) => a.date.localeCompare(b.date));
  }

  private getEmptyMetrics(): PerformanceMetrics {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalPnL: 0,
      averagePnL: 0,
      bestTrade: 0,
      worstTrade: 0,
      totalFees: 0,
      netPnL: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      profitFactor: 0,
      averageWin: 0,
      averageLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      dailyReturns: []
    };
  }

  async getBotConfigPerformance(userId: string): Promise<Array<{ botConfig: any; performance: PerformanceMetrics }>> {
    const botConfigs = await this.prisma.aIBotConfig.findMany({
      where: { userId },
      include: {
        botTrades: {
          where: {
            status: 'EXECUTED',
            executedAt: {
              not: null
            }
          }
        }
      }
    });

    const results = [];
    for (const botConfig of botConfigs) {
      const performance = await this.calculateBotPerformance(userId, botConfig.id);
      results.push({ botConfig, performance });
    }

    return results;
  }
}