export const calculateAverage = (numbers: number[]): number => {
  if (!numbers.length) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

export const calculateRatingDistribution = (
  ratings: number[]
): Record<1 | 2 | 3 | 4 | 5, number> => {
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratings.forEach((r) => {
    const clamped = Math.min(5, Math.max(1, Math.round(r))) as 1 | 2 | 3 | 4 | 5;
    dist[clamped]++;
  });
  return dist as Record<1 | 2 | 3 | 4 | 5, number>;
};

export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const groupByDate = <T extends { createdAt: Date }>(
  items: T[],
  format: 'day' | 'month' | 'year' = 'day'
): Record<string, T[]> => {
  return items.reduce((acc, item) => {
    let key: string;
    const d = new Date(item.createdAt);
    if (format === 'day') key = d.toISOString().slice(0, 10);
    else if (format === 'month') key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    else key = String(d.getFullYear());
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};
