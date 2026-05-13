"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../config/db");
const generateToken_1 = require("../../utils/generateToken");
const ApiError_1 = require("../../utils/ApiError");
const logger_1 = require("../../utils/logger");
const qstash_service_1 = require("../../jobs/qstash.service");
class AuthService {
    async register(data) {
        const { email, password, name } = data;
        // Check if user exists
        const existingUser = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new ApiError_1.ApiError(400, 'User already exists with this email');
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = await db_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                createdAt: true,
            },
        });
        // Generate tokens
        const accessToken = (0, generateToken_1.generateToken)({ id: user.id, email: user.email, role: user.role });
        const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: user.id, email: user.email, role: user.role });
        // Send welcome email (async)
        await (0, qstash_service_1.queueEmail)(user.email, 'Welcome to MentorHub', `Welcome ${user.name}!`).catch(err => {
            logger_1.logger.error('Failed to send welcome email:', err);
        });
        return { user, accessToken, refreshToken };
    }
    async login(data) {
        const { email, password } = data;
        const user = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new ApiError_1.ApiError(401, 'Invalid email or password');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            throw new ApiError_1.ApiError(401, 'Invalid email or password');
        }
        const accessToken = (0, generateToken_1.generateToken)({ id: user.id, email: user.email, role: user.role });
        const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: user.id, email: user.email, role: user.role });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, accessToken, refreshToken };
    }
    async socialLogin(provider, token) {
        // In production, verify token with provider (Google, Facebook, etc.)
        // This is a simplified version
        const email = `social_${Date.now()}@${provider}.com`;
        const name = `${provider}_user_${Date.now()}`;
        let user = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            user = await db_1.prisma.user.create({
                data: {
                    email,
                    name,
                    password: await bcryptjs_1.default.hash(Math.random().toString(36), 10),
                    isVerified: true,
                },
            });
        }
        const accessToken = (0, generateToken_1.generateToken)({ id: user.id, email: user.email, role: user.role });
        const refreshToken = (0, generateToken_1.generateRefreshToken)({ id: user.id, email: user.email, role: user.role });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        const decoded = (0, generateToken_1.verifyToken)(refreshToken, process.env.JWT_REFRESH_SECRET);
        if (!decoded) {
            throw new ApiError_1.ApiError(401, 'Invalid refresh token');
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            throw new ApiError_1.ApiError(401, 'User not found');
        }
        const newAccessToken = (0, generateToken_1.generateToken)({ id: user.id, email: user.email, role: user.role });
        const newRefreshToken = (0, generateToken_1.generateRefreshToken)({ id: user.id, email: user.email, role: user.role });
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValidPassword) {
            throw new ApiError_1.ApiError(401, 'Current password is incorrect');
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await db_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'Password changed successfully' };
    }
    async getCurrentUser(userId) {
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
                expertise: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        bookings: true,
                        reviews: true,
                    },
                },
            },
        });
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        return user;
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map