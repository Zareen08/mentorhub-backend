"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const db_1 = require("../../config/db");
const redis_1 = require("../../config/redis");
class NotificationService {
    async createNotification(userId, title, message, type, data) {
        const notification = await db_1.prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type: type,
                data: data || {},
            },
        });
        // Send real-time notification via WebSocket
        const io = (0, redis_1.getRedisClient)();
        // Emit to user's room
        // io.to(`user:${userId}`).emit('notification', notification);
        return notification;
    }
    async getUserNotifications(userId, isRead) {
        const where = { userId };
        if (isRead !== undefined)
            where.isRead = isRead;
        const notifications = await db_1.prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return notifications;
    }
    async markAsRead(notificationId, userId) {
        const notification = await db_1.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
        return notification;
    }
    async markAllAsRead(userId) {
        await db_1.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        return { message: 'All notifications marked as read' };
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
//# sourceMappingURL=notification.service.js.map