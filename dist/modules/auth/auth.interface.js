"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialLoginSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    confirmPassword: zod_1.z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.socialLoginSchema = zod_1.z.object({
    provider: zod_1.z.enum(['google', 'facebook', 'github']),
    token: zod_1.z.string(),
});
//# sourceMappingURL=auth.interface.js.map