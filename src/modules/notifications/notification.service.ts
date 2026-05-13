import { prisma } from '../../config/db';
import { getRedisClient } from '../../config/redis';
import { queueNotification } from '../../jobs/qstash.service';

export class NotificationService {
  async createNotification(userId: string, title: string, message: string, type: string, data?: any) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type as any,
        data: data || {},
      },
    });
    
    // Send real-time notification via WebSocket
    const io = getRedisClient();
    // Emit to user's room
    // io.to(`user:${userId}`).emit('notification', notification);
    
    return notification;
  }
  
  async getUserNotifications(userId: string, isRead?: boolean) {
    const where: any = { userId };
    if (isRead !== undefined) where.isRead = isRead;
    
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    
    return notifications;
  }
  
  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    
    return notification;
  }
  
  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    
    return { message: 'All notifications marked as read' };
  }
}

export const notificationService = new NotificationService();