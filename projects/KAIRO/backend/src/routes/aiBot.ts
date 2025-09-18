import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { AITradingBot } from '../services/aiTradingBot';
import { PerformanceTracker } from '../services/performanceTracker';
import { WebSocketService } from '../services/websocketService';
import { TradingService } from '../services/tradingService';
import { logger } from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

// Store active bot instances
const activeBots = new Map<string, AITradingBot>();
const performanceTracker = new PerformanceTracker(prisma);

interface BotConfigRequest {
  name: string;
  enabled: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  maxPositionSize: number;
  minConfidence: number;
  tradingPairs: string[];
  stopLossPercentage: number;
  takeProfitRatio: number;
  maxDailyTrades: number;
  riskPerTrade: number;
}

// Get user's bot configurations
router.get('/configs', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // For now, return a default config since we don't have a BotConfig model
    // In a real implementation, you'd fetch from database
    const defaultConfig = {
      id: `bot-${userId}`,
      userId,
      name: 'KAIRO AI Bot',
      enabled: false,
      riskLevel: 'MEDIUM',
      maxPositionSize: 10,
      minConfidence: 0.7,
      tradingPairs: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'],
      stopLossPercentage: 2,
      takeProfitRatio: 2,
      maxDailyTrades: 10,
      riskPerTrade: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({ configs: [defaultConfig] });
  } catch (error) {
    logger.error('Error fetching bot configs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update bot configuration
router.post('/config', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const config: BotConfigRequest = req.body;

    // Validate configuration
    if (!config.name || config.name.trim().length === 0) {
      return res.status(400).json({ error: 'Bot name is required' });
    }

    if (config.maxPositionSize < 1 || config.maxPositionSize > 50) {
      return res.status(400).json({ error: 'Max position size must be between 1% and 50%' });
    }

    if (config.minConfidence < 0.1 || config.minConfidence > 1) {
      return res.status(400).json({ error: 'Min confidence must be between 0.1 and 1.0' });
    }

    if (config.riskPerTrade < 0.1 || config.riskPerTrade > 5) {
      return res.status(400).json({ error: 'Risk per trade must be between 0.1% and 5%' });
    }

    // In a real implementation, save to database
    const savedConfig = {
      id: `bot-${userId}`,
      userId,
      ...config,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({ config: savedConfig });
  } catch (error) {
    logger.error('Error saving bot config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start AI bot
router.post('/start', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { configId } = req.body;
    if (!configId) {
      return res.status(400).json({ error: 'Config ID is required' });
    }

    // Check if bot is already running
    if (activeBots.has(userId)) {
      return res.status(400).json({ error: 'Bot is already running' });
    }

    // Get user's default portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId }
    });

    if (!portfolio) {
      return res.status(400).json({ error: 'No portfolio found' });
    }

    // Create bot configuration
    const botConfig = {
      id: `bot-${userId}`,
      botId: `bot-${userId}`,
      userId,
      portfolioId: portfolio.id,
      name: 'KAIRO AI Bot',
      enabled: true,
      isActive: true,
      riskLevel: 'MEDIUM' as const,
      maxPositionSize: 10,
      minConfidence: 0.7,
      tradingPairs: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'],
      stopLossPercentage: 2,
      takeProfitRatio: 2,
      maxDailyTrades: 10,
      maxDailyLoss: 5,
      riskPerTrade: 1,
      targetProfitability: 90,
      strategies: ['momentum', 'meanReversion', 'volumeAnalysis'],
      mlModelVersion: 'v1.0.0'
    };

    // Create services (in a real implementation, these would be injected)
    const wsService = new WebSocketService(req.app.get('io'));
    const tradingService = new TradingService(prisma);

    // Create and start bot
    const bot = new AITradingBot(prisma, wsService, tradingService, botConfig);
    await bot.start();

    // Store active bot
    activeBots.set(userId, bot);

    res.json({ 
      message: 'AI bot started successfully',
      botId: botConfig.botId,
      status: 'running'
    });
  } catch (error) {
    logger.error('Error starting AI bot:', error);
    res.status(500).json({ error: 'Failed to start AI bot' });
  }
});

// Stop AI bot
router.post('/stop', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const bot = activeBots.get(userId);
    if (!bot) {
      return res.status(400).json({ error: 'No active bot found' });
    }

    await bot.stop();
    activeBots.delete(userId);

    res.json({ 
      message: 'AI bot stopped successfully',
      status: 'stopped'
    });
  } catch (error) {
    logger.error('Error stopping AI bot:', error);
    res.status(500).json({ error: 'Failed to stop AI bot' });
  }
});

// Get bot status
router.get('/status', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const bot = activeBots.get(userId);
    const isRunning = bot !== undefined;

    let performance = null;
    if (bot) {
      performance = await bot.getPerformanceMetrics();
    }

    res.json({ 
      isRunning,
      botId: isRunning ? `bot-${userId}` : null,
      performance,
      activeSince: isRunning ? new Date() : null // In real implementation, track start time
    });
  } catch (error) {
    logger.error('Error getting bot status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bot trades history
router.get('/trades', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { limit = 50, offset = 0 } = req.query;

    const trades = await prisma.botTrade.findMany({
      where: { userId },
      orderBy: { executedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });
    
    const totalTrades = await prisma.botTrade.count({
      where: { userId }
    });

    res.json({ 
      trades,
      pagination: {
        total: totalTrades,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    logger.error('Error fetching bot trades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bot performance analytics
router.get('/analytics', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const endDate = now;
    
    // Use performance tracker for comprehensive analytics
    const performance = await performanceTracker.calculateBotPerformance(
      userId,
      undefined, // All bots
      startDate,
      endDate
    );
    
    const symbolAnalysis = await performanceTracker.getTradeAnalysisBySymbol(
      userId,
      undefined, // All bots
      startDate,
      endDate
    );
    
    const botConfigPerformance = await performanceTracker.getBotConfigPerformance(userId);

    res.json({
      performance,
      symbolAnalysis,
      botConfigPerformance,
      dailyReturns: performance.dailyReturns
    });
  } catch (error) {
    logger.error('Error fetching bot analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;