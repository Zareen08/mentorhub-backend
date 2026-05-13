import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  registerValidation,
  loginValidation,
  socialLoginValidation,
  changePasswordValidation,
} from './auth.validation';

const router = Router();

// Public routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/social-login', socialLoginValidation, validateRequest, authController.socialLogin);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.use(authenticate);
router.post('/change-password', changePasswordValidation, validateRequest, authController.changePassword);
router.get('/me', authController.getCurrentUser);
router.post('/logout', authController.logout);

export default router;