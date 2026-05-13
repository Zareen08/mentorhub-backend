import { Response } from 'express';
import { AuthRequest } from '../../types/auth.types';
import { uploadToCloudinary } from '../../config/cloudinary';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { prisma } from '../../config/db';

export class UploadController {
  uploadAvatar = catchAsync(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      return sendResponse(res, 400, false, 'No file uploaded', null);
    }
    
    const result = await uploadToCloudinary(req.file.buffer, 'avatars');
    
    // Update user avatar
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatar: (result as any).secure_url },
    });
    
    sendResponse(res, 200, true, 'Avatar uploaded successfully', {
      url: (result as any).secure_url,
    });
  });
  
  uploadMultiple = catchAsync(async (req: AuthRequest, res: Response) => {
    if (!req.files || !Array.isArray(req.files)) {
      return sendResponse(res, 400, false, 'No files uploaded', null);
    }
    
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, 'mentorhub')
    );
    
    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => (result as any).secure_url);
    
    sendResponse(res, 200, true, 'Files uploaded successfully', { urls });
  });
}

export const uploadController = new UploadController();