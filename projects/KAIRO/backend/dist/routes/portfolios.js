"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 20, search, riskLevel, sortBy = 'performance' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
        isPublic: true,
    };
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            {
                user: {
                    OR: [
                        { username: { contains: search, mode: 'insensitive' } },
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                    ],
                },
            },
        ];
    }
    if (riskLevel) {
        where.riskLevel = riskLevel;
    }
    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'performance') {
        orderBy = { totalReturn: 'desc' };
    }
    else if (sortBy === 'followers') {
        orderBy = { _count: { copyTrades: 'desc' } };
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
router.get('/my', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [portfolios, total] = await Promise.all([
        prisma.portfolio.findMany({
            where: { userId },
            skip,
            take: parseInt(limit),
            include: {
                holdings: true,
                _count: {
                    select: {
                        copyTrades: true,
                        holdings: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.portfolio.count({ where: { userId } }),
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
router.post('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { name, description, riskLevel, isPublic = false, allowCopyTrading = false } = req.body;
    if (!name || !riskLevel) {
        return res.status(400).json({
            success: false,
            message: 'Name and risk level are required',
        });
    }
    const portfolio = await prisma.portfolio.create({
        data: {
            name,
            description,
            isPublic,
            userId,
            totalValue: 0,
            totalReturn: 0,
            totalReturnPct: 0,
        },
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
    });
    res.status(201).json({
        success: true,
        data: { portfolio },
    });
}));
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    const portfolio = await prisma.portfolio.findUnique({
        where: { id },
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
            performance: {
                orderBy: {
                    date: 'desc',
                },
                take: 30,
            },
            _count: {
                select: {
                    copyTrades: true,
                    holdings: true,
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
    if (!portfolio.isPublic && portfolio.userId !== currentUserId) {
        return res.status(403).json({
            success: false,
            message: 'This portfolio is private',
        });
    }
    let isCopyTrading = false;
    if (currentUserId && currentUserId !== portfolio.userId) {
        const copyTrade = await prisma.copyTrade.findFirst({
            where: {
                followerId: currentUserId,
                portfolioId: portfolio.id,
                isActive: true,
            },
        });
        isCopyTrading = !!copyTrade;
    }
    res.json({
        success: true,
        data: {
            portfolio: {
                ...portfolio,
                isCopyTrading,
            },
        },
    });
}));
router.put('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, riskLevel, isPublic, allowCopyTrading } = req.body;
    const portfolio = await prisma.portfolio.findUnique({
        where: { id },
    });
    if (!portfolio) {
        return res.status(404).json({
            success: false,
            message: 'Portfolio not found',
        });
    }
    if (portfolio.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this portfolio',
        });
    }
    const updatedPortfolio = await prisma.portfolio.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(description !== undefined && { description }),
            ...(riskLevel && { riskLevel }),
            ...(isPublic !== undefined && { isPublic }),
            ...(allowCopyTrading !== undefined && { allowCopyTrading }),
        },
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
    });
    res.json({
        success: true,
        data: { portfolio: updatedPortfolio },
    });
}));
router.delete('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const portfolio = await prisma.portfolio.findUnique({
        where: { id },
    });
    if (!portfolio) {
        return res.status(404).json({
            success: false,
            message: 'Portfolio not found',
        });
    }
    if (portfolio.userId !== userId) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this portfolio',
        });
    }
    await prisma.portfolio.delete({
        where: { id },
    });
    res.json({
        success: true,
        message: 'Portfolio deleted successfully',
    });
}));
exports.default = router;
//# sourceMappingURL=portfolios.js.map