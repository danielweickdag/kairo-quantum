import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { BrokerService } from '../services/BrokerService';
import { BrokerType } from '../types/broker';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Validation rules
const createBrokerConnectionValidation = [
  body('brokerType')
    .isIn(Object.values(BrokerType))
    .withMessage('Invalid broker type'),
  body('accountName')
    .isLength({ min: 1, max: 100 })
    .withMessage('Account name must be between 1 and 100 characters'),
  body('credentials.apiKey')
    .isLength({ min: 1 })
    .withMessage('API key is required'),
  body('credentials.apiSecret')
    .isLength({ min: 1 })
    .withMessage('API secret is required'),
  body('credentials.environment')
    .isIn(['sandbox', 'production'])
    .withMessage('Environment must be sandbox or production'),
  body('credentials.accountId')
    .optional()
    .isString()
    .withMessage('Account ID must be a string'),
  body('credentials.accessToken')
    .optional()
    .isString()
    .withMessage('Access token must be a string'),
  body('credentials.refreshToken')
    .optional()
    .isString()
    .withMessage('Refresh token must be a string')
];

const connectionIdValidation = [
  param('connectionId')
    .isUUID()
    .withMessage('Invalid connection ID')
];

const placeOrderValidation = [
  body('symbol')
    .isLength({ min: 1, max: 10 })
    .withMessage('Symbol is required and must be 1-10 characters'),
  body('side')
    .isIn(['BUY', 'SELL'])
    .withMessage('Side must be BUY or SELL'),
  body('quantity')
    .isFloat({ min: 0.001 })
    .withMessage('Quantity must be greater than 0'),
  body('orderType')
    .isIn(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'])
    .withMessage('Invalid order type'),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  body('stopPrice')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Stop price must be greater than 0'),
  body('timeInForce')
    .optional()
    .isIn(['DAY', 'GTC', 'IOC', 'FOK'])
    .withMessage('Invalid time in force')
];

// Helper function to handle validation errors
const handleValidationErrors = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// GET /api/brokers/connections - Get all broker connections for user
router.get('/connections', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const connections = await BrokerService.getUserBrokerConnections(userId);
    
    // Remove sensitive credential data from response
    const sanitizedConnections = connections.map(conn => ({
      id: conn.id,
      userId: conn.userId,
      brokerType: conn.brokerType,
      accountName: conn.accountName,
      isActive: conn.isActive,
      isConnected: conn.isConnected,
      lastSyncAt: conn.lastSyncAt,
      environment: conn.credentials.environment,
      createdAt: conn.createdAt,
      updatedAt: conn.updatedAt
    }));

    res.json({ success: true, data: sanitizedConnections });
  } catch (error) {
    console.error('Error getting broker connections:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/brokers/accounts - Get user's broker accounts with detailed account information
router.get('/accounts', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const accounts = await BrokerService.getUserBrokerAccountsWithDetails(userId);
    
    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error('Error fetching broker accounts:', error);
    res.status(500).json({ error: 'Failed to fetch broker accounts' });
  }
})

// POST /api/brokers/connections - Create new broker connection
router.post('/connections', 
  authenticateToken,
  createBrokerConnectionValidation,
  handleValidationErrors,
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'User not authenticated' });
      }

      const { brokerType, accountName, credentials } = req.body;

      const result = await BrokerService.createBrokerConnection(
        userId,
        brokerType,
        accountName,
        credentials
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      // Remove sensitive credential data from response
      const sanitizedResult = {
        ...result,
        data: result.data ? {
          ...result.data,
          credentials: {
            environment: result.data.credentials.environment,
            accountId: result.data.credentials.accountId
          }
        } : undefined
      };

      res.status(201).json(sanitizedResult);
    } catch (error) {
      console.error('Error creating broker connection:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// GET /api/brokers/connections/:connectionId/test - Test broker connection
router.get('/connections/:connectionId/test',
  authenticateToken,
  connectionIdValidation,
  handleValidationErrors,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { connectionId } = req.params;
      const status = await BrokerService.testBrokerConnection(connectionId);
      res.json({ success: true, data: status });
    } catch (error) {
      console.error('Error testing broker connection:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// POST /api/brokers/connections/:connectionId/sync - Sync account data
router.post('/connections/:connectionId/sync',
  authenticateToken,
  connectionIdValidation,
  handleValidationErrors,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { connectionId } = req.params;
      const result = await BrokerService.syncBrokerAccount(connectionId);
      res.json(result);
    } catch (error) {
      console.error('Error syncing broker account:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// GET /api/brokers/connections/:connectionId/positions - Get positions
router.get('/connections/:connectionId/positions',
  authenticateToken,
  connectionIdValidation,
  handleValidationErrors,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { connectionId } = req.params;
      const result = await BrokerService.getBrokerPositions(connectionId);
      res.json(result);
    } catch (error) {
      console.error('Error getting broker positions:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// POST /api/brokers/connections/:connectionId/orders - Place order
router.post('/connections/:connectionId/orders',
  authenticateToken,
  connectionIdValidation,
  placeOrderValidation,
  handleValidationErrors,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { connectionId } = req.params;
      const orderData = req.body;
      
      const result = await BrokerService.placeBrokerOrder(connectionId, orderData);
      res.json(result);
    } catch (error) {
      console.error('Error placing broker order:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// PATCH /api/brokers/connections/:connectionId/status - Update connection status
router.patch('/connections/:connectionId/status',
  authenticateToken,
  connectionIdValidation,
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  handleValidationErrors,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { connectionId } = req.params;
      const { isActive } = req.body;
      
      const result = await BrokerService.updateBrokerConnectionStatus(connectionId, isActive);
      res.json(result);
    } catch (error) {
      console.error('Error updating broker connection status:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// DELETE /api/brokers/connections/:connectionId - Delete broker connection
router.delete('/connections/:connectionId',
  authenticateToken,
  connectionIdValidation,
  handleValidationErrors,
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.id;
      const { connectionId } = req.params;
      
      if (!userId) {
        return res.status(401).json({ success: false, error: 'User not authenticated' });
      }
      
      const result = await BrokerService.deleteBrokerConnection(connectionId, userId);
      res.json(result);
    } catch (error) {
      console.error('Error deleting broker connection:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// GET /api/brokers/supported - Get list of supported brokers
router.get('/supported', (req, res) => {
  const supportedBrokers = [
    {
      type: BrokerType.ALPACA,
      name: 'Alpaca',
      description: 'Commission-free stock and crypto trading',
      logoUrl: '/images/brokers/alpaca.png',
      isEnabled: true,
      capabilities: {
        supportsStocks: true,
        supportsOptions: false,
        supportsCrypto: true,
        supportsForex: false,
        supportsFractionalShares: true,
        supportsMarginTrading: true,
        supportsShortSelling: true,
        supportsRealTimeData: true,
        supportsHistoricalData: true,
        supportsOrderTypes: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'],
        commissionStructure: {
          stocks: 0,
          crypto: 0
        }
      },
      authConfig: {
        requiresApiKey: true,
        requiresApiSecret: true,
        requiresAccessToken: false,
        supportsSandbox: true,
        documentationUrl: 'https://alpaca.markets/docs/'
      }
    },
    {
      type: BrokerType.INTERACTIVE_BROKERS,
      name: 'Interactive Brokers',
      description: 'Professional trading platform with global markets',
      logoUrl: '/images/brokers/interactive-brokers.png',
      isEnabled: true,
      capabilities: {
        supportsStocks: true,
        supportsOptions: true,
        supportsCrypto: true,
        supportsForex: true,
        supportsFractionalShares: false,
        supportsMarginTrading: true,
        supportsShortSelling: true,
        supportsRealTimeData: true,
        supportsHistoricalData: true,
        supportsOrderTypes: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT', 'TRAIL'],
        commissionStructure: {
          stocks: 0.005,
          crypto: 0.18
        }
      },
      authConfig: {
        requiresApiKey: true,
        requiresApiSecret: true,
        requiresAccessToken: false,
        supportsSandbox: true,
        documentationUrl: 'https://interactivebrokers.github.io/'
      }
    },
    {
      type: BrokerType.TD_AMERITRADE,
      name: 'TD Ameritrade',
      description: 'Full-service brokerage with advanced tools',
      logoUrl: '/images/brokers/td-ameritrade.png',
      isEnabled: true,
      capabilities: {
        supportsStocks: true,
        supportsOptions: true,
        supportsCrypto: false,
        supportsForex: true,
        supportsFractionalShares: false,
        supportsMarginTrading: true,
        supportsShortSelling: true,
        supportsRealTimeData: true,
        supportsHistoricalData: true,
        supportsOrderTypes: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'],
        commissionStructure: {
          stocks: 0,
          crypto: 0
        }
      },
      authConfig: {
        requiresApiKey: true,
        requiresApiSecret: false,
        requiresAccessToken: true,
        supportsSandbox: true,
        documentationUrl: 'https://developer.tdameritrade.com/'
      }
    },
    {
      type: BrokerType.ROBINHOOD,
      name: 'Robinhood',
      description: 'Commission-free mobile-first trading',
      logoUrl: '/images/brokers/robinhood.png',
      isEnabled: false,
      capabilities: {
        supportsStocks: true,
        supportsOptions: true,
        supportsCrypto: true,
        supportsForex: false,
        supportsFractionalShares: true,
        supportsMarginTrading: true,
        supportsShortSelling: false,
        supportsRealTimeData: true,
        supportsHistoricalData: true,
        supportsOrderTypes: ['MARKET', 'LIMIT'],
        commissionStructure: {
          stocks: 0,
          crypto: 0
        }
      },
      authConfig: {
        requiresApiKey: false,
        requiresApiSecret: false,
        requiresAccessToken: true,
        supportsSandbox: false,
        documentationUrl: 'https://robinhood.com/us/en/support/'
      }
    },
    {
      type: BrokerType.SCHWAB,
      name: 'Charles Schwab',
      description: 'Comprehensive investment services',
      logoUrl: '/images/brokers/schwab.png',
      isEnabled: true,
      capabilities: {
        supportsStocks: true,
        supportsOptions: true,
        supportsCrypto: false,
        supportsForex: true,
        supportsFractionalShares: true,
        supportsMarginTrading: true,
        supportsShortSelling: true,
        supportsRealTimeData: true,
        supportsHistoricalData: true,
        supportsOrderTypes: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'],
        commissionStructure: {
          stocks: 0,
          crypto: 0
        }
      },
      authConfig: {
        requiresApiKey: true,
        requiresApiSecret: true,
        requiresAccessToken: false,
        supportsSandbox: true,
        documentationUrl: 'https://developer.schwab.com/'
      }
    },
    {
      type: BrokerType.ETRADE,
      name: 'E*TRADE',
      description: 'Online trading and investment platform',
      logoUrl: '/images/brokers/etrade.png',
      isEnabled: true,
      capabilities: {
        supportsStocks: true,
        supportsOptions: true,
        supportsCrypto: false,
        supportsForex: true,
        supportsFractionalShares: false,
        supportsMarginTrading: true,
        supportsShortSelling: true,
        supportsRealTimeData: true,
        supportsHistoricalData: true,
        supportsOrderTypes: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'],
        commissionStructure: {
          stocks: 0,
          crypto: 0
        }
      },
      authConfig: {
        requiresApiKey: true,
        requiresApiSecret: true,
        requiresAccessToken: true,
        supportsSandbox: true,
        documentationUrl: 'https://developer.etrade.com/'
      }
    }
  ];

  res.json({ success: true, data: supportedBrokers });
});

export default router;