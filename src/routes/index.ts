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

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API version info
router.get('/', (req, res) => {
  res.json({
    name: 'MentorHub API',
    version: '1.0.0',
    description: 'AI-powered mentorship platform API',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
  });
});

// Public routes (no authentication required)
router.use('/auth', authRoutes);
router.use('/mentors', mentorRoutes);
router.use('/analytics', analyticsRoutes);

// Protected routes (authentication required)
router.use('/users', userRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/ai', aiRoutes);
router.use('/uploads', uploadRoutes);
router.use('/notifications', notificationRoutes);

export default router;