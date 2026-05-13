import { prisma } from '../../config/db';
import { cacheService } from '../../services/cache.service';

export class AnalyticsService {
  async getPlatformStats() {
    const cacheKey = 'platform_stats';
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const [
      totalUsers,
      totalMentors,
      totalBookings,
      completedBookings,
      totalRevenue,
      averageRating,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.mentor.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      prisma.review.aggregate({
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
    
    await cacheService.set(cacheKey, stats, 300); // Cache for 5 minutes
    
    return stats;
  }
  
  async getMentorAnalytics(mentorId: string) {
    const [bookings, reviews, earnings] = await Promise.all([
      prisma.booking.count({
        where: { mentorId, status: 'COMPLETED' },
      }),
      prisma.review.count({
        where: { mentorId },
      }),
      prisma.booking.aggregate({
        where: { mentorId, status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
    ]);
    
    const monthlyTrend = await prisma.$queryRaw`
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
  
  async getBookingTrends(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const trends = await prisma.$queryRaw`
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
  
  async getTopMentors(limit: number = 10) {
    const topMentors = await prisma.mentor.findMany({
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

export const analyticsService = new AnalyticsService();