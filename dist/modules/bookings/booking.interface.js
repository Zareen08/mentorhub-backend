"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    mentorId: zod_1.z.string().uuid(),
    date: zod_1.z.string().datetime(),
    duration: zod_1.z.number().min(30).max(240),
    notes: zod_1.z.string().optional(),
});
exports.updateBookingSchema = exports.createBookingSchema.partial();
//# sourceMappingURL=booking.interface.js.map