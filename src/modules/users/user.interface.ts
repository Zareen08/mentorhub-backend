import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  expertise: z.array(z.string()).optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export const changeUserRoleSchema = z.object({
  role: z.enum(['USER', 'MENTOR', 'ADMIN']),
});

export const userFiltersSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  role: z.enum(['USER', 'MENTOR', 'ADMIN']).optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangeUserRoleInput = z.infer<typeof changeUserRoleSchema>;
export type UserFilters = z.infer<typeof userFiltersSchema>;

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  expertise: string[];
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalBookings: number;
  totalMentorSessions?: number;
  totalReviews: number;
  averageRating: number;
  totalEarnings?: number;
}