import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get user's trades
// @route   GET /api/trades
// @access  Private
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const userId = req.user!.id;
  const { page = 1, limit = 20, portfolioId, symbol, side, status } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const where: any = {
    portfolio: {
      userId,
    },
  };

  if (portfolioId) {
    where.portfolioId = portfolioId;
  }

  if (symbol) {
    where.symbol = { contains: symbol, mode: 'insensitive' };
  }

  if (side) {
    where.side = side;
  }

  if (status) {
    where.status = status;
  }

  const [trades, total] = await Promise.all([
    prisma.trade.findMany({
      where,
      skip,
      take: parseInt(limit as string),
      include: {
        portfolio: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.trade.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      trades,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    },
  });
}));

// @desc    Create new trade
// @route   POST /api/trades
// @access  Private
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const userId = req.user!.id;
  const { portfolioId, symbol, side, quantity, price, orderType = 'MARKET' } = req.body;

  if (!portfolioId || !symbol || !side || !quantity || !price) {
    return res.status(400).json({
      success: false,
      message: 'Portfolio ID, symbol, side, quantity, and price are required',
    });
  }

  // Verify portfolio ownership
  const portfolio = await prisma.portfolio.findFirst({
    where: {
      id: portfolioId,
      userId,
    },
  });

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found or not authorized',
    });
  }

  // Find or create holding
  let holding = await prisma.holding.findFirst({
    where: {
      portfolioId,
      symbol,
    },
  });

  if (!holding) {
    holding = await prisma.holding.create({
      data: {
        portfolioId,
        symbol,
        quantity: 0,
        averagePrice: 0,
        currentPrice: parseFloat(price),
        marketValue: 0,
        unrealizedPnL: 0,
        unrealizedPnLPct: 0,
      },
    });
  }

  // Create trade
  const trade = await prisma.trade.create({
    data: {
      symbol,
      userId,
      portfolioId,
      side,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      totalValue: parseFloat(quantity) * parseFloat(price),
      status: 'EXECUTED', // In a real app, this would be PENDING initially
      executedAt: new Date(),
    },
    include: {
      portfolio: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Update holding based on trade
  const tradeValue = parseFloat(quantity) * parseFloat(price);
  
  if (side === 'BUY') {
    const newQuantity = holding.quantity + parseFloat(quantity);
    const newAveragePrice = newQuantity > 0 
      ? ((holding.quantity * holding.averagePrice) + tradeValue) / newQuantity
      : parseFloat(price);
    
    await prisma.holding.update({
      where: { id: holding.id },
      data: {
        quantity: newQuantity,
        averagePrice: newAveragePrice,
        currentPrice: parseFloat(price),
        marketValue: newQuantity * parseFloat(price),
      },
    });
  } else if (side === 'SELL') {
    const newQuantity = holding.quantity - parseFloat(quantity);
    const realizedPnL = parseFloat(quantity) * (parseFloat(price) - holding.averagePrice);
    
    await prisma.holding.update({
      where: { id: holding.id },
      data: {
        quantity: Math.max(0, newQuantity),
        currentPrice: parseFloat(price),
        marketValue: Math.max(0, newQuantity) * parseFloat(price),
      },
    });
  }

  // Update portfolio total value
  const portfolioHoldings = await prisma.holding.findMany({
    where: { portfolioId },
  });
  
  const totalValue = portfolioHoldings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalUnrealizedPnL = portfolioHoldings.reduce((sum, h) => sum + h.unrealizedPnL, 0);
  const totalReturn = totalUnrealizedPnL;
  
  await prisma.portfolio.update({
    where: { id: portfolioId },
    data: {
      totalValue,
      totalReturn,
      totalReturnPct: totalValue > 0 ? (totalReturn / totalValue) * 100 : 0,
    },
  });

  res.status(201).json({
    success: true,
    data: { trade },
  });
}));

// @desc    Get trade by ID
// @route   GET /api/trades/:id
// @access  Private
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const trade = await prisma.trade.findFirst({
    where: {
      id,
      portfolio: {
        userId,
      },
    },
    include: {
      portfolio: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!trade) {
    return res.status(404).json({
      success: false,
      message: 'Trade not found or not authorized',
    });
  }

  res.json({
    success: true,
    data: { trade },
  });
}));

// @desc    Cancel trade
// @route   PUT /api/trades/:id/cancel
// @access  Private
router.put('/:id/cancel', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const trade = await prisma.trade.findFirst({
    where: {
      id,
      portfolio: {
        userId,
      },
    },
  });

  if (!trade) {
    return res.status(404).json({
      success: false,
      message: 'Trade not found or not authorized',
    });
  }

  if (trade.status !== 'PENDING') {
    return res.status(400).json({
      success: false,
      message: 'Only pending trades can be cancelled',
    });
  }

  const updatedTrade = await prisma.trade.update({
    where: { id },
    data: {
      status: 'CANCELLED',
    },
    include: {
      portfolio: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: { trade: updatedTrade },
  });
}));

export default router;