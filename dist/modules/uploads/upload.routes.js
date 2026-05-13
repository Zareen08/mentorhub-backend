"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("./upload.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const multer_1 = require("./multer");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/avatar', multer_1.uploadAvatar, upload_controller_1.uploadController.uploadAvatar);
router.post('/multiple', multer_1.uploadMultiple, upload_controller_1.uploadController.uploadMultiple);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map