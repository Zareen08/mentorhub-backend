import { Router } from 'express';
import { mentorController } from './mentor.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createMentorSchema, updateMentorSchema } from './mentor.interface';
import { validateZod } from '../../middlewares/validate.middleware';

const router = Router();

// Public routes
router.get('/', mentorController.getAllMentors);
router.get('/top', mentorController.getTopMentors);
router.get('/:id', mentorController.getMentorById);

// Protected routes
router.use(authenticate);
router.post('/', validateZod(createMentorSchema), mentorController.createMentor);
router.put('/:id', validateZod(updateMentorSchema), mentorController.updateMentor);
router.get('/:id/stats', authorize('MENTOR', 'ADMIN'), mentorController.getMentorStats);

export default router;