import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { cacheService } from '../../services/cache.service';
import { CreateBookingInput } from './booking.interface';

export class BookingService {
  async createBooking(userId: string, data: CreateBookingInput) {
    const { mentorId, date, duration, notes } = data;
    
    // Check if mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: { user: true },
    });
    
    if (!mentor) {
      throw new ApiError(404, 'Mentor not found');
    }
    
    // Calculate total amount
    const totalAmount = (mentor.hourlyRate * duration) / 60;
    
    // Check for conflicting bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        mentorId,
        date: new Date(date),
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    
    if (conflictingBooking) {
      throw new ApiError(409, 'This time slot is already booked');
    }
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        mentorId,
        date: new Date(date),
        duration,
        totalAmount,
        notes,
        status: 'PENDING',
      },
      include: {
        mentor: {
          include: { user: true },
        },
        user: true,
      },
    });
    
    // Invalidate cache
    await cacheService.delete(`bookings:user:${userId}`);
    
    return booking;
  }
  
  async getUserBookings(userId: string, status?: string) {
    const where: any = { userId };
    if (status) where.status = status;
    
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        mentor: {
          include: { user: true },
        },
      },
      orderBy: { date: 'desc' },
    });
    
    return bookings;
  }
  
  async updateBookingStatus(bookingId: string, status: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }
    
    if (booking.userId !== userId) {
      throw new ApiError(403, 'Unauthorized');
    }
    
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as any },
    });
    
    return updated;
  }
}

export const bookingService = new BookingService();