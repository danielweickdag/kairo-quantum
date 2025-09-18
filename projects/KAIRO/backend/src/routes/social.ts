import express from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Get social feed
// @route   GET /api/social/feed
// @access  Private
router.get('/feed', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const userId = req.user!.id;
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Get posts from followed users and own posts
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map(f => f.followingId);
  followingIds.push(userId); // Include own posts

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        userId: {
          in: followingIds,
        },
      },
      skip,
      take: parseInt(limit as string),
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
    likes: undefined, // Remove the likes array, we only needed it for checking
  }));

  res.json({
    success: true,
    data: {
      posts: postsWithLikeStatus,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    },
  });
}));

// @desc    Create new post
// @route   POST /api/social/posts
// @access  Private
router.post('/posts', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const userId = req.user!.id;
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

// @desc    Get post by ID
// @route   GET /api/social/posts/:id
// @access  Private
router.get('/posts/:id', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { id } = req.params;
  const userId = req.user!.id;

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

  // Check if user liked this post
  const userLike = await prisma.like.findFirst({
    where: {
      postId: id,
      userId: req.user!.id,
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

// @desc    Like/Unlike post
// @route   POST /api/social/posts/:id/like
// @access  Private
router.post('/posts/:id/like', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { id: postId } = req.params;
  const userId = req.user!.id;

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
    // Unlike
    await prisma.like.delete({
      where: { id: existingLike.id },
    });

    res.json({
      success: true,
      message: 'Post unliked',
      data: { isLiked: false },
    });
  } else {
    // Like
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

// @desc    Add comment to post
// @route   POST /api/social/posts/:id/comments
// @access  Private
router.post('/posts/:id/comments', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { id: postId } = req.params;
  const userId = req.user!.id;
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

// @desc    Get user's posts
// @route   GET /api/social/users/:id/posts
// @access  Private
router.get('/users/:id/posts', asyncHandler(async (req: AuthenticatedRequest, res: any) => {
  const { id: targetUserId } = req.params;
  const currentUserId = req.user!.id;
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { userId: targetUserId },
      skip,
      take: parseInt(limit as string),
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
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    },
  });
}));

export default router;