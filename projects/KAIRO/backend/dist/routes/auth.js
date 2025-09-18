"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const registerValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('username').isLength({ min: 3, max: 30 }).isAlphanumeric(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    (0, express_validator_1.body)('firstName').optional().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('lastName').optional().isLength({ min: 1, max: 50 }),
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
];
const generateTokens = (userId) => {
    const jwtSecret = process.env['JWT_SECRET'] || 'fallback-secret';
    const jwtRefreshSecret = process.env['JWT_REFRESH_SECRET'] || 'fallback-refresh-secret';
    const accessToken = jsonwebtoken_1.default.sign({ id: userId }, jwtSecret);
    const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, jwtRefreshSecret);
    return { accessToken, refreshToken };
};
router.post('/register', registerValidation, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    const { email, username, password, firstName, lastName, accountType } = req.body;
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username },
            ],
        },
    });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: existingUser.email === email ? 'Email already registered' : 'Username already taken',
        });
    }
    const saltRounds = 12;
    const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
    const user = await prisma.user.create({
        data: {
            email,
            username,
            passwordHash,
            firstName,
            lastName,
            accountType: accountType || 'INDIVIDUAL',
        },
        select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            accountType: true,
            isVerified: true,
            createdAt: true,
        },
    });
    const { accessToken, refreshToken } = generateTokens(user.id);
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user,
            accessToken,
            refreshToken,
        },
    });
}));
router.post('/login', loginValidation, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }
    await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
    });
    const { accessToken, refreshToken } = generateTokens(user.id);
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                accountType: user.accountType,
                isVerified: user.isVerified,
                avatar: user.avatar,
            },
            accessToken,
            refreshToken,
        },
    });
}));
router.post('/refresh', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token required',
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env['JWT_REFRESH_SECRET']);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }
        const tokens = generateTokens(user.id);
        res.json({
            success: true,
            data: tokens,
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token',
        });
    }
}));
router.get('/me', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            accountType: true,
            isVerified: true,
            isPublic: true,
            riskTolerance: true,
            totalBalance: true,
            availableBalance: true,
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
    res.json({
        success: true,
        data: { user },
    });
}));
router.put('/profile', auth_1.authenticateToken, [
    (0, express_validator_1.body)('firstName').optional().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('lastName').optional().isLength({ min: 1, max: 50 }),
    (0, express_validator_1.body)('bio').optional().isLength({ max: 500 }),
    (0, express_validator_1.body)('isPublic').optional().isBoolean(),
    (0, express_validator_1.body)('riskTolerance').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']),
], (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    const { firstName, lastName, bio, isPublic, riskTolerance } = req.body;
    const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
            ...(bio !== undefined && { bio }),
            ...(isPublic !== undefined && { isPublic }),
            ...(riskTolerance !== undefined && { riskTolerance }),
        },
        select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            accountType: true,
            isVerified: true,
            isPublic: true,
            riskTolerance: true,
            updatedAt: true,
        },
    });
    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser },
    });
}));
router.post('/logout', auth_1.authenticateToken, (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully',
    });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map