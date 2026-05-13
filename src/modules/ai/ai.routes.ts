import { Router } from 'express';
import { aiController } from './ai.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { rateLimitMiddleware } from '../../middlewares/rateLimit.middleware';

const router = Router();

// All AI routes are protected and rate-limited
router.use(authenticate);
router.use(rateLimitMiddleware);

// AI Feature Routes (All FREE with Google Gemini)
router.get('/recommendations', aiController.getRecommendations);
router.post('/chat', aiController.chat);
router.post('/match', aiController.matchMentor);
router.get('/insights', authorize('ADMIN'), aiController.getInsights);
router.get('/summary/:bookingId', aiController.generateSummary);
router.post('/sentiment', aiController.analyzeSentiment);

export default router;