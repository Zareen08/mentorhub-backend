"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMentorSchema = exports.createMentorSchema = void 0;
const zod_1 = require("zod");
exports.createMentorSchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    company: zod_1.z.string().optional(),
    experience: zod_1.z.number().min(0).max(50),
    hourlyRate: zod_1.z.number().positive(),
    skills: zod_1.z.array(zod_1.z.string()),
    availability: zod_1.z.array(zod_1.z.string()),
    bio: zod_1.z.string().optional(),
});
exports.updateMentorSchema = exports.createMentorSchema.partial();
//# sourceMappingURL=mentor.interface.js.map