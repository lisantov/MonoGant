export const startOfDay = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const daysBetween = (start: Date, end: Date): number => {
    const s = startOfDay(start);
    const e = startOfDay(end);
    return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
};
