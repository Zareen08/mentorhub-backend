"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const generateToken_1 = require("../utils/generateToken");
const db_1 = require("../config/db");
const logger_1 = require("../utils/logger");
let io;
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
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
            const decoded = (0, generateToken_1.verifyToken)(token, process.env.JWT_SECRET);
            if (!decoded) {
                return next(new Error('Invalid token'));
            }
            const user = await db_1.prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                return next(new Error('User not found'));
            }
            socket.user = user;
            next();
        }
        catch (error) {
            next(new Error('Authentication failed'));
        }
    });
    io.on('connection', (socket) => {
        const user = socket.user;
        logger_1.logger.info(`User connected: ${user.id}`);
        // Join user's personal room
        socket.join(`user:${user.id}`);
        // Handle sending messages
        socket.on('send_message', async (data) => {
            const { receiverId, content } = data;
            // Save message to database
            const message = await db_1.prisma.message.create({
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
            logger_1.logger.info(`User disconnected: ${user.id}`);
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map