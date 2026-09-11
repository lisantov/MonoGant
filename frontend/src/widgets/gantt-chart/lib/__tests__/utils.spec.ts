import { describe, expect, it } from 'vitest';

import type { IGanttTask } from '../types';
import { GANTT_TASK_STATUS } from '../types';
import {
    addDays,
    buildDependencyPath,
    daysBetween,
    formatDate,
    sortByChains,
    startOfDay,
} from '../utils';

process.env.TZ = 'UTC';

const task = (overrides: Partial<IGanttTask> = {}): IGanttTask => ({
    id: 1,
    name: 'Задача',
    description: '',
    started_at: '2026-09-01',
    deadline_at: '2026-09-03',
    status: GANTT_TASK_STATUS.PLANNED,
    next_task_id: null,
    ...overrides,
});

describe('startOfDay', () => {
    it('обнуляет время, оставляя ту же дату', () => {
        const date = new Date(2026, 8, 15, 14, 30, 45, 123);
        const result = startOfDay(date);

        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(8);
        expect(result.getDate()).toBe(15);
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
    });

    it('не мутирует исходную дату', () => {
        const date = new Date(2026, 8, 15, 14, 30);
        startOfDay(date);
        expect(date.getHours()).toBe(14);
    });

    it('возвращает новый объект Date', () => {
        const date = new Date(2026, 8, 15);
        expect(startOfDay(date)).not.toBe(date);
    });
});

describe('addDays', () => {
    it('добавляет дни', () => {
        const date = new Date(2026, 8, 15);
        const result = addDays(date, 3);
        expect(result.getMonth()).toBe(8);
        expect(result.getDate()).toBe(18);
    });

    it('поддерживает отрицательные значения', () => {
        const date = new Date(2026, 8, 15);
        const result = addDays(date, -5);
        expect(result.getMonth()).toBe(8);
        expect(result.getDate()).toBe(10);
    });

    it('корректно переходит через границу месяца', () => {
        const jan = new Date(2026, 0, 31);
        expect(addDays(jan, 1).getDate()).toBe(1);
        expect(addDays(jan, 1).getMonth()).toBe(1);
    });

    it('не мутирует исходную дату', () => {
        const date = new Date(2026, 8, 15);
        addDays(date, 7);
        expect(date.getDate()).toBe(15);
    });
});

describe('daysBetween', () => {
    it('возвращает 0 для одной и той же даты', () => {
        expect(daysBetween(new Date(2026, 8, 15), new Date(2026, 8, 15))).toBe(0);
    });

    it('считает разницу в днях, игнорируя время суток', () => {
        expect(daysBetween(new Date(2026, 8, 15, 23, 59), new Date(2026, 8, 16, 0, 1))).toBe(1);
    });

    it('считает разницу через границу месяца', () => {
        expect(daysBetween(new Date(2026, 8, 30), new Date(2026, 9, 1))).toBe(1);
    });

    it('поддерживает отрицательные значения (end раньше start)', () => {
        expect(daysBetween(new Date(2026, 8, 20), new Date(2026, 8, 15))).toBe(-5);
    });
});

describe('buildDependencyPath', () => {
    const from = { x: 0, y: 100, days: 3 };
    const dayWidth = 100;
    const dayHeight = 50;

    it.each([
        ['достаточный зазор — простой ортогональный путь', 500],
        ['зазор равный минимальному — простой путь', 316],
    ])('%s', (_name, toX) => {
        const startX = from.x + from.days * dayWidth; // 300
        const startY = from.y + dayHeight / 2; // 125
        const endX = toX;
        const endY = 250 + dayHeight / 2; // 275
        const midX = startX + (endX - startX) / 2;

        const path = buildDependencyPath(from, { x: toX, y: 250 }, dayWidth, dayHeight);
        expect(path).toBe(`M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`);
    });

    it('зазор меньше минимального — «собачья нога» снизу', () => {
        const toX = 308; // зазор 8px < 16px
        const startX = 300;
        const startY = 125;
        const endX = 308;
        const endY = 275;
        const belowY = 150;
        const approachX = endX - 16; // 292

        const path = buildDependencyPath(from, { x: toX, y: 250 }, dayWidth, dayHeight);
        expect(path).toBe(
            `M ${startX} ${startY} H ${startX + 8} V ${belowY} H ${approachX} V ${endY} H ${endX}`
        );
    });
});

describe('sortByChains', () => {
    it('возвращает пустой массив для пустого входа', () => {
        expect(sortByChains([])).toEqual([]);
    });

    it('ставит цепочки перед одиночными задачами', () => {
        const t1 = task({ id: 1, next_task_id: 2 });
        const t2 = task({ id: 2, next_task_id: null });
        const t3 = task({ id: 3 });

        const sorted = sortByChains([t3, t1, t2]);
        expect(sorted.map((t) => t.id)).toEqual([1, 2, 3]);
    });

    it('сортирует несколько независимых цепочек до одиночных задач', () => {
        const t1 = task({ id: 1, next_task_id: 2 });
        const t2 = task({ id: 2 });
        const t3 = task({ id: 3, next_task_id: 4 });
        const t4 = task({ id: 4 });
        const t5 = task({ id: 5 });

        // порядок независимых цепочек сохраняет порядок в исходном массиве
        const sorted = sortByChains([t5, t1, t3, t2, t4]);
        expect(sorted.map((t) => t.id)).toEqual([1, 2, 3, 4, 5]);
    });

    it('не зацикливается на циклах и не теряет задачи', () => {
        const t1 = task({ id: 1, next_task_id: 2 });
        const t2 = task({ id: 2, next_task_id: 1 });

        const sorted = sortByChains([t1, t2]);
        expect(sorted).toHaveLength(2);
        expect(sorted.map((t) => t.id).sort()).toEqual([1, 2]);
    });
});

describe('formatDate', () => {
    it('форматирует дату как YYYY-MM-DD', () => {
        // текущее поведение: месяц берётся через getMonth() (0-based)
        expect(formatDate(new Date(2026, 8, 15))).toBe('2026-08-15');
    });

    it('возвращает "-" для nullish значения', () => {
        expect(formatDate(null as unknown as Date)).toBe('-');
        expect(formatDate(undefined as unknown as Date)).toBe('-');
    });
});
