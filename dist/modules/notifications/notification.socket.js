"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSocket = exports.NotificationSocket = void 0;
const socket_1 = require("../../sockets/socket");
const logger_1 = require("../../utils/logger");
class NotificationSocket {
    static instance;
    static getInstance() {
        if (!NotificationSocket.instance) {
            NotificationSocket.instance = new NotificationSocket();
        }
        return NotificationSocket.instance;
    }
    sendToUser(userId, notification) {
        try {
            const io = (0, socket_1.getIO)();
            io.to(`user:${userId}`).emit('notification', notification);
            logger_1.logger.info(`Notification sent to user ${userId}: ${notification.title}`);
        }
        catch (error) {
            logger_1.logger.error('Failed to send notification via socket:', error);
        }
    }
    sendToAll(notification) {
        try {
            const io = (0, socket_1.getIO)();
            io.emit('notification', notification);
            logger_1.logger.info(`Broadcast notification: ${notification.title}`);
        }
        catch (error) {
            logger_1.logger.error('Failed to broadcast notification:', error);
        }
    }
    sendToRole(role, notification) {
        try {
            const io = (0, socket_1.getIO)();
            io.to(`role:${role}`).emit('notification', notification);
            logger_1.logger.info(`Notification sent to role ${role}: ${notification.title}`);
        }
        catch (error) {
            logger_1.logger.error('Failed to send role notification:', error);
        }
    }
    sendBookingUpdate(userId, bookingId, status) {
        this.sendToUser(userId, {
            id: Date.now().toString(),
            userId,
            title: 'Booking Update',
            message: `Your booking ${bookingId} status changed to ${status}`,
            type: 'BOOKING_UPDATE',
            data: { bookingId, status },
            createdAt: new Date(),
        });
    }
    sendMentorMatch(userId, mentorId, matchScore) {
        this.sendToUser(userId, {
            id: Date.now().toString(),
            userId,
            title: 'New Mentor Match!',
            message: `We found a mentor that matches your preferences with ${Math.round(matchScore * 100)}% compatibility!`,
            type: 'MENTOR_MATCH',
            data: { mentorId, matchScore },
            createdAt: new Date(),
        });
    }
    sendReminder(userId, bookingId, minutesBefore) {
        this.sendToUser(userId, {
            id: Date.now().toString(),
            userId,
            title: 'Session Reminder',
            message: `Your mentorship session starts in ${minutesBefore} minutes!`,
            type: 'REMINDER',
            data: { bookingId, minutesBefore },
            createdAt: new Date(),
        });
    }
    sendReviewRequest(userId, bookingId, mentorName) {
        this.sendToUser(userId, {
            id: Date.now().toString(),
            userId,
            title: 'Share Your Experience',
            message: `How was your session with ${mentorName}? Leave a review!`,
            type: 'REVIEW_REQUEST',
            data: { bookingId, mentorName },
            createdAt: new Date(),
        });
    }
}
exports.NotificationSocket = NotificationSocket;
exports.notificationSocket = NotificationSocket.getInstance();
//# sourceMappingURL=notification.socket.js.map