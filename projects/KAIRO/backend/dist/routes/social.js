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
router.get('/feed', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
    });
    const followingIds = following.map(f => f.followingId);
    followingIds.push(userId);
    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: {
                userId: {
                    in: followingIds,
                },
            },
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
                        comments: true,
                        likes: true,
                    },
                },
                likes: {
                    where: { userId },
                    select: { id: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.post.count({
            where: {
                userId: {
                    in: followingIds,
                },
            },
        }),
    ]);
    const postsWithLikeStatus = posts.map(post => ({
        ...post,
        isLiked: post.likes.length > 0,
        likes: undefined,
    }));
    res.json({
        success: true,
        data: {
            posts: postsWithLikeStatus,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        },
    });
}));
router.post('/posts', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { content, imageUrl, portfolioId } = req.body;
    if (!content) {
        return res.status(400).json({
            success: false,
            message: 'Content is required',
        });
    }
    const post = await prisma.post.create({
        data: {
            content,
            imageUrl,
            userId,
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
                    comments: true,
                    likes: true,
                },
            },
        },
    });
    res.status(201).json({
        success: true,
        data: { post: { ...post, isLiked: false } },
    });
}));
router.get('/posts/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const post = await prisma.post.findUnique({
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
            likes: {
                where: {
                    userId: req.user?.id,
                },
            },
            comments: {
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
                orderBy: {
                    createdAt: 'desc',
                },
            },
            _count: {
                select: {
                    comments: true,
                    likes: true,
                },
            },
        },
    });
    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found',
        });
    }
    const userLike = await prisma.like.findFirst({
        where: {
            postId: id,
            userId: req.user.id,
        },
    });
    res.json({
        success: true,
        data: {
            post: {
                ...post,
                isLiked: !!userLike,
            },
        },
    });
}));
router.post('/posts/:id/like', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id: postId } = req.params;
    const userId = req.user.id;
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });
    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found',
        });
    }
    const existingLike = await prisma.like.findFirst({
        where: {
            userId,
            postId,
        },
    });
    if (existingLike) {
        await prisma.like.delete({
            where: { id: existingLike.id },
        });
        res.json({
            success: true,
            message: 'Post unliked',
            data: { isLiked: false },
        });
    }
    else {
        await prisma.like.create({
            data: {
                userId,
                postId,
            },
        });
        res.json({
            success: true,
            message: 'Post liked',
            data: { isLiked: true },
        });
    }
}));
router.post('/posts/:id/comments', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id: postId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({
            success: false,
            message: 'Content is required',
        });
    }
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });
    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found',
        });
    }
    const comment = await prisma.comment.create({
        data: {
            content,
            userId,
            postId,
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
        },
    });
    res.status(201).json({
        success: true,
        data: { comment },
    });
}));
router.get('/users/:id/posts', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id: targetUserId } = req.params;
    const currentUserId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: { userId: targetUserId },
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
                        comments: true,
                        likes: true,
                    },
                },
                likes: {
                    where: { userId: currentUserId },
                    select: { id: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.post.count({ where: { userId: targetUserId } }),
    ]);
    const postsWithLikeStatus = posts.map(post => ({
        ...post,
        isLiked: post.likes.length > 0,
    }));
    res.json({
        success: true,
        data: {
            posts: postsWithLikeStatus,
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
//# sourceMappingURL=social.js.map