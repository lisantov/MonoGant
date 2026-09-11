import { ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { IGanttSprint, IGanttTask } from '../types';
import { GANTT_TASK_STATUS } from '../types';
import { useGanttSprints } from '../composables/useGanttSprints';
import { useTimeScale } from '../composables/useTimeScale';

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

const sprint = (overrides: Partial<IGanttSprint> = {}): IGanttSprint => ({
    id: 1,
    name: 'Спринт 1',
    description: '',
    status: GANTT_TASK_STATUS.PLANNED,
    completion_percentage: 0,
    tasks: [],
    ...overrides,
});

afterEach(() => {
    vi.useRealTimers();
});

describe('useGanttSprints', () => {
    it('инициализируется из source и следит за его изменениями', async () => {
        const source = ref<IGanttSprint[]>([sprint({ id: 1 })]);

        const store = useGanttSprints(source);
        expect(store.sprints.value).toHaveLength(1);

        source.value = [sprint({ id: 99 })];
        await new Promise((r) => setTimeout(r)); // дожидаемся flush watcher'а
        expect(store.sprints.value[0]!.id).toBe(99);
    });

    it('addSprint: назначает следующий id и имя по умолчанию', () => {
        const store = useGanttSprints(ref([sprint({ id: 1 })]));

        const id = store.addSprint('');
        expect(id).toBe(2);
        const created = store.sprints.value.find((s) => s.id === 2)!;
        expect(created.name).toBe('Спринт 2');
        expect(created.status).toBe(GANTT_TASK_STATUS.PLANNED);
        expect(created.completion_percentage).toBe(0);
        expect(created.tasks).toEqual([]);
    });

    it('addSprint: принимает явные имя и id и обрезает пробелы', () => {
        const store = useGanttSprints(ref([]));

        let sprintId = store.addSprint('   Крутой спринт   ', 42);
        expect(sprintId).toBe(42);
        expect(store.sprints.value[0]!.name).toBe('Крутой спринт');

        sprintId = store.addSprint('Явный номер', 100);
        expect(sprintId).toBe(100);
        expect(store.sprints.value[1]!.id).toBe(100);
    });

    it('addTask: в непустом спринте начинает со дня после дедлайна последней задачи', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [task({ id: 5, started_at: '2026-09-10', deadline_at: '2026-09-15' })],
                }),
            ])
        );

        store.addTask(1, { name: 'Новая' });
        const added = store.sprints.value[0]!.tasks[1]!;

        expect(added.id).toBe(6);
        expect(added.name).toBe('Новая');
        expect(added.started_at).toBe('2026-09-16');
        expect(added.deadline_at).toBe('2026-09-17');
        expect(added.status).toBe(GANTT_TASK_STATUS.PLANNED);
    });

    it('addTask: в пустом спринте берёт день после последнего дедлайна других спринтов', () => {
        const store = useGanttSprints(
            ref([
                sprint({ id: 1 }),
                sprint({
                    id: 2,
                    tasks: [task({ id: 3, started_at: '2026-09-01', deadline_at: '2026-09-20' })],
                }),
            ])
        );

        store.addTask(1);
        const added = store.sprints.value.find((s) => s.id === 1)!.tasks[0]!;

        expect(added.started_at).toBe('2026-09-21');
        expect(added.deadline_at).toBe('2026-09-22');
        expect(added.name).toBe('Задача 1');
    });

    it('addTask: в пустом проекте стартует от «завтра» и не падает', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 5, 15));

        const store = useGanttSprints(ref([]));
        store.addSprint('S');
        store.addTask(1);

        const added = store.sprints.value[0]!.tasks[0]!;
        expect(added.started_at).toBe('2026-06-16');
        expect(added.deadline_at).toBe('2026-06-17');
    });

    it('addTask: уважает явно переданные даты', () => {
        const store = useGanttSprints(ref([sprint({ id: 1 })]));

        store.addTask(1, { started_at: '2026-10-01', deadline_at: '2026-10-05' });
        const added = store.sprints.value[0]!.tasks[0]!;
        expect(added.started_at).toBe('2026-10-01');
        expect(added.deadline_at).toBe('2026-10-05');
    });

    it('sprintBounds: считает границы по задачам спринта', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [
                        task({ id: 1, started_at: '2026-09-05', deadline_at: '2026-09-09' }),
                        task({ id: 2, started_at: '2026-09-01', deadline_at: '2026-09-25' }),
                    ],
                }),
            ])
        );

        expect(store.sprintBounds(store.sprints.value[0]!)).toEqual({
            start: new Date(2026, 8, 1),
            end: new Date(2026, 8, 25),
        });
    });

    it('sprintBounds: пустой спринт даёт null-границы', () => {
        const store = useGanttSprints(ref([sprint({ id: 1 })]));
        expect(store.sprintBounds(store.sprints.value[0]!)).toEqual({ start: null, end: null });
    });

    it('allTasks: возвращает отсортированные по цепочкам задачи со ссылкой на спринт', () => {
        const store = useGanttSprints(
            ref([sprint({ id: 1, tasks: [task({ id: 1, next_task_id: 2 }), task({ id: 2 })] })])
        );

        expect(store.allTasks.value.map((t) => t.task.id)).toEqual([1, 2]);
        expect(store.allTasks.value[0]!.sprintId).toBe(1);
    });

    it('moveSprint: сдвигает все задачи спринта на deltaDays', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [
                        task({ id: 1, started_at: '2026-09-10', deadline_at: '2026-09-15' }),
                        task({ id: 2, started_at: '2026-09-20', deadline_at: '2026-09-22' }),
                    ],
                }),
            ])
        );

        store.moveSprint(1, 5);
        const tasks = store.sprints.value[0]!.tasks;
        expect(tasks[0]!.started_at).toBe('2026-09-15');
        expect(tasks[0]!.deadline_at).toBe('2026-09-20');
        expect(tasks[1]!.started_at).toBe('2026-09-25');
        expect(tasks[1]!.deadline_at).toBe('2026-09-27');
    });

    it('linkTasks: запрещает связывание задачи с самой собой', () => {
        const store = useGanttSprints(ref([sprint({ id: 1, tasks: [task({ id: 1 })] })]));
        expect(store.linkTasks(1, 1)).toEqual({
            ok: false,
            error: 'Нельзя связать задачу саму с собой',
        });
    });

    it('linkTasks: сообщает о ненайденной задаче', () => {
        const store = useGanttSprints(ref([sprint({ id: 1, tasks: [task({ id: 1 })] })]));
        expect(store.linkTasks(1, 999)).toEqual({ ok: false, error: 'Задача не найдена' });
        expect(store.linkTasks(999, 1)).toEqual({ ok: false, error: 'Задача не найдена' });
    });

    it('linkTasks: требует, чтобы задачи были в одном спринте', () => {
        const store = useGanttSprints(
            ref([
                sprint({ id: 1, tasks: [task({ id: 1 })] }),
                sprint({ id: 2, tasks: [task({ id: 2 })] }),
            ])
        );
        expect(store.linkTasks(1, 2)).toEqual({
            ok: false,
            error: 'Задачи должны быть в одном спринте',
        });
    });

    it('linkTasks: защищает от циклов', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [task({ id: 1, next_task_id: 2 }), task({ id: 2 })],
                }),
            ])
        );
        expect(store.linkTasks(2, 1)).toEqual({ ok: false, error: 'Образуется цикл' });
    });

    it('linkTasks: связывает задачи и перестраивает даты следующей задачи', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [
                        task({ id: 1, started_at: '2026-09-01', deadline_at: '2026-09-03' }),
                        task({ id: 2, started_at: '2026-09-10', deadline_at: '2026-09-12' }),
                    ],
                }),
            ])
        );

        expect(store.linkTasks(1, 2)).toEqual({ ok: true });

        const [a, b] = store.sprints.value[0]!.tasks;
        expect(a!.next_task_id).toBe(2);
        // длительность сохраняется (3 дня), старт — на следующий день после дедлайна a
        expect(b!.started_at).toBe('2026-09-04');
        expect(b!.deadline_at).toBe('2026-09-06');
    });

    it('linkTasks: разрывает прежнюю связь с целью', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [task({ id: 1 }), task({ id: 2 }), task({ id: 3, next_task_id: 2 })],
                }),
            ])
        );

        store.linkTasks(1, 2);
        const three = store.sprints.value[0]!.tasks.find((t) => t.id === 3)!;
        expect(three.next_task_id).toBeNull();
        expect(store.sprints.value[0]!.tasks.find((t) => t.id === 1)!.next_task_id).toBe(2);
    });

    it('unlinkTask: сбрасывает next_task_id', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [task({ id: 1, next_task_id: 2 }), task({ id: 2 })],
                }),
            ])
        );

        store.unlinkTask(1);
        expect(store.sprints.value[0]!.tasks[0]!.next_task_id).toBeNull();
    });

    it('resizeSprintRight: растягивает только самую позднюю задачу', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [
                        task({ id: 1, started_at: '2026-09-01', deadline_at: '2026-09-05' }),
                        task({ id: 2, started_at: '2026-09-08', deadline_at: '2026-09-10' }),
                    ],
                }),
            ])
        );

        // спринт сейчас 10 дней (01.09–10.09), растягиваем до 12 → delta = +2
        store.resizeSprintRight(1, 12);
        const tasks = store.sprints.value[0]!.tasks;
        expect(tasks.find((t) => t.id === 2)!.deadline_at).toBe('2026-09-12');
        expect(tasks.find((t) => t.id === 1)!.deadline_at).toBe('2026-09-05');
    });

    it('resizeSprintRight: сжимает самую позднюю задачу, но не раньше её старта', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [
                        task({ id: 1, started_at: '2026-09-01', deadline_at: '2026-09-05' }),
                        task({ id: 2, started_at: '2026-09-08', deadline_at: '2026-09-15' }),
                    ],
                }),
            ])
        );

        // спринт сейчас 15 дней, сжимаем до 8 → delta = −7 → дедлайн задачи 2 = 09-08 (её старт)
        store.resizeSprintRight(1, 8);
        const tasks = store.sprints.value[0]!.tasks;
        expect(tasks.find((t) => t.id === 2)!.deadline_at).toBe('2026-09-08');
        expect(tasks.find((t) => t.id === 1)!.deadline_at).toBe('2026-09-05');
    });

    it('resizeSprintRight: не меняет ничего при delta = 0', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [task({ id: 1, started_at: '2026-09-01', deadline_at: '2026-09-10' })],
                }),
            ])
        );

        store.resizeSprintRight(1, 10);
        expect(store.sprints.value[0]!.tasks[0]!.deadline_at).toBe('2026-09-10');
    });

    it('resizeSprintRight: защита не ужимает задачу раньше её старта', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [
                        task({ id: 1, started_at: '2026-09-01', deadline_at: '2026-09-03' }),
                        task({ id: 2, started_at: '2026-09-08', deadline_at: '2026-09-10' }),
                    ],
                }),
            ])
        );

        // сжатие до 1 дня сильнее, чем позволяет старт задачи 2 → дедлайн не меняется
        store.resizeSprintRight(1, 1);
        const tasks = store.sprints.value[0]!.tasks;
        expect(tasks.find((t) => t.id === 2)!.deadline_at).toBe('2026-09-10');
        expect(tasks.find((t) => t.id === 1)!.deadline_at).toBe('2026-09-03');
    });

    it('applyTaskLayout: с предшественником стартует на следующий день после его дедлайна', () => {
        const store = useGanttSprints(
            ref([
                sprint({
                    id: 1,
                    tasks: [
                        task({ id: 1, started_at: '2026-09-01', deadline_at: '2026-09-03' }),
                        task({ id: 2, started_at: '2026-09-10', deadline_at: '2026-09-20' }),
                    ],
                }),
            ])
        );
        store.linkTasks(1, 2);

        const timescale = useTimeScale({ dayWidth: 50 });
        store.applyTaskLayout(1, 2, { x: 0, days: 5 }, timescale);

        const b = store.sprints.value[0]!.tasks.find((t) => t.id === 2)!;
        expect(b.started_at).toBe('2026-09-04');
        expect(b.deadline_at).toBe('2026-09-08');
    });

    it('applyTaskLayout: без предшественника позиционируется по x', () => {
        const source = [
            task({ id: 1, started_at: '2026-09-01', deadline_at: '2026-09-03' }),
            task({ id: 2 }),
        ];
        const store = useGanttSprints(ref([sprint({ id: 1, tasks: source })]));
        const timescale = useTimeScale({ dayWidth: 50 }, ref(source));

        // timelineStart = 2026-08-02, x = 50 → +1 день → 2026-08-03
        store.applyTaskLayout(1, 2, { x: 50, days: 3 }, timescale);

        const b = store.sprints.value[0]!.tasks.find((t) => t.id === 2)!;
        expect(b.started_at).toBe('2026-08-03');
        expect(b.deadline_at).toBe('2026-08-05');
    });

    it('applyTaskLayout: каскадно пересчитывает даты по цепочке', () => {
        const source = [
            task({ id: 1, started_at: '2026-09-01', deadline_at: '2026-09-02', next_task_id: 2 }),
            task({ id: 2, started_at: '2026-09-05', deadline_at: '2026-09-06', next_task_id: 3 }),
            task({ id: 3, started_at: '2026-09-09', deadline_at: '2026-09-10' }),
        ];
        const store = useGanttSprints(ref([sprint({ id: 1, tasks: source })]));
        const timescale = useTimeScale({ dayWidth: 50 }, ref(source));

        store.applyTaskLayout(1, 1, { x: 0, days: 5 }, timescale);

        const byId = new Map(store.sprints.value[0]!.tasks.map((t) => [t.id, t]));
        expect(byId.get(1)!.started_at).toBe('2026-08-02');
        expect(byId.get(1)!.deadline_at).toBe('2026-08-06');
        // для обеих следующих задач сохраняется их длительность (2 дня)
        expect(byId.get(2)!.started_at).toBe('2026-08-07');
        expect(byId.get(2)!.deadline_at).toBe('2026-08-08');
        expect(byId.get(3)!.started_at).toBe('2026-08-09');
        expect(byId.get(3)!.deadline_at).toBe('2026-08-10');
    });
});
