"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = exports.BookingController = void 0;
const booking_service_1 = require("./booking.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class BookingController {
    createBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const booking = await booking_service_1.bookingService.createBooking(req.user.id, req.body);
        (0, sendResponse_1.sendResponse)(res, 201, true, 'Booking created successfully', booking);
    });
    getMyBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { status } = req.query;
        const bookings = await booking_service_1.bookingService.getUserBookings(req.user.id, status);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Bookings fetched successfully', bookings);
    });
    cancelBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const booking = await booking_service_1.bookingService.updateBookingStatus(req.params.id, 'CANCELLED', req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Booking cancelled successfully', booking);
    });
}
exports.BookingController = BookingController;
exports.bookingController = new BookingController();
//# sourceMappingURL=booking.controller.js.map