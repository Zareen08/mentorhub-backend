import { z } from 'zod';

export const createMentorSchema = z.object({
  title: z.string().min(2),
  company: z.string().optional(),
  experience: z.number().min(0).max(50),
  hourlyRate: z.number().positive(),
  skills: z.array(z.string()),
  availability: z.array(z.string()),
  bio: z.string().optional(),
});

export const updateMentorSchema = createMentorSchema.partial();

export type CreateMentorInput = z.infer<typeof createMentorSchema>;
export type UpdateMentorInput = z.infer<typeof updateMentorSchema>;

export interface MentorResponse {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    rating: number;
    totalReviews: number;
  };
  title: string;
  company: string | null;
  experience: number;
  hourlyRate: number;
  skills: string[];
  availability: string[];
  isActive: boolean;
  totalSessions: number;
}