"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFiltersSchema = exports.changeUserRoleSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
    bio: zod_1.z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
    expertise: zod_1.z.array(zod_1.z.string()).optional(),
    avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
});
exports.changeUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['USER', 'MENTOR', 'ADMIN']),
});
exports.userFiltersSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().optional(),
    role: zod_1.z.enum(['USER', 'MENTOR', 'ADMIN']).optional(),
    sortBy: zod_1.z.enum(['name', 'email', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=user.interface.js.map