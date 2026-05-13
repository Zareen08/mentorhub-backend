"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const notFoundMiddleware = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Cannot ${req.method} ${req.path}`,
        message: 'Route not found',
        timestamp: new Date().toISOString(),
    });
};
exports.notFoundMiddleware = notFoundMiddleware;
//# sourceMappingURL=notFound.middleware.js.map