import { ref, computed, watch, toValue, type MaybeRefOrGetter } from 'vue';
import { MS_PER_DAY, type IGanttTask } from '../types';
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

    const reflowChildren = (parentId: number, timescale: TimeScale) => {
        const parent = tasks.value.find((t) => t.id === parentId);
        if (!parent) return;

        const children = tasks.value.filter((t) => t.depends_on === parentId);
        if (children.length === 0) return;

        for (const child of children) {
            const parentEnd = new Date(parent.deadline_at);
            parentEnd.setHours(0, 0, 0, 0);

            const oldStart = new Date(child.started_at);
            oldStart.setHours(0, 0, 0, 0);
            const oldEnd = new Date(child.deadline_at);
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
                t.id === child.id ? { ...t, started_at: fmt(start), deadline_at: fmt(end) } : t
            );

            // рекурсивно — вдруг у ребёнка тоже есть дети
            reflowChildren(child.id, timescale);
        }
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

        const isDependent = task.depends_on != null;

        if (isDependent) {
            // x игнорируем — берём от родителя
            const parent = tasks.value.find((t) => t.id === task.depends_on);
            if (!parent) return;

            const parentEnd = new Date(parent.deadline_at);
            const start = new Date(parentEnd);
            start.setDate(start.getDate() + 1); // день после дедлайна родителя
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setDate(end.getDate() + Math.max(layout.days, 1) - 1);

            tasks.value = tasks.value.map((t) =>
                t.id === id ? { ...t, started_at: fmt(start), deadline_at: fmt(end) } : t
            );
            reflowChildren(id, timescale);
            return;
        }

        // независимая — как раньше
        const start = timescale.xToDate(layout.x);
        const end = timescale.xToDate(layout.x + layout.days * timescale.dayWidth.value - 1);

        tasks.value = tasks.value.map((t) =>
            t.id === id ? { ...t, started_at: fmt(start), deadline_at: fmt(end) } : t
        );
        reflowChildren(id, timescale);
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
