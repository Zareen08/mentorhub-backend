import { prisma } from '../config/db';
import { getIO } from '../sockets/socket';
import { logger } from '../utils/logger';

export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  data?: any
) => {
  try {
    // Save to database
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type: type as any,
        data: data || {},
      },
    });
    
    // Send real-time via socket
    try {
      const io = getIO();
      io.to(`user:${userId}`).emit('notification', notification);
    } catch (socketError) {
      logger.warn('Socket not available, notification saved but not sent real-time');
    }
    
    logger.info(`Notification sent to user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    logger.error('Failed to send notification:', error);
    return null;
  }
};

export const sendBookingReminder = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      mentor: { include: { user: true } },
    },
  });
  
  if (!booking) return;
  
  const reminderTime = new Date(booking.date);
  reminderTime.setHours(reminderTime.getHours() - 1);
  
  if (new Date() >= reminderTime) {
    await sendNotification(
      booking.userId,
      'Session Reminder',
      `Your session with ${booking.mentor.user.name} starts in 1 hour!`,
      'BOOKING_REMINDER',
      { bookingId }
    );
  }
};