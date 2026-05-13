"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class AuthController {
    register = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await auth_service_1.authService.register(req.body);
        (0, sendResponse_1.sendResponse)(res, 201, true, 'Registration successful', result);
    });
    login = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await auth_service_1.authService.login(req.body);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Login successful', result);
    });
    socialLogin = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { provider, token } = req.body;
        const result = await auth_service_1.authService.socialLogin(provider, token);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Social login successful', result);
    });
    refreshToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { refreshToken } = req.body;
        const result = await auth_service_1.authService.refreshToken(refreshToken);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Token refreshed', result);
    });
    changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const result = await auth_service_1.authService.changePassword(req.user.id, currentPassword, newPassword);
        (0, sendResponse_1.sendResponse)(res, 200, true, result.message, null);
    });
    getCurrentUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const user = await auth_service_1.authService.getCurrentUser(req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'User fetched', user);
    });
    logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
        // In production, you might want to blacklist the token
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Logged out successfully', null);
    });
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map