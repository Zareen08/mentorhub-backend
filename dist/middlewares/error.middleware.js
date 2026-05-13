"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const ApiError_1 = require("../utils/ApiError");
const errorMiddleware = (error, req, res, next) => {
    logger_1.logger.error('Error:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
    });
    // Handle custom API errors
    if (error instanceof ApiError_1.ApiError) {
        res.status(error.statusCode).json({
            success: false,
            error: error.message,
            ...(error.errors && { errors: error.errors }),
        });
        return;
    }
    // Handle Prisma errors
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            res.status(409).json({
                success: false,
                error: 'A record with this unique field already exists',
            });
            return;
        }
        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'Record not found',
            });
            return;
        }
        // Default Prisma error
        res.status(400).json({
            success: false,
            error: 'Database error occurred',
        });
        return;
    }
    // Handle Prisma validation errors
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        res.status(400).json({
            success: false,
            error: 'Invalid data provided',
        });
        return;
    }
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            error: 'Invalid authentication token',
        });
        return;
    }
    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            error: 'Token has expired',
        });
        return;
    }
    // Default error
    const statusCode = process.env.NODE_ENV === 'production' ? 500 : 500;
    res.status(statusCode).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map