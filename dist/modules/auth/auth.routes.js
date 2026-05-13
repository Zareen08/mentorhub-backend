"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', auth_validation_1.registerValidation, validate_middleware_1.validateRequest, auth_controller_1.authController.register);
router.post('/login', auth_validation_1.loginValidation, validate_middleware_1.validateRequest, auth_controller_1.authController.login);
router.post('/social-login', auth_validation_1.socialLoginValidation, validate_middleware_1.validateRequest, auth_controller_1.authController.socialLogin);
router.post('/refresh', auth_controller_1.authController.refreshToken);
// Protected routes
router.use(auth_middleware_1.authenticate);
router.post('/change-password', auth_validation_1.changePasswordValidation, validate_middleware_1.validateRequest, auth_controller_1.authController.changePassword);
router.get('/me', auth_controller_1.authController.getCurrentUser);
router.post('/logout', auth_controller_1.authController.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map