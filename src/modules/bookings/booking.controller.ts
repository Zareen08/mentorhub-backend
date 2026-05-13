import { Response } from 'express';
import { bookingService } from './booking.service';
import { AuthRequest } from '../../types/auth.types';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class BookingController {
  createBooking = catchAsync(async (req: AuthRequest, res: Response) => {
    const booking = await bookingService.createBooking(req.user!.id, req.body);
    sendResponse(res, 201, true, 'Booking created successfully', booking);
  });
  
  getMyBookings = catchAsync(async (req: AuthRequest, res: Response) => {
    const { status } = req.query;
    const bookings = await bookingService.getUserBookings(req.user!.id, status as string);
    sendResponse(res, 200, true, 'Bookings fetched successfully', bookings);
  });
  
  cancelBooking = catchAsync(async (req: AuthRequest, res: Response) => {
    const booking = await bookingService.updateBookingStatus(req.params.id, 'CANCELLED', req.user!.id);
    sendResponse(res, 200, true, 'Booking cancelled successfully', booking);
  });
}

export const bookingController = new BookingController();