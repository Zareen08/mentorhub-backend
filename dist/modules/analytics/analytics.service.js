"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = exports.AnalyticsService = void 0;
const db_1 = require("../../config/db");
const cache_service_1 = require("../../services/cache.service");
class AnalyticsService {
    async getPlatformStats() {
        const cacheKey = 'platform_stats';
        const cached = await cache_service_1.cacheService.get(cacheKey);
        if (cached) {
            return cached;
        }
        const [totalUsers, totalMentors, totalBookings, completedBookings, totalRevenue, averageRating,] = await Promise.all([
            db_1.prisma.user.count(),
            db_1.prisma.mentor.count(),
            db_1.prisma.booking.count(),
            db_1.prisma.booking.count({ where: { status: 'COMPLETED' } }),
            db_1.prisma.booking.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalAmount: true },
            }),
            db_1.prisma.review.aggregate({
                _avg: { rating: true },
            }),
        ]);
        const stats = {
            totalUsers,
            totalMentors,
            totalBookings,
            completedBookings,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            averageRating: averageRating._avg.rating || 0,
            conversionRate: (completedBookings / totalBookings) * 100 || 0,
        };
        await cache_service_1.cacheService.set(cacheKey, stats, 300); // Cache for 5 minutes
        return stats;
    }
    async getMentorAnalytics(mentorId) {
        const [bookings, reviews, earnings] = await Promise.all([
            db_1.prisma.booking.count({
                where: { mentorId, status: 'COMPLETED' },
            }),
            db_1.prisma.review.count({
                where: { mentorId },
            }),
            db_1.prisma.booking.aggregate({
                where: { mentorId, status: 'COMPLETED' },
                _sum: { totalAmount: true },
            }),
        ]);
        const monthlyTrend = await db_1.prisma.$queryRaw `
      SELECT 
        DATE_TRUNC('month', date) as month,
        COUNT(*) as bookings,
        SUM("totalAmount") as revenue
      FROM "Booking"
      WHERE "mentorId" = ${mentorId}
        AND status = 'COMPLETED'
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY month DESC
      LIMIT 6
    `;
        return {
            totalSessions: bookings,
            totalReviews: reviews,
            totalEarnings: earnings._sum.totalAmount || 0,
            monthlyTrend,
        };
    }
    async getBookingTrends(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const trends = await db_1.prisma.$queryRaw `
      SELECT 
        DATE(date) as date,
        COUNT(*) as bookings,
        SUM("totalAmount") as revenue
      FROM "Booking"
      WHERE date >= ${startDate}
        AND status = 'COMPLETED'
      GROUP BY DATE(date)
      ORDER BY date ASC
    `;
        return trends;
    }
    async getTopMentors(limit = 10) {
        const topMentors = await db_1.prisma.mentor.findMany({
            where: { isActive: true },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        avatar: true,
                        rating: true,
                    },
                },
                _count: {
                    select: {
                        bookings: {
                            where: { status: 'COMPLETED' },
                        },
                    },
                },
            },
            orderBy: {
                bookings: {
                    _count: 'desc',
                },
            },
            take: limit,
        });
        return topMentors.map(mentor => ({
            id: mentor.id,
            name: mentor.user.name,
            email: mentor.user.email,
            avatar: mentor.user.avatar,
            rating: mentor.user.rating,
            totalSessions: mentor._count.bookings,
            hourlyRate: mentor.hourlyRate,
        }));
    }
}
exports.AnalyticsService = AnalyticsService;
exports.analyticsService = new AnalyticsService();
//# sourceMappingURL=analytics.service.js.map