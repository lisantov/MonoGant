import { ref, computed, watch, toValue, type MaybeRefOrGetter } from 'vue';
import { MS_PER_DAY, type IGanttTask } from '../types';
import type { TimeScale } from '../injection';
import { sortByChains } from '../utils';

export const useGanttTasks = (source: MaybeRefOrGetter<IGanttTask[] | undefined>) => {
    const tasks = ref<IGanttTask[]>([...(toValue(source) ?? [])]);

    watch(
        () => toValue(source),
        (next) => {
            tasks.value = [...(next ?? [])];
        }
    );

    const sortedTasks = computed(() => sortByChains(tasks.value));

    const reflowNext = (parentId: number, visited = new Set<number>()) => {
        if (visited.has(parentId)) return;
        visited.add(parentId);
        const parent = tasks.value.find((t) => t.id === parentId);
        if (!parent || parent.next_task_id == null) return;

        const next = tasks.value.find((t) => t.id === parent.next_task_id);
        if (!next) return;

        const parentEnd = new Date(parent.deadline_at);
        parentEnd.setHours(0, 0, 0, 0);

        const oldStart = new Date(next.started_at);
        const oldEnd = new Date(next.deadline_at);
        oldStart.setHours(0, 0, 0, 0);
        oldEnd.setHours(0, 0, 0, 0);

        const days = Math.max(
            Math.round((oldEnd.getTime() - oldStart.getTime()) / MS_PER_DAY) + 1,
            1
        );

        const start = new Date(parentEnd);
        start.setDate(start.getDate() + 1);
        const end = new Date(start);
        end.setDate(end.getDate() + days - 1);

        tasks.value = tasks.value.map((t) =>
            t.id === next.id ? { ...t, started_at: fmt(start), deadline_at: fmt(end) } : t
        );

        // рекурсивно — вдруг у следующего тоже есть next_task_id
        reflowNext(next.id, visited);
    };

    const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const applyBarLayout = (
        id: number,
        layout: { x: number; days: number },
        timescale: TimeScale
    ) => {
        const task = tasks.value.find((t) => t.id === id);
        if (!task) return;

        // «родитель» — тот, кто указывает на эту задачу
        const predecessor = tasks.value.find((t) => t.next_task_id === id);

        if (predecessor) {
            // x игнорируем — берём от родителя
            const parentEnd = new Date(predecessor.deadline_at);
            parentEnd.setHours(0, 0, 0, 0);

            const start = new Date(parentEnd);
            start.setDate(start.getDate() + 1);
            const end = new Date(start);
            end.setDate(end.getDate() + Math.max(layout.days, 1) - 1);

            tasks.value = tasks.value.map((t) =>
                t.id === id ? { ...t, started_at: fmt(start), deadline_at: fmt(end) } : t
            );

            // пересчитываем того, кто идёт после этой задачи
            reflowNext(id);
            return;
        }

        // независимая — как раньше
        const start = timescale.xToDate(layout.x);
        const end = timescale.xToDate(layout.x + layout.days * timescale.dayWidth.value - 1);

        tasks.value = tasks.value.map((t) =>
            t.id === id ? { ...t, started_at: fmt(start), deadline_at: fmt(end) } : t
        );

        reflowNext(id); // ← было reflowNext(task.next_task_id)
    };

    const addTask = (task: IGanttTask) => {
        tasks.value.push(task);
    };

    const removeTask = (taskId: number) => {
        tasks.value = tasks.value.filter((task) => task.id !== taskId);
    };

    const updateTask = (taskId: number, patch: Partial<IGanttTask>) => {
        tasks.value = tasks.value.map((task) => {
            if (task.id !== taskId) return task;

            const updated: IGanttTask = { ...task, ...patch };
            if (patch.started_at) updated.started_at = patch.started_at;
            if (patch.deadline_at) updated.deadline_at = patch.deadline_at;
            return updated;
        });
    };

    const getTaskById = (taskId: number): IGanttTask | undefined => {
        return tasks.value.find((task) => task.id === taskId);
    };

    return {
        tasks,
        sortedTasks,
        applyBarLayout,
        addTask,
        removeTask,
        updateTask,
        getTaskById,
    };
};
