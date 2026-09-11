import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue';
import type { IGanttTask, IGanttConfig } from '../types';
import { addDays, daysBetween, startOfDay } from '../utils';

const DEFAULT_CONFIG: IGanttConfig = {
    dayWidth: 120,
    dayHeight: 72,
    minDayWidth: 15,
    maxDayWidth: 100,
};

export const useTimeScale = (
    config?: Partial<IGanttConfig>,
    tasksSource?: MaybeRefOrGetter<IGanttTask[]>
) => {
    const cfg = { ...DEFAULT_CONFIG, ...config };

    const dayWidth = ref(cfg.dayWidth);
    const dayHeight = ref(cfg.dayHeight);
    const fallbackStart = ref(new Date());

    const getBounds = (tasks: IGanttTask[]) => {
        let minStart: Date | null = null;
        let maxEnd: Date | null = null;
        for (const task of tasks) {
            const start = startOfDay(new Date(task.started_at));
            const end = startOfDay(new Date(task.deadline_at));
            if (!minStart || start < minStart) minStart = addDays(start, -30);
            if (!maxEnd || end > maxEnd) maxEnd = addDays(end, 30);
        }
        return { minStart, maxEnd };
    };

    const timelineStart = computed(() => {
        const tasks = tasksSource ? toValue(tasksSource) : [];
        if (tasks.length === 0) return startOfDay(fallbackStart.value);

        const { minStart } = getBounds(tasks);
        return minStart!;
    });

    const dateToX = (date: Date): number => {
        return daysBetween(timelineStart.value, date) * dayWidth.value;
    };

    const xToDate = (x: number): Date => {
        const days = x / dayWidth.value;
        return addDays(timelineStart.value, days);
    };

    const dateToDayIndex = (date: Date): number => {
        return daysBetween(timelineStart.value, date);
    };

    const dayIndexToDate = (index: number): Date => {
        return addDays(timelineStart.value, index);
    };

    return {
        dayHeight,
        dayWidth,
        dateToX,
        xToDate,
        dateToDayIndex,
        dayIndexToDate,
        timelineStart,
        getBounds,
    };
};
