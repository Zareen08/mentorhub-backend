"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = exports.UploadController = void 0;
const cloudinary_1 = require("../../config/cloudinary");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const db_1 = require("../../config/db");
class UploadController {
    uploadAvatar = (0, catchAsync_1.catchAsync)(async (req, res) => {
        if (!req.file) {
            return (0, sendResponse_1.sendResponse)(res, 400, false, 'No file uploaded', null);
        }
        const result = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, 'avatars');
        // Update user avatar
        await db_1.prisma.user.update({
            where: { id: req.user.id },
            data: { avatar: result.secure_url },
        });
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Avatar uploaded successfully', {
            url: result.secure_url,
        });
    });
    uploadMultiple = (0, catchAsync_1.catchAsync)(async (req, res) => {
        if (!req.files || !Array.isArray(req.files)) {
            return (0, sendResponse_1.sendResponse)(res, 400, false, 'No files uploaded', null);
        }
        const uploadPromises = req.files.map(file => (0, cloudinary_1.uploadToCloudinary)(file.buffer, 'mentorhub'));
        const results = await Promise.all(uploadPromises);
        const urls = results.map(result => result.secure_url);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Files uploaded successfully', { urls });
    });
}
exports.UploadController = UploadController;
exports.uploadController = new UploadController();
//# sourceMappingURL=upload.controller.js.map