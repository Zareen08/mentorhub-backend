"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class NotificationController {
    getNotifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { isRead } = req.query;
        const notifications = await notification_service_1.notificationService.getUserNotifications(req.user.id, isRead === 'true' ? true : isRead === 'false' ? false : undefined);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Notifications fetched', notifications);
    });
    markAsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const notification = await notification_service_1.notificationService.markAsRead(req.params.id, req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Notification marked as read', notification);
    });
    markAllAsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await notification_service_1.notificationService.markAllAsRead(req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, result.message, null);
    });
}
exports.NotificationController = NotificationController;
exports.notificationController = new NotificationController();
//# sourceMappingURL=notification.controller.js.map