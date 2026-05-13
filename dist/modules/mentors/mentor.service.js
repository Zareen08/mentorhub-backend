"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorService = exports.MentorService = void 0;
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
const cache_service_1 = require("../../services/cache.service");
class MentorService {
    async getAllMentors(filters) {
        const { page = 1, limit = 10, skill, minRate, maxRate, search, sortBy = 'rating', } = filters;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
        };
        if (skill) {
            where.skills = { has: skill };
        }
        if (minRate || maxRate) {
            where.hourlyRate = {};
            if (minRate)
                where.hourlyRate.gte = minRate;
            if (maxRate)
                where.hourlyRate.lte = maxRate;
        }
        if (search) {
            where.user = {
                name: { contains: search, mode: 'insensitive' },
            };
        }
        let orderBy = {};
        switch (sortBy) {
            case 'rating':
                orderBy = { user: { rating: 'desc' } };
                break;
            case 'price_asc':
                orderBy = { hourlyRate: 'asc' };
                break;
            case 'price_desc':
                orderBy = { hourlyRate: 'desc' };
                break;
            case 'experience':
                orderBy = { experience: 'desc' };
                break;
            default:
                orderBy = { user: { rating: 'desc' } };
        }
        const [mentors, total] = await Promise.all([
            db_1.prisma.mentor.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true,
                            rating: true,
                            totalReviews: true,
                            bio: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy,
            }),
            db_1.prisma.mentor.count({ where }),
        ]);
        return {
            mentors,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getMentorById(id) {
        const cacheKey = `mentor:${id}`;
        const cached = await cache_service_1.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const mentor = await db_1.prisma.mentor.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        rating: true,
                        totalReviews: true,
                        bio: true,
                        expertise: true,
                    },
                },
                bookings: {
                    where: {
                        status: 'COMPLETED',
                    },
                    take: 5,
                    orderBy: { date: 'desc' },
                    include: {
                        user: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                        review: true,
                    },
                },
            },
        });
        if (!mentor) {
            throw new ApiError_1.ApiError(404, 'Mentor not found');
        }
        // Calculate average rating from reviews
        const reviews = await db_1.prisma.review.findMany({
            where: { mentorId: id },
            select: { rating: true },
        });
        const averageRating = reviews.length
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        const result = {
            ...mentor,
            averageRating,
            totalReviews: reviews.length,
        };
        await cache_service_1.cacheService.set(cacheKey, result, 300); // Cache for 5 minutes
        return result;
    }
    async createMentor(userId, data) {
        const existing = await db_1.prisma.mentor.findUnique({
            where: { userId },
        });
        if (existing) {
            throw new ApiError_1.ApiError(400, 'User already has a mentor profile');
        }
        // Convert string array to Availability enum array
        const availabilityArray = data.availability;
        const mentor = await db_1.prisma.mentor.create({
            data: {
                userId,
                title: data.title,
                company: data.company,
                experience: data.experience,
                hourlyRate: data.hourlyRate,
                skills: data.skills,
                availability: availabilityArray,
                isActive: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });
        await db_1.prisma.user.update({
            where: { id: userId },
            data: { role: 'MENTOR' },
        });
        return mentor;
    }
    async updateMentor(mentorId, data) {
        const updateData = { ...data };
        // Convert availability if present
        if (data.availability) {
            updateData.availability = data.availability;
        }
        const mentor = await db_1.prisma.mentor.update({
            where: { id: mentorId },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });
        await cache_service_1.cacheService.delete(`mentor:${mentorId}`);
        return mentor;
    }
    async getTopMentors(limit = 10) {
        const cacheKey = 'top_mentors';
        const cached = await cache_service_1.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const mentors = await db_1.prisma.mentor.findMany({
            where: { isActive: true },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        rating: true,
                        totalReviews: true,
                    },
                },
            },
            orderBy: {
                user: {
                    rating: 'desc',
                },
            },
            take: limit,
        });
        await cache_service_1.cacheService.set(cacheKey, mentors, 600); // Cache for 10 minutes
        return mentors;
    }
    async getMentorStats(mentorId) {
        const stats = await db_1.prisma.$transaction([
            db_1.prisma.booking.count({
                where: { mentorId, status: 'COMPLETED' },
            }),
            db_1.prisma.booking.aggregate({
                where: { mentorId, status: 'COMPLETED' },
                _sum: { totalAmount: true },
            }),
            db_1.prisma.review.count({
                where: { mentorId },
            }),
            db_1.prisma.review.aggregate({
                where: { mentorId },
                _avg: { rating: true },
            }),
        ]);
        return {
            totalSessions: stats[0],
            totalEarnings: stats[1]._sum.totalAmount || 0,
            totalReviews: stats[2],
            averageRating: stats[3]._avg.rating || 0,
        };
    }
}
exports.MentorService = MentorService;
exports.mentorService = new MentorService();
//# sourceMappingURL=mentor.service.js.map