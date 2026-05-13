"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, success, message, data) => {
    res.status(statusCode).json({
        success,
        message,
        ...(data && { data }),
        timestamp: new Date().toISOString(),
    });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map