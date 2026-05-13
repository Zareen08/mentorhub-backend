"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("express-async-errors");
const http_1 = require("http");
// Import configs
const env_1 = require("./config/env");
// Import middlewares
const error_middleware_1 = require("./middlewares/error.middleware");
const notFound_middleware_1 = require("./middlewares/notFound.middleware");
const rateLimit_middleware_1 = require("./middlewares/rateLimit.middleware");
const logger_middleware_1 = require("./middlewares/logger.middleware");
// Import routes
const routes_1 = __importDefault(require("./routes"));
// Import socket
const socket_1 = require("./sockets/socket");
const app = (0, express_1.default)();
exports.app = app;
// Trust proxy for rate limiting
app.set('trust proxy', 1);
// Middlewares
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
}));
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.ALLOWED_ORIGINS.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use(logger_middleware_1.loggerMiddleware);
app.use(rateLimit_middleware_1.rateLimitMiddleware);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env_1.env.NODE_ENV,
        aiProvider: 'Google Gemini (Free)',
    });
});
// API routes
app.use('/api', routes_1.default);
// 404 handler
app.use(notFound_middleware_1.notFoundMiddleware);
// Global error handler
app.use(error_middleware_1.errorMiddleware);
// Create HTTP server
const httpServer = (0, http_1.createServer)(app);
// Initialize Socket.IO
(0, socket_1.initializeSocket)(httpServer);
exports.server = httpServer;
//# sourceMappingURL=app.js.map