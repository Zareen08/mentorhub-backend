"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = exports.initializeCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
const initializeCloudinary = () => {
    if (!env_1.env.CLOUDINARY_CLOUD_NAME || !env_1.env.CLOUDINARY_API_KEY || !env_1.env.CLOUDINARY_API_SECRET) {
        logger_1.logger.warn('Cloudinary credentials not provided, file upload will be disabled');
        return null;
    }
    cloudinary_1.v2.config({
        cloud_name: env_1.env.CLOUDINARY_CLOUD_NAME,
        api_key: env_1.env.CLOUDINARY_API_KEY,
        api_secret: env_1.env.CLOUDINARY_API_SECRET,
    });
    logger_1.logger.info('✅ Cloudinary initialized');
    return cloudinary_1.v2;
};
exports.initializeCloudinary = initializeCloudinary;
const uploadToCloudinary = async (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: 'auto',
        }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        }).end(file);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    return cloudinary_1.v2.uploader.destroy(publicId);
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=cloudinary.js.map