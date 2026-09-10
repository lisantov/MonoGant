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

export const buildDependencyPath = (
    from: { x: number; y: number; days: number },
    to: { x: number; y: number },
    dayWidth: number,
    dayHeight: number
) => {
    const startX = from.x + from.days * dayWidth;
    const startY = from.y + dayHeight / 2;
    const endX = to.x;
    const endY = to.y + dayHeight / 2;

    const stub = 8;
    const minGap = stub * 2;
    const gap = endX - startX;

    if (gap >= minGap) {
        const midX = startX + gap / 2;
        return `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`;
    }

    const belowY = from.y + dayHeight;
    const approachX = endX - stub * 2;

    return [
        `M ${startX} ${startY}`,
        `H ${startX + stub}`,
        `V ${belowY}`,
        `H ${approachX}`,
        `V ${endY}`,
        `H ${endX}`,
    ].join(' ');
};
