"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.loggerMiddleware = void 0;
const logger_1 = require("../utils/logger");
const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
    // Log request
    logger_1.logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
    });
    // Log response on finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.logger.info(`${req.method} ${req.path} - ${res.statusCode}`, {
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
exports.requestLogger = exports.loggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map