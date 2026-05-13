"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupByDate = exports.calculatePercentageChange = exports.calculateRatingDistribution = exports.calculateAverage = void 0;
const calculateAverage = (numbers) => {
    if (!numbers.length)
        return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};
exports.calculateAverage = calculateAverage;
const calculateRatingDistribution = (ratings) => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((r) => {
        const clamped = Math.min(5, Math.max(1, Math.round(r)));
        dist[clamped]++;
    });
    return dist;
};
exports.calculateRatingDistribution = calculateRatingDistribution;
const calculatePercentageChange = (current, previous) => {
    if (previous === 0)
        return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};
exports.calculatePercentageChange = calculatePercentageChange;
const groupByDate = (items, format = 'day') => {
    return items.reduce((acc, item) => {
        let key;
        const d = new Date(item.createdAt);
        if (format === 'day')
            key = d.toISOString().slice(0, 10);
        else if (format === 'month')
            key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        else
            key = String(d.getFullYear());
        if (!acc[key])
            acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
};
exports.groupByDate = groupByDate;
//# sourceMappingURL=calculateStats.js.map