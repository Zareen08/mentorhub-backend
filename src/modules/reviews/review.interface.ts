import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID format'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment cannot exceed 500 characters'),
});

export const updateReviewSchema = createReviewSchema.partial();

export const reviewFiltersSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
  rating: z.number().int().min(1).max(5).optional(),
  sortBy: z.enum(['rating', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewFilters = z.infer<typeof reviewFiltersSchema>;

export interface ReviewResponse {
  id: string;
  bookingId: string;
  userId: string;
  mentorId: string;
  rating: number;
  comment: string;
  sentiment?: {
    score: number;
    emotion: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  mentor?: {
    id: string;
    title: string;
    user: {
      id: string;
      name: string;
      avatar: string | null;
    };
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentReviews: ReviewResponse[];
}

export interface ReviewAnalytics {
  totalReviews: number;
  averageRating: number;
  positiveReviews: number;
  negativeReviews: number;
  neutralReviews: number;
  commonKeywords: string[];
  sentimentTrend: {
    date: string;
    averageSentiment: number;
    reviewCount: number;
  }[];
}