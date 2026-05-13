"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingReminder = exports.sendNotification = void 0;
const db_1 = require("../config/db");
const socket_1 = require("../sockets/socket");
const logger_1 = require("../utils/logger");
const sendNotification = async (userId, title, message, type, data) => {
    try {
        // Save to database
        const notification = await db_1.prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type: type,
                data: data || {},
            },
        });
        // Send real-time via socket
        try {
            const io = (0, socket_1.getIO)();
            io.to(`user:${userId}`).emit('notification', notification);
        }
        catch (socketError) {
            logger_1.logger.warn('Socket not available, notification saved but not sent real-time');
        }
        logger_1.logger.info(`Notification sent to user ${userId}: ${title}`);
        return notification;
    }
    catch (error) {
        logger_1.logger.error('Failed to send notification:', error);
        return null;
    }
};
exports.sendNotification = sendNotification;
const sendBookingReminder = async (bookingId) => {
    const booking = await db_1.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            user: true,
            mentor: { include: { user: true } },
        },
    });
    if (!booking)
        return;
    const reminderTime = new Date(booking.date);
    reminderTime.setHours(reminderTime.getHours() - 1);
    if (new Date() >= reminderTime) {
        await (0, exports.sendNotification)(booking.userId, 'Session Reminder', `Your session with ${booking.mentor.user.name} starts in 1 hour!`, 'BOOKING_REMINDER', { bookingId });
    }
};
exports.sendBookingReminder = sendBookingReminder;
//# sourceMappingURL=notification.job.js.map