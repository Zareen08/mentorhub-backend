import { app, server } from './app';
import { env } from './config/env';
import { connectDatabase } from './config/db';
import { connectRedis } from './config/redis';
import { initializeGemini } from './config/gemini';
import { logger } from './utils/logger';

const PORT = env.PORT;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Connect to Redis
    await connectRedis();
    
    // Initialize Gemini AI (Free)
    initializeGemini();
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 API URL: http://localhost:${PORT}/api`);
      logger.info(`❤️  Health check: http://localhost:${PORT}/health`);
      logger.info(`🤖 AI Provider: Google Gemini (Free)`);
      logger.info(`🔌 WebSocket enabled`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, closing server...');
  server.close(async () => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();