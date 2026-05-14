import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import mentorRoutes from '../modules/mentors/mentor.routes';
import bookingRoutes from '../modules/bookings/booking.routes';
import reviewRoutes from '../modules/reviews/review.routes';
import aiRoutes from '../modules/ai/ai.routes';
import uploadRoutes from '../modules/uploads/upload.routes';
import notificationRoutes from '../modules/notifications/notification.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';

const router = Router();

// Root API endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MentorHub API v1',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      mentors: '/api/mentors',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      ai: '/api/ai',
      uploads: '/api/uploads',
      notifications: '/api/notifications',
      analytics: '/api/analytics'
    }
  });
});

// Mount all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/mentors', mentorRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/ai', aiRoutes);
router.use('/uploads', uploadRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);

export default router;