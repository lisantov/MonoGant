import { MS_PER_DAY } from './types';

export const startOfDay = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const addDays = (date: Date, days: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

export const daysBetween = (start: Date, end: Date): number => {
    const s = startOfDay(start);
    const e = startOfDay(end);
    return Math.round((e.getTime() - s.getTime()) / MS_PER_DAY);
};
