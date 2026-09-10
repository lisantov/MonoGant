import { MS_PER_DAY, type IGanttTask } from './types';

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

export function sortByChains(tasks: IGanttTask[]): IGanttTask[] {
    const byId = new Map(tasks.map((t) => [t.id, t]));

    // id всех, на кого кто-то указывает = «зависимые» (есть входящее ребро)
    const hasIncoming = new Set<number>();
    for (const t of tasks) {
        if (t.next_task_id != null) hasIncoming.add(t.next_task_id);
    }

    // начала цепочек — те, на кого никто не указывает
    const starts = tasks.filter((t) => !hasIncoming.has(t.id));

    const visited = new Set<number>();
    const chains: IGanttTask[][] = [];
    const standalone: IGanttTask[] = [];

    for (const start of starts) {
        const chain: IGanttTask[] = [];
        let cur: IGanttTask | undefined = start;

        while (cur && !visited.has(cur.id)) {
            visited.add(cur.id);
            chain.push(cur);
            cur = cur.next_task_id != null ? byId.get(cur.next_task_id) : undefined;
        }

        if (chain.length > 1) chains.push(chain);
        else if (chain[0]) standalone.push(chain[0]);
    }

    // страховка от циклов (если пользователь как-то создал A → B → A)
    const orphans: IGanttTask[] = [];
    for (const t of tasks) {
        if (!visited.has(t.id)) orphans.push(t);
    }

    return [...chains.flat(), ...standalone, ...orphans];
}
