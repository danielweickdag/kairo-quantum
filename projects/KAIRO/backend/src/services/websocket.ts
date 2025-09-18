import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logWebSocket } from '../utils/logger';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const initializeWebSocket = (io: SocketIOServer) => {

  // Authentication middleware
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: any) => {
    logWebSocket.connection(socket.userId, socket.id);

    // Join user-specific room for notifications
    socket.join(`user:${socket.userId}`);

    // Join portfolio rooms for real-time updates
    socket.on('join-portfolio', async (portfolioId: string) => {
      try {
        // Verify user has access to this portfolio
        const portfolio = await prisma.portfolio.findFirst({
          where: {
            id: portfolioId,
            OR: [
              { userId: socket.userId },
              { isPublic: true },
              {
                copyTrades: {
                  some: {
                    followerId: socket.userId,
                    isActive: true,
                  },
                },
              },
            ],
          },
        });

        if (portfolio) {
          socket.join(`portfolio:${portfolioId}`);
          socket.emit('portfolio-joined', { portfolioId });
        } else {
          socket.emit('error', { message: 'Access denied to portfolio' });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to join portfolio' });
      }
    });

    // Leave portfolio room
    socket.on('leave-portfolio', (portfolioId: string) => {
      socket.leave(`portfolio:${portfolioId}`);
      socket.emit('portfolio-left', { portfolioId });
    });

    // Subscribe to market data for specific symbols
    socket.on('subscribe-market', (symbols: string[]) => {
      symbols.forEach(symbol => {
        socket.join(`market:${symbol}`);
      });
      socket.emit('market-subscribed', { symbols });
    });

    // Unsubscribe from market data
    socket.on('unsubscribe-market', (symbols: string[]) => {
      symbols.forEach(symbol => {
        socket.leave(`market:${symbol}`);
      });
      socket.emit('market-unsubscribed', { symbols });
    });

    // Handle real-time chat/comments
    socket.on('join-post', (postId: string) => {
      socket.join(`post:${postId}`);
    });

    socket.on('leave-post', (postId: string) => {
      socket.leave(`post:${postId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logWebSocket.disconnection(socket.userId, socket.id);
    });
  });

  // Market data simulation (in a real app, this would come from a market data provider)
  const simulateMarketData = () => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
    
    setInterval(() => {
      symbols.forEach(symbol => {
        const price = Math.random() * 1000 + 100;
        const change = (Math.random() - 0.5) * 10;
        const changePercent = (change / price) * 100;
        
        const marketData = {
          symbol,
          price: parseFloat(price.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          timestamp: new Date().toISOString(),
        };
        
        io.to(`market:${symbol}`).emit('market-update', marketData);
      });
    }, 5000); // Update every 5 seconds
  };

  // Start market data simulation
  simulateMarketData();

  return io;
};

// Helper functions to emit events from other parts of the application
export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};

export const emitToPortfolio = (io: SocketIOServer, portfolioId: string, event: string, data: any) => {
  io.to(`portfolio:${portfolioId}`).emit(event, data);
};

export const emitToPost = (io: SocketIOServer, postId: string, event: string, data: any) => {
  io.to(`post:${postId}`).emit(event, data);
};

export const emitMarketUpdate = (io: SocketIOServer, symbol: string, data: any) => {
  io.to(`market:${symbol}`).emit('market-update', data);
};