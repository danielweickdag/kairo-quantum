import { PrismaClient } from '@prisma/client';
import { RiskManagementService } from './riskManagement';
import { PerformanceTracker } from './performanceTracker';

interface BacktestConfig {
  strategy: string;
  symbols: string[];
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  riskPerTrade: number;
  maxPositionSize: number;
  stopLossPercentage: number;
  takeProfitRatio: number;
  minConfidence: number;
  maxDailyTrades: number;
}

interface BacktestTrade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  entryTime: Date;
  exitTime?: Date;
  confidence: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl?: number;
  fees: number;
  status: 'OPEN' | 'CLOSED' | 'STOPPED';
  reason?: string;
}

interface BacktestResult {
  config: BacktestConfig;
  trades: BacktestTrade[];
  performance: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    totalReturn: number;
    totalReturnPct: number;
    maxDrawdown: number;
    sharpeRatio: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    finalBalance: number;
    totalFees: number;
  };
  dailyReturns: Array<{
    date: string;
    balance: number;
    return: number;
    returnPct: number;
    trades: number;
  }>;
  equity: Array<{
    timestamp: Date;
    balance: number;
    drawdown: number;
  }>;
}

interface MarketData {
  symbol: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class BacktestingService {
  private riskManagement: RiskManagementService;
  private performanceTracker: PerformanceTracker;

  constructor(private prisma: PrismaClient) {
    this.riskManagement = new RiskManagementService(prisma);
    this.performanceTracker = new PerformanceTracker(prisma);
  }

  async runBacktest(config: BacktestConfig): Promise<BacktestResult> {
    // Get historical market data for all symbols
    const marketData = await this.getHistoricalData(config.symbols, config.startDate, config.endDate);
    
    // Initialize backtest state
    let balance = config.initialBalance;
    let equity = balance;
    const trades: BacktestTrade[] = [];
    const openPositions: Map<string, BacktestTrade> = new Map();
    const dailyBalances: Array<{ date: string; balance: number; trades: number }> = [];
    const equityCurve: Array<{ timestamp: Date; balance: number; drawdown: number }> = [];
    
    let peak = balance;
    let tradeId = 1;
    
    // Group market data by date for daily processing
    const dataByDate = this.groupMarketDataByDate(marketData);
    const sortedDates = Object.keys(dataByDate).sort();
    
    for (const date of sortedDates) {
      const dayData = dataByDate[date];
      let dailyTrades = 0;
      
      // Process each symbol's data for this date
      for (const symbolData of dayData) {
        // Check for exit conditions on open positions
        const openPosition = openPositions.get(symbolData.symbol);
        if (openPosition) {
          const exitResult = this.checkExitConditions(openPosition, symbolData);
          if (exitResult.shouldExit) {
            this.closePosition(openPosition, symbolData, exitResult.reason || 'Exit condition met', balance);
            openPositions.delete(symbolData.symbol);
            trades.push(openPosition);
            balance += (openPosition.pnl || 0) - openPosition.fees;
          }
        }
        
        // Check for new entry signals (if no open position and within daily trade limit)
        if (!openPositions.has(symbolData.symbol) && dailyTrades < config.maxDailyTrades) {
          const signal = await this.generateTradingSignal(symbolData, config);
          
          if (signal && signal.confidence >= config.minConfidence) {
            const positionSize = this.calculatePositionSize(balance, config, symbolData.close);
            
            if (positionSize > 0) {
              const trade = this.createBacktestTrade(
                tradeId++,
                symbolData,
                signal,
                positionSize,
                config
              );
              
              openPositions.set(symbolData.symbol, trade);
              balance -= trade.quantity * trade.entryPrice + trade.fees;
              dailyTrades++;
            }
          }
        }
      }
      
      // Calculate current equity (balance + unrealized PnL)
      equity = balance;
      for (const [, position] of Array.from(openPositions)) {
        const currentData = dayData.find(d => d.symbol === position.symbol);
        if (currentData) {
          const unrealizedPnL = (currentData.close - position.entryPrice) * position.quantity;
          equity += unrealizedPnL;
        }
      }
      
      // Update peak and calculate drawdown
      if (equity > peak) peak = equity;
      const drawdown = (peak - equity) / peak * 100;
      
      // Record daily data
      dailyBalances.push({ date, balance: equity, trades: dailyTrades });
      equityCurve.push({ 
        timestamp: new Date(date), 
        balance: equity, 
        drawdown 
      });
    }
    
    // Close any remaining open positions at the end
    for (const [symbol, position] of Array.from(openPositions)) {
      const lastData = marketData.filter(d => d.symbol === symbol).pop();
      if (lastData) {
        this.closePosition(position, lastData, 'End of backtest', balance);
        trades.push(position);
        balance += (position.pnl || 0) - position.fees;
      }
    }
    
    // Calculate performance metrics
    const performance = this.calculateBacktestPerformance(trades, config.initialBalance, balance);
    
    // Calculate daily returns
    const dailyReturns = this.calculateDailyReturns(dailyBalances, config.initialBalance);
    
    return {
      config,
      trades,
      performance,
      dailyReturns,
      equity: equityCurve
    };
  }

  private async getHistoricalData(symbols: string[], startDate: Date, endDate: Date): Promise<MarketData[]> {
    // This would typically fetch from a market data provider
    // For now, we'll simulate some data
    const data: MarketData[] = [];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (const symbol of symbols) {
      let price = 100; // Starting price
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        
        // Simulate price movement with some randomness
        const change = (Math.random() - 0.5) * 0.04; // ±2% daily change
        price *= (1 + change);
        
        const high = price * (1 + Math.random() * 0.02);
        const low = price * (1 - Math.random() * 0.02);
        const volume = Math.floor(Math.random() * 1000000) + 100000;
        
        data.push({
          symbol,
          timestamp: date,
          open: price,
          high,
          low,
          close: price,
          volume
        });
      }
    }
    
    return data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private groupMarketDataByDate(marketData: MarketData[]): Record<string, MarketData[]> {
    return marketData.reduce((acc, data) => {
      const date = data.timestamp.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(data);
      return acc;
    }, {} as Record<string, MarketData[]>);
  }

  private async generateTradingSignal(data: MarketData, config: BacktestConfig): Promise<{ side: 'BUY' | 'SELL'; confidence: number } | null> {
    // Simple momentum strategy for demonstration
    // In a real implementation, this would use the actual AI trading algorithms
    
    // Generate a random signal with some logic
    const momentum = Math.random();
    const confidence = Math.random();
    
    if (momentum > 0.6 && confidence > config.minConfidence) {
      return {
        side: 'BUY',
        confidence
      };
    } else if (momentum < 0.4 && confidence > config.minConfidence) {
      return {
        side: 'SELL',
        confidence
      };
    }
    
    return null;
  }

  private calculatePositionSize(balance: number, config: BacktestConfig, price: number): number {
    const riskAmount = balance * (config.riskPerTrade / 100);
    const maxPositionValue = balance * (config.maxPositionSize / 100);
    const maxShares = Math.floor(maxPositionValue / price);
    const riskBasedShares = Math.floor(riskAmount / (price * config.stopLossPercentage / 100));
    
    return Math.min(maxShares, riskBasedShares);
  }

  private createBacktestTrade(
    id: number,
    data: MarketData,
    signal: { side: 'BUY' | 'SELL'; confidence: number },
    quantity: number,
    config: BacktestConfig
  ): BacktestTrade {
    const entryPrice = data.close;
    const fees = entryPrice * quantity * 0.001; // 0.1% fee
    
    return {
      id: `backtest-${id}`,
      symbol: data.symbol,
      side: signal.side,
      quantity,
      entryPrice,
      entryTime: data.timestamp,
      confidence: signal.confidence,
      stopLoss: entryPrice * (1 - config.stopLossPercentage / 100),
      takeProfit: entryPrice * (1 + (config.stopLossPercentage * config.takeProfitRatio) / 100),
      fees,
      status: 'OPEN'
    };
  }

  private checkExitConditions(position: BacktestTrade, data: MarketData): { shouldExit: boolean; reason?: string } {
    // Check stop loss
    if (position.stopLoss && data.low <= position.stopLoss) {
      return { shouldExit: true, reason: 'Stop loss triggered' };
    }
    
    // Check take profit
    if (position.takeProfit && data.high >= position.takeProfit) {
      return { shouldExit: true, reason: 'Take profit triggered' };
    }
    
    // Add more exit conditions as needed (time-based, signal reversal, etc.)
    
    return { shouldExit: false };
  }

  private closePosition(position: BacktestTrade, data: MarketData, reason: string, currentBalance: number): void {
    let exitPrice = data.close;
    
    // Adjust exit price based on reason
    if (reason === 'Stop loss triggered' && position.stopLoss) {
      exitPrice = position.stopLoss;
    } else if (reason === 'Take profit triggered' && position.takeProfit) {
      exitPrice = position.takeProfit;
    }
    
    position.exitPrice = exitPrice;
    position.exitTime = data.timestamp;
    position.status = 'CLOSED';
    position.reason = reason;
    
    // Calculate PnL
    const pnl = (exitPrice - position.entryPrice) * position.quantity;
    position.pnl = pnl;
  }

  private calculateBacktestPerformance(trades: BacktestTrade[], initialBalance: number, finalBalance: number) {
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => (t.pnl || 0) > 0).length;
    const losingTrades = trades.filter(t => (t.pnl || 0) < 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    const totalReturn = finalBalance - initialBalance;
    const totalReturnPct = (totalReturn / initialBalance) * 100;
    
    const wins = trades.filter(t => (t.pnl || 0) > 0).map(t => t.pnl || 0);
    const losses = trades.filter(t => (t.pnl || 0) < 0).map(t => Math.abs(t.pnl || 0));
    
    const averageWin = wins.length > 0 ? wins.reduce((sum, w) => sum + w, 0) / wins.length : 0;
    const averageLoss = losses.length > 0 ? losses.reduce((sum, l) => sum + l, 0) / losses.length : 0;
    
    const grossWins = wins.reduce((sum, w) => sum + w, 0);
    const grossLosses = losses.reduce((sum, l) => sum + l, 0);
    const profitFactor = grossLosses > 0 ? grossWins / grossLosses : grossWins > 0 ? Infinity : 0;
    
    const totalFees = trades.reduce((sum, t) => sum + t.fees, 0);
    
    // Calculate max drawdown (simplified)
    let runningBalance = initialBalance;
    let peak = initialBalance;
    let maxDrawdown = 0;
    
    for (const trade of trades) {
      runningBalance += (trade.pnl || 0) - trade.fees;
      if (runningBalance > peak) peak = runningBalance;
      const drawdown = (peak - runningBalance) / peak * 100;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
    
    // Calculate Sharpe ratio (simplified)
    const returns = trades.map(t => ((t.pnl || 0) - t.fees) / initialBalance * 100);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1);
    const stdDev = Math.sqrt(variance);
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;
    
    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalReturn,
      totalReturnPct,
      maxDrawdown,
      sharpeRatio,
      profitFactor,
      averageWin,
      averageLoss,
      finalBalance,
      totalFees
    };
  }

  private calculateDailyReturns(dailyBalances: Array<{ date: string; balance: number; trades: number }>, initialBalance: number) {
    return dailyBalances.map((day, index) => {
      const previousBalance = index > 0 ? dailyBalances[index - 1].balance : initialBalance;
      const dailyReturn = day.balance - previousBalance;
      const returnPct = (dailyReturn / previousBalance) * 100;
      
      return {
        date: day.date,
        balance: day.balance,
        return: dailyReturn,
        returnPct,
        trades: day.trades
      };
    });
  }

  async saveBacktestResult(userId: string, result: BacktestResult): Promise<string> {
    // For now, return a mock ID until we add the Backtest model to schema
    // TODO: Add Backtest model to Prisma schema
    return `backtest-${Date.now()}`;
  }

  async getBacktestHistory(userId: string): Promise<any[]> {
    // For now, return empty array until we add the Backtest model to schema
    // TODO: Add Backtest model to Prisma schema
    return [];
  }
}