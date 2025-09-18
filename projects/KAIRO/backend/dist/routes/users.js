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
    const { page = 1, limit = 20, search, accountType } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {
        isPublic: true,
    };
    if (search) {
        where.OR = [
            { username: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (accountType) {
        where.accountType = accountType;
    }
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: parseInt(limit),
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                accountType: true,
                isVerified: true,
                createdAt: true,
                _count: {
                    select: {
                        followers: true,
                        portfolios: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.user.count({ where }),
    ]);
    res.json({
        success: true,
        data: {
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        },
    });
}));
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            accountType: true,
            isVerified: true,
            isPublic: true,
            createdAt: true,
            _count: {
                select: {
                    followers: true,
                    following: true,
                    portfolios: true,
                },
            },
        },
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }
    if (!user.isPublic && user.id !== currentUserId) {
        return res.status(403).json({
            success: false,
            message: 'This profile is private',
        });
    }
    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: user.id,
                },
            },
        });
        isFollowing = !!follow;
    }
    res.json({
        success: true,
        data: {
            user: {
                ...user,
                isFollowing,
            },
        },
    });
}));
router.post('/:id/follow', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id: targetUserId } = req.params;
    const currentUserId = req.user.id;
    if (targetUserId === currentUserId) {
        return res.status(400).json({
            success: false,
            message: 'You cannot follow yourself',
        });
    }
    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
    });
    if (!targetUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }
    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        },
    });
    if (existingFollow) {
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });
        res.json({
            success: true,
            message: 'User unfollowed successfully',
            data: { isFollowing: false },
        });
    }
    else {
        await prisma.follow.create({
            data: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        });
        res.json({
            success: true,
            message: 'User followed successfully',
            data: { isFollowing: true },
        });
    }
}));
router.get('/:id/followers', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [followers, total] = await Promise.all([
        prisma.follow.findMany({
            where: { followingId: id },
            skip,
            take: parseInt(limit),
            include: {
                follower: {
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
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.follow.count({ where: { followingId: id } }),
    ]);
    res.json({
        success: true,
        data: {
            followers: followers.map(f => f.follower),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        },
    });
}));
router.get('/:id/following', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [following, total] = await Promise.all([
        prisma.follow.findMany({
            where: { followerId: id },
            skip,
            take: parseInt(limit),
            include: {
                following: {
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
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.follow.count({ where: { followerId: id } }),
    ]);
    res.json({
        success: true,
        data: {
            following: following.map(f => f.following),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        },
    });
}));
exports.default = router;
//# sourceMappingURL=users.js.map