"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class UserController {
    getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await user_service_1.userService.getAllUsers(req.query);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Users fetched successfully', result);
    });
    getUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const user = await user_service_1.userService.getUserById(req.params.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'User fetched successfully', user);
    });
    getProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const user = await user_service_1.userService.getUserById(req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Profile fetched successfully', user);
    });
    updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const user = await user_service_1.userService.updateProfile(req.user.id, req.body);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Profile updated successfully', user);
    });
    updateUserRole = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;
        const user = await user_service_1.userService.updateUserRole(id, role, req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'User role updated successfully', user);
    });
    deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { id } = req.params;
        await user_service_1.userService.deleteUser(id, req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'User deleted successfully', null);
    });
    getUserBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const bookings = await user_service_1.userService.getUserBookings(req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Your bookings fetched successfully', bookings);
    });
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map