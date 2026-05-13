import { Router } from 'express';
import { reviewController } from './review.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/mentor/:mentorId', reviewController.getMentorReviews);

// Protected routes
router.use(authenticate);
router.post('/', reviewController.createReview);
router.get('/my-reviews', reviewController.getUserReviews);

export default router;