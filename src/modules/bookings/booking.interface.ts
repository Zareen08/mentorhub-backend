import { z } from 'zod';

export const createBookingSchema = z.object({
  mentorId: z.string().uuid(),
  date: z.string().datetime(),
  duration: z.number().min(30).max(240),
  notes: z.string().optional(),
});

export const updateBookingSchema = createBookingSchema.partial();

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

export interface BookingResponse {
  id: string;
  mentor: {
    id: string;
    name: string;
    title: string;
    hourlyRate: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  date: Date;
  duration: number;
  status: string;
  totalAmount: number;
  meetingLink?: string;
}