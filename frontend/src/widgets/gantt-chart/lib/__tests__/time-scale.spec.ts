import { ref } from 'vue';
import { describe, expect, it } from 'vitest';

import type { IGanttTask } from '../types';
import { GANTT_TASK_STATUS } from '../types';
import { useTimeScale } from '../composables/useTimeScale';
import { startOfDay } from '../utils';

// даты в формате 'YYYY-MM-DD' парсятся как UTC — для детерминизма фиксируем TZ
process.env.TZ = 'UTC';

const task = (overrides: Partial<IGanttTask> = {}): IGanttTask => ({
    id: 1,
    name: 'Задача',
    description: '',
    started_at: '2026-09-10',
    deadline_at: '2026-09-20',
    status: GANTT_TASK_STATUS.PLANNED,
    next_task_id: null,
    ...overrides,
});

describe('useTimeScale', () => {
    it('getBounds: отступает по 30 дней от границ задач', () => {
        const ts = useTimeScale({}, []);
        const tasks = [
            task({ id: 1, started_at: '2026-09-10', deadline_at: '2026-09-20' }),
            task({ id: 2, started_at: '2026-09-12', deadline_at: '2026-09-25' }),
        ];

        const { minStart, maxEnd } = ts.getBounds(tasks);
        expect(minStart).toEqual(new Date(2026, 7, 11)); // 2026-09-10 − 30 дней
        expect(maxEnd).toEqual(new Date(2026, 9, 25)); // 2026-09-25 + 30 дней
    });

    it('getBounds: учитывает задачи с интервалом больше 30 дней', () => {
        const ts = useTimeScale({}, []);
        const tasks = [
            task({ id: 1, started_at: '2026-09-10', deadline_at: '2026-09-20' }),
            task({ id: 2, started_at: '2026-11-01', deadline_at: '2026-11-10' }),
        ];

        const { minStart, maxEnd } = ts.getBounds(tasks);
        expect(minStart).toEqual(new Date(2026, 7, 11));
        expect(maxEnd).toEqual(new Date(2026, 11, 10)); // 2026-11-10 + 30 дней
    });

    it('timelineStart берёт самую раннюю границу за вычетом 30 дней', () => {
        const tasks = ref([
            task({ id: 1, started_at: '2026-09-10', deadline_at: '2026-09-20' }),
            task({ id: 2, started_at: '2026-09-12', deadline_at: '2026-09-25' }),
        ]);

        const ts = useTimeScale({}, tasks);
        expect(ts.timelineStart.value).toEqual(new Date(2026, 7, 11));
    });

    it('без задач timelineStart совпадает с сегодняшним днём', () => {
        const ts = useTimeScale({}, ref([]));
        expect(ts.timelineStart.value).toEqual(startOfDay(new Date()));
    });

    it('дата в начале таймлайна даёт x = 0', () => {
        const ts = useTimeScale({ dayWidth: 50, dayHeight: 40 }, ref([task()]));
        expect(ts.dateToX(new Date(2026, 7, 11))).toBe(0);
    });

    it('dateToX масштабирует день в dayWidth пикселей', () => {
        const ts = useTimeScale({ dayWidth: 50, dayHeight: 40 }, ref([task()]));
        expect(ts.dateToX(new Date(2026, 7, 12))).toBe(50);
        expect(ts.dateToX(new Date(2026, 8, 11))).toBe(31 * 50);
    });

    it('xToDate обратен dateToX по целым дням', () => {
        const ts = useTimeScale({ dayWidth: 50, dayHeight: 40 }, ref([task()]));

        const date = new Date(2026, 8, 11);
        const x = ts.dateToX(date);
        expect(ts.xToDate(x)).toEqual(date);
        expect(ts.xToDate(50)).toEqual(new Date(2026, 7, 12));
    });

    it('dateToDayIndex и dayIndexToDate дают согласованные индексы', () => {
        const ts = useTimeScale({ dayWidth: 50, dayHeight: 40 }, ref([task()]));

        expect(ts.dateToDayIndex(new Date(2026, 7, 11))).toBe(0);
        expect(ts.dateToDayIndex(new Date(2026, 8, 11))).toBe(31);
        expect(ts.dayIndexToDate(2)).toEqual(new Date(2026, 7, 13));
    });
});
