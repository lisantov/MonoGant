import { ref, computed, watch, toValue, type MaybeRefOrGetter } from 'vue';
import { GANTT_TASK_STATUS, MS_PER_DAY, type IGanttSprint, type IGanttTask } from '../types';
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

    /** Создать пустой спринт */
    const addSprint = (name: string, id?: number) => {
        const newId = id ?? Math.max(0, ...sprints.value.map((s) => s.id)) + 1;
        sprints.value = [
            ...sprints.value,
            {
                id: newId,
                name: name.trim() || `Спринт ${newId}`,
                description: '',
                status: GANTT_TASK_STATUS.PLANNED,
                tasks: [],
            },
        ];
        return newId;
    };

    /** Добавить задачу в спринт */
    const addTask = (sprintId: number, task: Partial<IGanttTask> = {}) => {
        sprints.value = sprints.value.map((s) => {
            if (s.id !== sprintId) return s;

            // ── вычисляем «сегодня» и «завтра» как fallback ──
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const fmtDate = (d: Date) =>
                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            // ── если спринт пуст — начинаем со дня после последнего спринта ──
            let defaultStart = today;
            if (s.tasks.length === 0) {
                // ищем самый поздний deadline_at среди задач ДРУГИХ спринтов
                let latest: Date | null = null;
                for (const other of sprints.value) {
                    if (other.id === sprintId) continue;
                    for (const t of other.tasks) {
                        const d = new Date(t.deadline_at);
                        d.setHours(0, 0, 0, 0);
                        if (!latest || d > latest) latest = d;
                    }
                }
                if (latest) {
                    defaultStart = new Date(latest);
                    defaultStart.setDate(defaultStart.getDate() + 1);
                }
            }

            const defaultEnd = new Date(defaultStart);
            defaultEnd.setDate(defaultEnd.getDate() + 1); // 2-дневная задача по умолчанию

            const localId = Math.max(0, ...s.tasks.map((t) => t.id)) + 1;
            const globalId =
                Math.max(0, ...sprints.value.flatMap((x) => x.tasks.map((t) => t.id))) + 1;

            const newTask: IGanttTask = {
                id: globalId,
                name: task.name ?? `Задача ${localId}`,
                description: task.description ?? '',
                started_at: task.started_at ?? fmtDate(defaultStart),
                deadline_at: task.deadline_at ?? fmtDate(defaultEnd),
                status: task.status ?? GANTT_TASK_STATUS.PLANNED,
                next_task_id: task.next_task_id ?? null,
            };

            return { ...s, tasks: [...s.tasks, newTask] };
        });
    };

    const linkTasks = (fromId: number, toId: number): { ok: boolean; error?: string } => {
        if (fromId === toId) return { ok: false, error: 'Нельзя связать задачу саму с собой' };

        // карта id → sprintId
        const sprintOf = new Map<number, number>();
        const byId = new Map<number, IGanttTask>();
        for (const s of sprints.value) {
            for (const t of s.tasks) {
                sprintOf.set(t.id, s.id);
                byId.set(t.id, t);
            }
        }

        const from = byId.get(fromId);
        const to = byId.get(toId);
        if (!from || !to) return { ok: false, error: 'Задача не найдена' };

        // связи только внутри спринта — иначе reflow не сработает
        if (sprintOf.get(fromId) !== sprintOf.get(toId)) {
            return { ok: false, error: 'Задачи должны быть в одном спринте' };
        }

        // защита от цикла: идём по next_task_id от `to`; если дойдём до `from` — цикл
        let cur: IGanttTask | undefined = to;
        const seen = new Set<number>();
        while (cur && cur.next_task_id != null) {
            if (seen.has(cur.id)) break;
            seen.add(cur.id);
            if (cur.next_task_id === fromId) return { ok: false, error: 'Образуется цикл' };
            cur = byId.get(cur.next_task_id);
        }

        const sprintId = sprintOf.get(fromId)!;

        sprints.value = sprints.value.map((s) => {
            if (s.id !== sprintId) return s;

            let updated = s.tasks.map((t) => {
                // 1) source: ставим новый next_task_id
                if (t.id === fromId) return { ...t, next_task_id: toId };

                // 2) у `to` может уже быть предшественник — рвём его связь
                if (t.next_task_id === toId && t.id !== fromId) {
                    return { ...t, next_task_id: null };
                }

                // 3) если source раньше указывал на кого-то — это ок, мы уже перезаписали
                return t;
            });

            // 4) каскадно пересчитываем цепочку после source
            updated = reflowChain(updated, fromId);

            return { ...s, tasks: updated };
        });

        return { ok: true };
    };

    const unlinkTask = (fromId: number) => {
        sprints.value = sprints.value.map((s) => ({
            ...s,
            tasks: s.tasks.map((t) => (t.id === fromId ? { ...t, next_task_id: null } : t)),
        }));
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
        addSprint,
        addTask,
        sprintBounds,
        moveSprint,
        refreshSprintDates,
        resizeSprintRight,
        applyTaskLayout,
        linkTasks,
        unlinkTask,
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
