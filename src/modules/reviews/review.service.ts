import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { cacheService } from '../../services/cache.service';
import { sendNotification } from '../../jobs/notification.job';

export interface ReviewFilters {
  page: number;
  limit: number;
  rating?: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class ReviewService {
  async createReview(userId: string, bookingId: string, rating: number, comment: string) {
    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        mentor: {
          include: { user: true },
        },
      },
    });
    
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }
    
    if (booking.userId !== userId) {
      throw new ApiError(403, 'You can only review your own sessions');
    }
    
    if (booking.status !== 'COMPLETED') {
      throw new ApiError(400, 'Can only review completed sessions');
    }
    
    // Check if already reviewed
    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });
    
    if (existingReview) {
      throw new ApiError(400, 'You have already reviewed this session');
    }
    
    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId,
        userId,
        mentorId: booking.mentorId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    
    // Update mentor's average rating
    await this.updateMentorRating(booking.mentorId);
    
    // Invalidate cache
    await cacheService.delete(`reviews:mentor:${booking.mentorId}`);
    await cacheService.delete(`mentor:${booking.mentorId}`);
    
    // Send notification to mentor
    await sendNotification(
      booking.mentor.user.id,
      'New Review',
      `${review.user.name} left you a ${rating}-star review!`,
      'REVIEW_RECEIVED',
      { reviewId: review.id, rating }
    );
    
    return review;
  }
  
  async getMentorReviews(mentorId: string, filters: ReviewFilters) {
    const { page, limit, rating, sortBy, sortOrder } = filters;
    const skip = (page - 1) * limit;
    
    const where: any = { mentorId };
    if (rating) where.rating = rating;
    
    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: sortOrder };
        break;
      case 'createdAt':
        orderBy = { createdAt: sortOrder };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.review.count({ where }),
    ]);
    
    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
  
  async getUserReviews(userId: string) {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        booking: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return reviews;
  }
  
  async updateMentorRating(mentorId: string) {
    const reviews = await prisma.review.findMany({
      where: { mentorId },
      select: { rating: true },
    });
    
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    
    // Get mentor's user ID
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      select: { userId: true },
    });
    
    if (mentor) {
      await prisma.user.update({
        where: { id: mentor.userId },
        data: {
          rating: averageRating,
          totalReviews,
        },
      });
    }
  }
  
  async getReviewStats(mentorId: string) {
    const cacheKey = `reviews:stats:${mentorId}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const reviews = await prisma.review.findMany({
      where: { mentorId },
      select: { rating: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    
    const totalReviews = await prisma.review.count({ where: { mentorId } });
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    
    const allReviews = await prisma.review.findMany({
      where: { mentorId },
      select: { rating: true },
    });
    
    allReviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });
    
    const stats = {
      averageRating,
      totalReviews,
      ratingDistribution,
      recentReviews: reviews,
    };
    
    await cacheService.set(cacheKey, stats, 300);
    
    return stats;
  }
  
  async getReviewAnalytics(mentorId: string) {
    const reviews = await prisma.review.findMany({
      where: { mentorId },
      select: { rating: true, comment: true, createdAt: true },
    });
    
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    
    const positiveReviews = reviews.filter(r => r.rating >= 4).length;
    const negativeReviews = reviews.filter(r => r.rating <= 2).length;
    const neutralReviews = reviews.filter(r => r.rating === 3).length;
    
    // Extract common keywords
    const allComments = reviews.map(r => r.comment).join(' ');
    const commonKeywords = this.extractKeywords(allComments);
    
    // Group by month
    const sentimentTrend = this.groupReviewsByMonth(reviews);
    
    return {
      totalReviews,
      averageRating,
      positiveReviews,
      negativeReviews,
      neutralReviews,
      commonKeywords,
      sentimentTrend,
    };
  }
  
  async deleteReview(reviewId: string, userId: string, isAdmin: boolean = false) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { mentor: true },
    });
    
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }
    
    if (review.userId !== userId && !isAdmin) {
      throw new ApiError(403, 'You can only delete your own reviews');
    }
    
    await prisma.review.delete({
      where: { id: reviewId },
    });
    
    // Update mentor rating
    await this.updateMentorRating(review.mentorId);
    
    // Invalidate cache
    await cacheService.delete(`reviews:mentor:${review.mentorId}`);
    await cacheService.delete(`reviews:stats:${review.mentorId}`);
    
    return { message: 'Review deleted successfully' };
  }
  
  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);
    const wordCount = new Map<string, number>();
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
        wordCount.set(cleanWord, (wordCount.get(cleanWord) || 0) + 1);
      }
    });
    
    const sorted = Array.from(wordCount.entries()).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 10).map(([word]) => word);
  }
  
  private groupReviewsByMonth(reviews: any[]) {
    const grouped = new Map<string, { totalSentiment: number; count: number }>();
    
    reviews.forEach(review => {
      const date = new Date(review.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const sentiment = review.rating / 5;
      
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, { totalSentiment: 0, count: 0 });
      }
      
      const group = grouped.get(monthKey)!;
      group.totalSentiment += sentiment;
      group.count++;
    });
    
    return Array.from(grouped.entries())
      .map(([date, data]) => ({
        date,
        averageSentiment: data.totalSentiment / data.count,
        reviewCount: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const reviewService = new ReviewService();