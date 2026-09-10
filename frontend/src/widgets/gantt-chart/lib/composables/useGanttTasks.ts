import { ref, computed, watch, toValue, type MaybeRefOrGetter } from 'vue';
import type { IGanttTask } from '../types';
import type { TimeScale } from '../injection';

export const useGanttTasks = (source: MaybeRefOrGetter<IGanttTask[] | undefined>) => {
    const tasks = ref<IGanttTask[]>([...(toValue(source) ?? [])]);

    watch(
        () => toValue(source),
        (next) => {
            tasks.value = [...(next ?? [])];
        }
    );

    const sortedTasks = computed(() =>
        [...tasks.value].sort(
            (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
        )
    );

    const applyBarLayout = (
        id: number,
        layout: { x: number; days: number },
        timescale: TimeScale
    ) => {
        tasks.value = tasks.value.map((task) => {
            if (task.id !== id) return task;

            const start = timescale.xToDate(layout.x);
            const end = timescale.xToDate(layout.x + layout.days * timescale.dayWidth.value - 1);

            const fmt = (d: Date) =>
                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            return {
                ...task,
                started_at: fmt(start),
                deadline_at: fmt(end),
            };
        });
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
