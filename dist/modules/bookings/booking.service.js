"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = exports.BookingService = void 0;
const db_1 = require("../../config/db");
const ApiError_1 = require("../../utils/ApiError");
const cache_service_1 = require("../../services/cache.service");
class BookingService {
    async createBooking(userId, data) {
        const { mentorId, date, duration, notes } = data;
        // Check if mentor exists
        const mentor = await db_1.prisma.mentor.findUnique({
            where: { id: mentorId },
            include: { user: true },
        });
        if (!mentor) {
            throw new ApiError_1.ApiError(404, 'Mentor not found');
        }
        // Calculate total amount
        const totalAmount = (mentor.hourlyRate * duration) / 60;
        // Check for conflicting bookings
        const conflictingBooking = await db_1.prisma.booking.findFirst({
            where: {
                mentorId,
                date: new Date(date),
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
        });
        if (conflictingBooking) {
            throw new ApiError_1.ApiError(409, 'This time slot is already booked');
        }
        // Create booking
        const booking = await db_1.prisma.booking.create({
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
        await cache_service_1.cacheService.delete(`bookings:user:${userId}`);
        return booking;
    }
    async getUserBookings(userId, status) {
        const where = { userId };
        if (status)
            where.status = status;
        const bookings = await db_1.prisma.booking.findMany({
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
    async updateBookingStatus(bookingId, status, userId) {
        const booking = await db_1.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new ApiError_1.ApiError(404, 'Booking not found');
        }
        if (booking.userId !== userId) {
            throw new ApiError_1.ApiError(403, 'Unauthorized');
        }
        const updated = await db_1.prisma.booking.update({
            where: { id: bookingId },
            data: { status: status },
        });
        return updated;
    }
}
exports.BookingService = BookingService;
exports.bookingService = new BookingService();
//# sourceMappingURL=booking.service.js.map