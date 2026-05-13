import { Response } from 'express';
import { notificationService } from './notification.service';
import { AuthRequest } from '../../types/auth.types';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class NotificationController {
  getNotifications = catchAsync(async (req: AuthRequest, res: Response) => {
    const { isRead } = req.query;
    const notifications = await notificationService.getUserNotifications(
      req.user!.id,
      isRead === 'true' ? true : isRead === 'false' ? false : undefined
    );
    sendResponse(res, 200, true, 'Notifications fetched', notifications);
  });
  
  markAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
    const notification = await notificationService.markAsRead(req.params.id, req.user!.id);
    sendResponse(res, 200, true, 'Notification marked as read', notification);
  });
  
  markAllAsRead = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await notificationService.markAllAsRead(req.user!.id);
    sendResponse(res, 200, true, result.message, null);
  });
}

export const notificationController = new NotificationController();