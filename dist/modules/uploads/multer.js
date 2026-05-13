"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadAvatar = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const ApiError_1 = require("../../utils/ApiError");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new ApiError_1.ApiError(400, 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
exports.uploadAvatar = exports.upload.single('avatar');
exports.uploadMultiple = exports.upload.array('files', 5);
//# sourceMappingURL=multer.js.map