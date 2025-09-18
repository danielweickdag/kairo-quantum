import express from 'express';
import { prisma } from '../server';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { BacktestingService } from '../services/backtestingService';

const router = express.Router();
const backtestingService = new BacktestingService(prisma);

interface BacktestRequest {
  strategy: string;
  symbols: string[];
  startDate: string;
  endDate: string;
  initialBalance: number;
  riskPerTrade: number;
  maxPositionSize: number;
  stopLossPercentage: number;
  takeProfitRatio: number;
  minConfidence: number;
  maxDailyTrades: number;
}

// Run a new backtest
router.post('/run', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const {
      strategy,
      symbols,
      startDate,
      endDate,
      initialBalance,
      riskPerTrade,
      maxPositionSize,
      stopLossPercentage,
      takeProfitRatio,
      minConfidence,
      maxDailyTrades
    }: BacktestRequest = req.body;

    // Validate required fields
    if (!strategy || !symbols || !startDate || !endDate || !initialBalance) {
      return res.status(400).json({ 
        error: 'Missing required fields: strategy, symbols, startDate, endDate, initialBalance' 
      });
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    if (end > new Date()) {
      return res.status(400).json({ error: 'End date cannot be in the future' });
    }

    // Validate symbols array
    if (!Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({ error: 'Symbols must be a non-empty array' });
    }

    // Validate numeric parameters
    if (initialBalance <= 0) {
      return res.status(400).json({ error: 'Initial balance must be positive' });
    }

    const config = {
      strategy,
      symbols,
      startDate: start,
      endDate: end,
      initialBalance,
      riskPerTrade: riskPerTrade || 2,
      maxPositionSize: maxPositionSize || 10,
      stopLossPercentage: stopLossPercentage || 2,
      takeProfitRatio: takeProfitRatio || 2,
      minConfidence: minConfidence || 0.7,
      maxDailyTrades: maxDailyTrades || 10
    };

    // Run the backtest
    const result = await backtestingService.runBacktest(config);

    // Save the result
    const backtestId = await backtestingService.saveBacktestResult(userId, result);

    res.json({
      backtestId,
      result: {
        config: result.config,
        performance: result.performance,
        totalTrades: result.trades.length,
        dailyReturns: result.dailyReturns,
        equity: result.equity
      }
    });
  } catch (error) {
    console.error('Backtest error:', error);
    res.status(500).json({ error: 'Failed to run backtest' });
  }
});

// Get backtest history
router.get('/history', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const history = await backtestingService.getBacktestHistory(userId);
    res.json({ history });
  } catch (error) {
    console.error('Get backtest history error:', error);
    res.status(500).json({ error: 'Failed to get backtest history' });
  }
});

// Get detailed backtest results
router.get('/:backtestId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { backtestId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // For now, return a mock response since we don't have the database model yet
    res.json({
      message: 'Backtest details endpoint - implementation pending database model',
      backtestId
    });
  } catch (error) {
    console.error('Get backtest details error:', error);
    res.status(500).json({ error: 'Failed to get backtest details' });
  }
});

// Compare multiple backtests
router.post('/compare', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { backtestIds } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!Array.isArray(backtestIds) || backtestIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 backtest IDs required for comparison' });
    }

    // For now, return a mock response
    res.json({
      message: 'Backtest comparison endpoint - implementation pending database model',
      backtestIds
    });
  } catch (error) {
    console.error('Compare backtests error:', error);
    res.status(500).json({ error: 'Failed to compare backtests' });
  }
});

// Get strategy templates
router.get('/strategies/templates', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const templates = [
      {
        id: 'momentum',
        name: 'Momentum Strategy',
        description: 'Buy when price momentum is positive, sell when negative',
        defaultParams: {
          riskPerTrade: 2,
          maxPositionSize: 10,
          stopLossPercentage: 2,
          takeProfitRatio: 2,
          minConfidence: 0.7,
          maxDailyTrades: 10
        }
      },
      {
        id: 'mean_reversion',
        name: 'Mean Reversion Strategy',
        description: 'Buy when price is below average, sell when above',
        defaultParams: {
          riskPerTrade: 1.5,
          maxPositionSize: 8,
          stopLossPercentage: 3,
          takeProfitRatio: 1.5,
          minConfidence: 0.6,
          maxDailyTrades: 15
        }
      },
      {
        id: 'breakout',
        name: 'Breakout Strategy',
        description: 'Buy on upward breakouts, sell on downward breakouts',
        defaultParams: {
          riskPerTrade: 2.5,
          maxPositionSize: 12,
          stopLossPercentage: 1.5,
          takeProfitRatio: 3,
          minConfidence: 0.8,
          maxDailyTrades: 8
        }
      }
    ];

    res.json({ templates });
  } catch (error) {
    console.error('Get strategy templates error:', error);
    res.status(500).json({ error: 'Failed to get strategy templates' });
  }
});

export default router;