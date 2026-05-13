import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Protected routes
router.use(authenticate);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/my-bookings', userController.getUserBookings);

// Admin only routes
router.use(authorize('ADMIN'));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id/role', userController.updateUserRole);
router.delete('/:id', userController.deleteUser);

export default router;