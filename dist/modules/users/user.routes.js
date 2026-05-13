"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protected routes
router.use(auth_middleware_1.authenticate);
router.get('/profile', user_controller_1.userController.getProfile);
router.put('/profile', user_controller_1.userController.updateProfile);
router.get('/my-bookings', user_controller_1.userController.getUserBookings);
// Admin only routes
router.use((0, auth_middleware_1.authorize)('ADMIN'));
router.get('/', user_controller_1.userController.getAllUsers);
router.get('/:id', user_controller_1.userController.getUserById);
router.patch('/:id/role', user_controller_1.userController.updateUserRole);
router.delete('/:id', user_controller_1.userController.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map