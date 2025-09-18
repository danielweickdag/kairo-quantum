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
    const userId = req.user.id;
    const { page = 1, limit = 20, portfolioId, symbol, side, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
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
            take: parseInt(limit),
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
    const { portfolioId, symbol, side, quantity, price, orderType = 'MARKET' } = req.body;
    if (!portfolioId || !symbol || !side || !quantity || !price) {
        return res.status(400).json({
            success: false,
            message: 'Portfolio ID, symbol, side, quantity, and price are required',
        });
    }
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
    const trade = await prisma.trade.create({
        data: {
            symbol,
            userId,
            portfolioId,
            side,
            quantity: parseFloat(quantity),
            price: parseFloat(price),
            totalValue: parseFloat(quantity) * parseFloat(price),
            status: 'EXECUTED',
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
    }
    else if (side === 'SELL') {
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
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
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
router.put('/:id/cancel', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
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
exports.default = router;
//# sourceMappingURL=trades.js.map