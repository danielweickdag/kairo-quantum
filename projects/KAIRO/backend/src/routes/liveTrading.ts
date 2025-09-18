import express from 'express';
import { Request, Response } from 'express';
import OrderExecutionService, { Order, RiskLimits, BrokerConfig } from '../services/orderExecutionService';
import { WebSocketService } from '../services/websocketService';
import { logger } from '../utils/logger';
import { authenticateToken } from '../middleware/auth';

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

const router = express.Router();

// This will be injected by the main app
let orderExecutionService: OrderExecutionService;
let websocketService: WebSocketService;

// Initialize services
export const initializeLiveTradingRoutes = (orderService: OrderExecutionService, wsService: WebSocketService) => {
  orderExecutionService = orderService;
  websocketService = wsService;
};

// Middleware to check if live trading is enabled
const requireLiveTrading = (req: AuthenticatedRequest, res: Response, next: any) => {
  if (!orderExecutionService?.isLiveTradingActive()) {
    return res.status(403).json({ 
      error: 'Live trading is not enabled',
      code: 'LIVE_TRADING_DISABLED'
    });
  }
  next();
};

// Live Trading Control Routes

// Enable live trading
router.post('/enable', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user has admin privileges (in real app, implement proper role checking)
    // For now, allow any authenticated user
    
    orderExecutionService.enableLiveTrading();
    
    logger.info(`Live trading enabled by user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Live trading enabled',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error enabling live trading:', error);
    res.status(500).json({ error: 'Failed to enable live trading' });
  }
});

// Disable live trading
router.post('/disable', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    orderExecutionService.disableLiveTrading();
    
    logger.info(`Live trading disabled by user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Live trading disabled',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error disabling live trading:', error);
    res.status(500).json({ error: 'Failed to disable live trading' });
  }
});

// Get live trading status
router.get('/status', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const isEnabled = orderExecutionService.isLiveTradingActive();
    const wsEnabled = websocketService.isLiveTradingActive();
    
    res.json({ 
      liveTradingEnabled: isEnabled,
      websocketEnabled: wsEnabled,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting live trading status:', error);
    res.status(500).json({ error: 'Failed to get live trading status' });
  }
});

// Broker Configuration Routes

// Set broker configuration
router.post('/broker-config', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { name, apiKey, apiSecret, sandbox, baseUrl } = req.body;
    
    if (!name || !apiKey || !apiSecret || !baseUrl) {
      return res.status(400).json({ error: 'Missing required broker configuration fields' });
    }

    const brokerConfig: BrokerConfig = {
      name,
      apiKey,
      apiSecret,
      sandbox: sandbox || true, // Default to sandbox
      baseUrl
    };

    orderExecutionService.setBrokerConfig(userId, brokerConfig);
    
    logger.info(`Broker configuration set for user ${userId}: ${name}`);
    
    res.json({ 
      success: true, 
      message: 'Broker configuration saved',
      broker: { name, sandbox, baseUrl } // Don't return sensitive data
    });
  } catch (error) {
    logger.error('Error setting broker configuration:', error);
    res.status(500).json({ error: 'Failed to set broker configuration' });
  }
});

// Get broker configuration (without sensitive data)
router.get('/broker-config', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const config = orderExecutionService.getBrokerConfig(userId);
    
    if (!config) {
      return res.status(404).json({ error: 'No broker configuration found' });
    }

    // Return config without sensitive data
    res.json({
      name: config.name,
      sandbox: config.sandbox,
      baseUrl: config.baseUrl,
      configured: true
    });
  } catch (error) {
    logger.error('Error getting broker configuration:', error);
    res.status(500).json({ error: 'Failed to get broker configuration' });
  }
});

// Risk Management Routes

// Set risk limits
router.post('/risk-limits', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { maxOrderValue, maxDailyLoss, maxPositionSize, allowedSymbols, blockedSymbols } = req.body;
    
    if (maxOrderValue <= 0 || maxDailyLoss <= 0 || maxPositionSize <= 0) {
      return res.status(400).json({ error: 'Risk limits must be positive values' });
    }

    const riskLimits: RiskLimits = {
      maxOrderValue: maxOrderValue || 10000,
      maxDailyLoss: maxDailyLoss || 1000,
      maxPositionSize: maxPositionSize || 1000,
      allowedSymbols: allowedSymbols || [],
      blockedSymbols: blockedSymbols || []
    };

    orderExecutionService.setRiskLimits(userId, riskLimits);
    
    logger.info(`Risk limits set for user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Risk limits saved',
      riskLimits
    });
  } catch (error) {
    logger.error('Error setting risk limits:', error);
    res.status(500).json({ error: 'Failed to set risk limits' });
  }
});

// Get risk limits
router.get('/risk-limits', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const riskLimits = orderExecutionService.getRiskLimits(userId);
    
    if (!riskLimits) {
      return res.status(404).json({ error: 'No risk limits found' });
    }

    res.json(riskLimits);
  } catch (error) {
    logger.error('Error getting risk limits:', error);
    res.status(500).json({ error: 'Failed to get risk limits' });
  }
});

// Order Management Routes

// Submit order
router.post('/orders', authenticateToken, requireLiveTrading, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { 
      portfolioId, 
      symbol, 
      side, 
      type, 
      quantity, 
      price, 
      stopPrice, 
      timeInForce 
    } = req.body;
    
    // Validate required fields
    if (!portfolioId || !symbol || !side || !type || !quantity || !timeInForce) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    if (!['buy', 'sell'].includes(side)) {
      return res.status(400).json({ error: 'Invalid order side' });
    }

    if (!['market', 'limit', 'stop', 'stop_limit'].includes(type)) {
      return res.status(400).json({ error: 'Invalid order type' });
    }

    if (!['GTC', 'IOC', 'FOK', 'DAY'].includes(timeInForce)) {
      return res.status(400).json({ error: 'Invalid time in force' });
    }

    const orderRequest = {
      userId,
      portfolioId,
      symbol: symbol.toUpperCase(),
      side,
      type,
      quantity: Number(quantity),
      price: price ? Number(price) : undefined,
      stopPrice: stopPrice ? Number(stopPrice) : undefined,
      timeInForce
    };

    const order = await orderExecutionService.submitOrder(orderRequest);
    
    logger.info(`Order submitted: ${order.id} for user ${userId}`);
    
    res.status(201).json({ 
      success: true, 
      message: 'Order submitted successfully',
      order
    });
  } catch (error) {
    logger.error('Error submitting order:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to submit order'
    });
  }
});

// Cancel order
router.delete('/orders/:orderId', authenticateToken, requireLiveTrading, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { orderId } = req.params;
    
    await orderExecutionService.cancelOrder(orderId, userId);
    
    logger.info(`Order cancelled: ${orderId} by user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    logger.error('Error cancelling order:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to cancel order'
    });
  }
});

// Get user orders
router.get('/orders', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { status, symbol, limit = 50 } = req.query;
    
    let orders = orderExecutionService.getUserOrders(userId);
    
    // Filter by status if provided
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    // Filter by symbol if provided
    if (symbol) {
      orders = orders.filter(order => order.symbol === (symbol as string).toUpperCase());
    }
    
    // Sort by creation date (newest first) and limit
    orders = orders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, Number(limit));
    
    res.json({ orders });
  } catch (error) {
    logger.error('Error getting user orders:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get specific order
router.get('/orders/:orderId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { orderId } = req.params;
    
    const order = orderExecutionService.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to view this order' });
    }
    
    res.json({ order });
  } catch (error) {
    logger.error('Error getting order:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Position Management Routes

// Get user positions
router.get('/positions', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const positions = orderExecutionService.getUserPositions(userId);
    
    res.json({ positions });
  } catch (error) {
    logger.error('Error getting user positions:', error);
    res.status(500).json({ error: 'Failed to get positions' });
  }
});

// Get specific position
router.get('/positions/:symbol', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { symbol } = req.params;
    
    const position = orderExecutionService.getPosition(userId, symbol.toUpperCase());
    
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    
    res.json({ position });
  } catch (error) {
    logger.error('Error getting position:', error);
    res.status(500).json({ error: 'Failed to get position' });
  }
});

// Emergency Controls

// Emergency stop
router.post('/emergency-stop', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { reason = 'Manual emergency stop' } = req.body;
    
    await orderExecutionService.emergencyStop(userId, reason);
    
    logger.warn(`Emergency stop executed for user ${userId}: ${reason}`);
    
    res.json({ 
      success: true, 
      message: 'Emergency stop executed',
      reason,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error executing emergency stop:', error);
    res.status(500).json({ error: 'Failed to execute emergency stop' });
  }
});

// Market Data Routes

// Get current prices
router.get('/market-data/prices', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { symbols } = req.query;
    
    if (symbols) {
      const symbolList = (symbols as string).split(',').map(s => s.toUpperCase());
      const prices = symbolList.map(symbol => websocketService.getCurrentPrice(symbol)).filter(Boolean);
      res.json({ prices });
    } else {
      const allPrices = websocketService.getAllPrices();
      res.json({ prices: allPrices });
    }
  } catch (error) {
    logger.error('Error getting market data:', error);
    res.status(500).json({ error: 'Failed to get market data' });
  }
});

export default router;