import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/generateToken';
import { prisma } from '../config/db';
import { logger } from '../utils/logger';

let io: SocketServer;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });
  
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      
      const decoded = verifyToken(token, process.env.JWT_SECRET!);
      if (!decoded) {
        return next(new Error('Invalid token'));
      }
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      (socket as any).user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });
  
  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    logger.info(`User connected: ${user.id}`);
    
    // Join user's personal room
    socket.join(`user:${user.id}`);
    
    // Handle sending messages
    socket.on('send_message', async (data) => {
      const { receiverId, content } = data;
      
      // Save message to database
      const message = await prisma.message.create({
        data: {
          conversationId: data.conversationId,
          senderId: user.id,
          content,
        },
      });
      
      // Emit to receiver
      io.to(`user:${receiverId}`).emit('new_message', message);
    });
    
    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(`user:${data.receiverId}`).emit('user_typing', {
        userId: user.id,
        name: user.name,
      });
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${user.id}`);
    });
  });
  
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};