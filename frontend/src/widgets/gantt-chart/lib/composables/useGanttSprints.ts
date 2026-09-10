import { ref, computed, watch, toValue, type MaybeRefOrGetter } from 'vue';
import { MS_PER_DAY, type IGanttSprint, type IGanttTask } from '../types';
import type { TimeScale } from '../injection';
import { sortByChains } from '../utils';

const dayStart = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};

const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);

export const useGanttSprints = (source: MaybeRefOrGetter<IGanttSprint[] | undefined>) => {
    const sprints = ref<IGanttSprint[]>([...(toValue(source) ?? [])]);

    watch(
        () => toValue(source),
        (next) => {
            sprints.value = [...(next ?? [])];
        }
    );

    /** Все задачи со ссылкой на спринт */
    const allTasks = computed(() =>
        sprints.value.flatMap((s) =>
            sortByChains(s.tasks).map((t) => ({ sprintId: s.id, task: t }))
        )
    );

    /** Границы спринта, вычисленные из задач */
    const sprintBounds = (sprint: IGanttSprint) => {
        let min: Date | null = null;
        let max: Date | null = null;
        for (const t of sprint.tasks) {
            const s = dayStart(new Date(t.started_at));
            const e = dayStart(new Date(t.deadline_at));
            if (!min || s < min) min = s;
            if (!max || e > max) max = e;
        }
        return { start: min, end: max };
    };

    /** Пересчёт started_at/deadline_at спринта из его задач */
    const refreshSprintDates = (sprintId: number) => {
        const sprint = sprints.value.find((s) => s.id === sprintId);
        if (!sprint) return;
        // ничего не делаем — границы вычисляются на лету в sprintBounds
        // (нужно только если где-то кешируются)
    };

    /** Двигаем весь спринт: все его задачи сдвигаются на deltaDays */
    const moveSprint = (sprintId: number, deltaDays: number) => {
        sprints.value = sprints.value.map((s) => {
            if (s.id !== sprintId) return s;
            return {
                ...s,
                tasks: s.tasks.map((t) => {
                    const start = new Date(t.started_at);
                    const end = new Date(t.deadline_at);
                    start.setDate(start.getDate() + deltaDays);
                    end.setDate(end.getDate() + deltaDays);
                    return { ...t, started_at: fmt(start), deadline_at: fmt(end) };
                }),
            };
        });
    };

    /** Правый ресайз спринта: сдвигаем дедлайн самой длинной задачи */
    const resizeSprintRight = (sprintId: number, newTotalDays: number) => {
        sprints.value = sprints.value.map((s) => {
            if (s.id !== sprintId) return s;
            const b = sprintBounds(s);
            if (!b.start || !b.end) return s;
            const currentDays = daysBetween(b.start, b.end) + 1;
            const delta = newTotalDays - currentDays;
            if (delta === 0) return s;

            // растягиваем/сжимаем каждую задачу пропорционально? Или двигаем только последнюю?
            // Проще: тянем самую позднюю задачу на delta дней
            const maxEnd = b.end;
            return {
                ...s,
                tasks: s.tasks.map((t) => {
                    const e = dayStart(new Date(t.deadline_at));
                    if (e.getTime() !== maxEnd.getTime()) return t;
                    const newEnd = new Date(e);
                    newEnd.setDate(newEnd.getDate() + delta);
                    const start = dayStart(new Date(t.started_at));
                    if (newEnd < start) return t; // защита
                    return { ...t, deadline_at: fmt(newEnd) };
                }),
            };
        });
    };

    /** Точечное обновление задачи (замена useGanttTasks.applyBarLayout) */
    const applyTaskLayout = (
        sprintId: number,
        taskId: number,
        layout: { x: number; days: number },
        timescale: TimeScale
    ) => {
        sprints.value = sprints.value.map((s) => {
            if (s.id !== sprintId) return s;

            const sorted = sortByChains(s.tasks);
            const task = sorted.find((t) => t.id === taskId);
            if (!task) return s;

            // есть ли предшественник в цепочке?
            const predecessor = sorted.find((t) => t.next_task_id === taskId);

            const parentEnd = predecessor ? dayStart(new Date(predecessor.deadline_at)) : null;

            const start = parentEnd
                ? new Date(parentEnd.getTime() + MS_PER_DAY)
                : timescale.xToDate(layout.x);
            const end = new Date(start);
            end.setDate(end.getDate() + Math.max(layout.days, 1) - 1);

            // обновляем саму задачу
            const updated = s.tasks.map((t) =>
                t.id === taskId ? { ...t, started_at: fmt(start), deadline_at: fmt(end) } : t
            );

            // каскадно пересчитываем тех, кто идёт после
            const withReflow = reflowChain(updated, taskId);

            return { ...s, tasks: withReflow };
        });
    };

    return {
        sprints,
        allTasks,
        sprintBounds,
        moveSprint,
        refreshSprintDates,
        resizeSprintRight,
        applyTaskLayout,
    };
};

/** Пересчёт started_at всех задач, идущих после parentId по цепочке */
function reflowChain(
    tasks: IGanttTask[],
    parentId: number,
    visited = new Set<number>()
): IGanttTask[] {
    if (visited.has(parentId)) return tasks;
    visited.add(parentId);

    const parent = tasks.find((t) => t.id === parentId);
    if (!parent || parent.next_task_id == null) return tasks;

    const next = tasks.find((t) => t.id === parent.next_task_id);
    if (!next) return tasks;

    const parentEnd = dayStart(new Date(parent.deadline_at));
    const oldStart = dayStart(new Date(next.started_at));
    const oldEnd = dayStart(new Date(next.deadline_at));
    const days = Math.max(daysBetween(oldStart, oldEnd) + 1, 1);

    const start = new Date(parentEnd.getTime() + MS_PER_DAY);
    const end = new Date(start);
    end.setDate(end.getDate() + days - 1);

    const updated = tasks.map((t) =>
        t.id === next.id ? { ...t, started_at: fmt(start), deadline_at: fmt(end) } : t
    );

    return reflowChain(updated, next.id, visited);
}
