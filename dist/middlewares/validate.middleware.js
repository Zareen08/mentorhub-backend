"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateZod = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const zod_1 = require("zod");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    next();
};
exports.validateRequest = validateRequest;
const validateZod = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    errors: error.errors,
                });
                return;
            }
            next(error);
        }
    };
};
exports.validateZod = validateZod;
//# sourceMappingURL=validate.middleware.js.map