import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get user's copy trades
// @route   GET /api/copy-trades
// @access  Private
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const userId = req.user!.id;
  const { page = 1, limit = 20, isActive } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const where: any = { userId };
  
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const [copyTrades, total] = await Promise.all([
    prisma.copyTrade.findMany({
      where,
      skip,
      take: parseInt(limit as string),
      include: {
        portfolio: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                accountType: true,
                isVerified: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.copyTrade.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      copyTrades,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    },
  });
}));

// @desc    Start copy trading a portfolio
// @route   POST /api/copy-trades
// @access  Private
router.post('/', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const userId = req.user!.id;
  const { portfolioId, allocationAmount, riskMultiplier = 1 } = req.body;

  if (!portfolioId || !allocationAmount) {
    return res.status(400).json({
      success: false,
      message: 'Portfolio ID and allocation amount are required',
    });
  }

  // Check if portfolio exists and allows copy trading
  const portfolio = await prisma.portfolio.findUnique({
    where: { id: portfolioId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!portfolio) {
    return res.status(404).json({
      success: false,
      message: 'Portfolio not found',
    });
  }

  if (!portfolio.allowCopyTrading) {
    return res.status(400).json({
      success: false,
      message: 'This portfolio does not allow copy trading',
    });
  }

  if (portfolio.userId === userId) {
    return res.status(400).json({
      success: false,
      message: 'You cannot copy trade your own portfolio',
    });
  }

  // Check if already copy trading this portfolio
  const existingCopyTrade = await prisma.copyTrade.findFirst({
    where: {
      followerId: userId,
      portfolioId,
      isActive: true,
    },
  });

  if (existingCopyTrade) {
    return res.status(400).json({
      success: false,
      message: 'You are already copy trading this portfolio',
    });
  }

  const copyTrade = await prisma.copyTrade.create({
    data: {
      followerId: userId,
      leaderId: portfolio.userId,
      portfolioId,
      allocation: parseFloat(allocationAmount),
      isActive: true,
      totalReturn: 0,
      totalReturnPct: 0,
    },
    include: {
      portfolio: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              accountType: true,
              isVerified: true,
            },
          },
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    data: { copyTrade },
  });
}));

// @desc    Get copy trade by ID
// @route   GET /api/copy-trades/:id
// @access  Private
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const copyTrade = await prisma.copyTrade.findFirst({
    where: {
      id,
      followerId: userId,
    },
    include: {
      portfolio: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              accountType: true,
              isVerified: true,
            },
          },
          holdings: true,
        },
      },
    },
  });

  if (!copyTrade) {
    return res.status(404).json({
      success: false,
      message: 'Copy trade not found',
    });
  }

  res.json({
    success: true,
    data: { copyTrade },
  });
}));

// @desc    Update copy trade settings
// @route   PUT /api/copy-trades/:id
// @access  Private
router.put('/:id', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const { allocationAmount, riskMultiplier, isActive } = req.body;

  const copyTrade = await prisma.copyTrade.findFirst({
    where: {
      id,
      followerId: userId,
    },
  });

  if (!copyTrade) {
    return res.status(404).json({
      success: false,
      message: 'Copy trade not found',
    });
  }

  const updatedCopyTrade = await prisma.copyTrade.update({
    where: { id },
    data: {
      ...(allocationAmount && { allocation: parseFloat(allocationAmount) }),
      ...(isActive !== undefined && { isActive }),
    },
    include: {
      portfolio: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              accountType: true,
              isVerified: true,
            },
          },
        },
      },
    },
  });

  res.json({
    success: true,
    data: { copyTrade: updatedCopyTrade },
  });
}));

// @desc    Stop copy trading (deactivate)
// @route   DELETE /api/copy-trades/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const copyTrade = await prisma.copyTrade.findFirst({
    where: {
      id,
      followerId: userId,
    },
  });

  if (!copyTrade) {
    return res.status(404).json({
      success: false,
      message: 'Copy trade not found',
    });
  }

  await prisma.copyTrade.update({
    where: { id },
    data: {
      isActive: false,
    },
  });

  res.json({
    success: true,
    message: 'Copy trading stopped successfully',
  });
}));

// @desc    Get popular portfolios for copy trading
// @route   GET /api/copy-trades/discover
// @access  Private
router.get('/discover', asyncHandler(async (req: any, res: any) => {
  const { page = 1, limit = 20, riskLevel, minReturn, sortBy = 'performance' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = {
    allowCopyTrading: true,
    isPublic: true,
  };

  if (riskLevel) {
    where.riskLevel = riskLevel;
  }

  if (minReturn) {
    where.totalReturnPct = {
      gte: parseFloat(minReturn),
    };
  }

  let orderBy: any = { totalReturnPct: 'desc' };
  if (sortBy === 'followers') {
    orderBy = { _count: { copyTrades: 'desc' } };
  } else if (sortBy === 'recent') {
    orderBy = { createdAt: 'desc' };
  }

  const [portfolios, total] = await Promise.all([
    prisma.portfolio.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            accountType: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            copyTrades: true,
            holdings: true,
          },
        },
      },
      orderBy,
    }),
    prisma.portfolio.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      portfolios,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
}));

export default router;