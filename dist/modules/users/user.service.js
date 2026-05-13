"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
const cache_service_1 = require("../../services/cache.service");
class UserService {
    async getAllUsers(filters) {
        const { page = 1, limit = 10, search, role } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role)
            where.role = role;
        const [users, total] = await Promise.all([
            db_1.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    avatar: true,
                    isVerified: true,
                    createdAt: true,
                    _count: {
                        select: {
                            bookings: true,
                            reviews: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            db_1.prisma.user.count({ where }),
        ]);
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getUserById(id) {
        const cacheKey = `user:${id}`;
        const cached = await cache_service_1.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
                expertise: true,
                rating: true,
                totalReviews: true,
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
        await cache_service_1.cacheService.set(cacheKey, user, 600);
        return user;
    }
    async updateProfile(userId, data) {
        const { name, bio, expertise, avatar } = data;
        const user = await db_1.prisma.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                expertise,
                avatar,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                bio: true,
                expertise: true,
            },
        });
        // Invalidate cache
        await cache_service_1.cacheService.delete(`user:${userId}`);
        return user;
    }
    async updateUserRole(userId, role, adminId) {
        const admin = await db_1.prisma.user.findUnique({
            where: { id: adminId },
        });
        if (!admin || admin.role !== 'ADMIN') {
            throw new ApiError_1.ApiError(403, 'Only admins can update user roles');
        }
        const user = await db_1.prisma.user.update({
            where: { id: userId },
            data: { role: role },
        });
        await cache_service_1.cacheService.delete(`user:${userId}`);
        return user;
    }
    async deleteUser(userId, adminId) {
        const admin = await db_1.prisma.user.findUnique({
            where: { id: adminId },
        });
        if (!admin || admin.role !== 'ADMIN') {
            throw new ApiError_1.ApiError(403, 'Only admins can delete users');
        }
        await db_1.prisma.user.delete({
            where: { id: userId },
        });
        await cache_service_1.cacheService.delete(`user:${userId}`);
        return { message: 'User deleted successfully' };
    }
    async getUserBookings(userId) {
        const bookings = await db_1.prisma.booking.findMany({
            where: { userId },
            include: {
                mentor: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
        return bookings;
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map