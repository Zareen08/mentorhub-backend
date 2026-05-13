import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Public stats (limited)
router.get('/platform', analyticsController.getPlatformStats);
router.get('/top-mentors', analyticsController.getTopMentors);
router.get('/booking-trends', analyticsController.getBookingTrends);

// Protected routes
router.use(authenticate);
router.get('/mentor/:mentorId?', authorize('MENTOR', 'ADMIN'), analyticsController.getMentorAnalytics);

export default router;