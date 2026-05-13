import { Router } from 'express';
import { uploadController } from './upload.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { uploadAvatar, uploadMultiple } from './multer';

const router = Router();

router.use(authenticate);
router.post('/avatar', uploadAvatar, uploadController.uploadAvatar);
router.post('/multiple', uploadMultiple, uploadController.uploadMultiple);

export default router;