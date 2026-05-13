import { getIO } from '../../sockets/socket';
import { logger } from '../../utils/logger';

export interface NotificationPayload {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: any;
  createdAt: Date;
}

export class NotificationSocket {
  private static instance: NotificationSocket;
  
  static getInstance(): NotificationSocket {
    if (!NotificationSocket.instance) {
      NotificationSocket.instance = new NotificationSocket();
    }
    return NotificationSocket.instance;
  }
  
  sendToUser(userId: string, notification: NotificationPayload) {
    try {
      const io = getIO();
      io.to(`user:${userId}`).emit('notification', notification);
      logger.info(`Notification sent to user ${userId}: ${notification.title}`);
    } catch (error) {
      logger.error('Failed to send notification via socket:', error);
    }
  }
  
  sendToAll(notification: NotificationPayload) {
    try {
      const io = getIO();
      io.emit('notification', notification);
      logger.info(`Broadcast notification: ${notification.title}`);
    } catch (error) {
      logger.error('Failed to broadcast notification:', error);
    }
  }
  
  sendToRole(role: string, notification: NotificationPayload) {
    try {
      const io = getIO();
      io.to(`role:${role}`).emit('notification', notification);
      logger.info(`Notification sent to role ${role}: ${notification.title}`);
    } catch (error) {
      logger.error('Failed to send role notification:', error);
    }
  }
  
  sendBookingUpdate(userId: string, bookingId: string, status: string) {
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
  
  sendMentorMatch(userId: string, mentorId: string, matchScore: number) {
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
  
  sendReminder(userId: string, bookingId: string, minutesBefore: number) {
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
  
  sendReviewRequest(userId: string, bookingId: string, mentorName: string) {
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

export const notificationSocket = NotificationSocket.getInstance();