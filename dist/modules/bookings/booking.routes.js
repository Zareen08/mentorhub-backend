"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const booking_interface_1 = require("./booking.interface");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/', (0, validate_middleware_1.validateZod)(booking_interface_1.createBookingSchema), booking_controller_1.bookingController.createBooking);
router.get('/my-bookings', booking_controller_1.bookingController.getMyBookings);
router.patch('/:id/cancel', booking_controller_1.bookingController.cancelBooking);
exports.default = router;
//# sourceMappingURL=booking.routes.js.map