"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSIONS = exports.ROLE_HIERARCHY = exports.ROLES = void 0;
exports.ROLES = {
    USER: 'USER',
    MENTOR: 'MENTOR',
    ADMIN: 'ADMIN',
};
exports.ROLE_HIERARCHY = {
    [exports.ROLES.USER]: 1,
    [exports.ROLES.MENTOR]: 2,
    [exports.ROLES.ADMIN]: 3,
};
exports.PERMISSIONS = {
    [exports.ROLES.USER]: ['read:profile', 'update:profile', 'create:booking', 'read:mentors'],
    [exports.ROLES.MENTOR]: ['read:profile', 'update:profile', 'create:booking', 'read:mentors', 'manage:bookings', 'manage:availability'],
    [exports.ROLES.ADMIN]: ['*'],
};
//# sourceMappingURL=roles.js.map