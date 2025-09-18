"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitMarketUpdate = exports.emitToPost = exports.emitToPortfolio = exports.emitToUser = exports.initializeWebSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const initializeWebSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                return next(new Error('Authentication token required'));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env['JWT_SECRET']);
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                return next(new Error('User not found'));
            }
            socket.userId = user.id;
            next();
        }
        catch (error) {
            next(new Error('Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`User ${socket.userId} connected`);
        socket.join(`user:${socket.userId}`);
        socket.on('join-portfolio', async (portfolioId) => {
            try {
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
                }
                else {
                    socket.emit('error', { message: 'Access denied to portfolio' });
                }
            }
            catch (error) {
                socket.emit('error', { message: 'Failed to join portfolio' });
            }
        });
        socket.on('leave-portfolio', (portfolioId) => {
            socket.leave(`portfolio:${portfolioId}`);
            socket.emit('portfolio-left', { portfolioId });
        });
        socket.on('subscribe-market', (symbols) => {
            symbols.forEach(symbol => {
                socket.join(`market:${symbol}`);
            });
            socket.emit('market-subscribed', { symbols });
        });
        socket.on('unsubscribe-market', (symbols) => {
            symbols.forEach(symbol => {
                socket.leave(`market:${symbol}`);
            });
            socket.emit('market-unsubscribed', { symbols });
        });
        socket.on('join-post', (postId) => {
            socket.join(`post:${postId}`);
        });
        socket.on('leave-post', (postId) => {
            socket.leave(`post:${postId}`);
        });
        socket.on('disconnect', () => {
            console.log(`User ${socket.userId} disconnected`);
        });
    });
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
        }, 5000);
    };
    simulateMarketData();
    return io;
};
exports.initializeWebSocket = initializeWebSocket;
const emitToUser = (io, userId, event, data) => {
    io.to(`user:${userId}`).emit(event, data);
};
exports.emitToUser = emitToUser;
const emitToPortfolio = (io, portfolioId, event, data) => {
    io.to(`portfolio:${portfolioId}`).emit(event, data);
};
exports.emitToPortfolio = emitToPortfolio;
const emitToPost = (io, postId, event, data) => {
    io.to(`post:${postId}`).emit(event, data);
};
exports.emitToPost = emitToPost;
const emitMarketUpdate = (io, symbol, data) => {
    io.to(`market:${symbol}`).emit('market-update', data);
};
exports.emitMarketUpdate = emitMarketUpdate;
//# sourceMappingURL=websocket.js.map