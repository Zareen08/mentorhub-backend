import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createBookingSchema } from './booking.interface';
import { validateZod } from '../../middlewares/validate.middleware';

const router = Router();

router.use(authenticate);
router.post('/', validateZod(createBookingSchema), bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.patch('/:id/cancel', bookingController.cancelBooking);

export default router;