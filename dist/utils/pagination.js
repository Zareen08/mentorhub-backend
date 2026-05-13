"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = exports.getPaginationParams = void 0;
const getPaginationParams = (query) => {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    return { page, limit, skip, sortBy, sortOrder };
};
exports.getPaginationParams = getPaginationParams;
const buildPaginationMeta = (page, limit, total) => ({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
});
exports.buildPaginationMeta = buildPaginationMeta;
//# sourceMappingURL=pagination.js.map