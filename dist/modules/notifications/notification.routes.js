"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', notification_controller_1.notificationController.getNotifications);
router.patch('/:id/read', notification_controller_1.notificationController.markAsRead);
router.patch('/read-all', notification_controller_1.notificationController.markAllAsRead);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map