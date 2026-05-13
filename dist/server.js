"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const redis_1 = require("./config/redis");
const gemini_1 = require("./config/gemini");
const logger_1 = require("./utils/logger");
const PORT = env_1.env.PORT;
const startServer = async () => {
    try {
        // Connect to database
        await (0, db_1.connectDatabase)();
        // Connect to Redis
        await (0, redis_1.connectRedis)();
        // Initialize Gemini AI (Free)
        (0, gemini_1.initializeGemini)();
        // Start server
        app_1.server.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server is running on port ${PORT}`);
            logger_1.logger.info(`📍 Environment: ${env_1.env.NODE_ENV}`);
            logger_1.logger.info(`🔗 API URL: http://localhost:${PORT}/api`);
            logger_1.logger.info(`❤️  Health check: http://localhost:${PORT}/health`);
            logger_1.logger.info(`🤖 AI Provider: Google Gemini (Free)`);
            logger_1.logger.info(`🔌 WebSocket enabled`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Graceful shutdown
const gracefulShutdown = async () => {
    logger_1.logger.info('Received shutdown signal, closing server...');
    app_1.server.close(async () => {
        logger_1.logger.info('Server closed');
        process.exit(0);
    });
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
startServer();
//# sourceMappingURL=server.js.map