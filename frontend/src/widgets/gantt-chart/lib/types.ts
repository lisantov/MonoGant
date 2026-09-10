export interface IMonth {
    title: string;
    year: number;
    monthIndex: number;
    days: number[];
}

export interface IGanttConfig {
    dayWidth: number;
    dayHeight: number;
    minDayWidth: number;
    maxDayWidth: number;
}

export enum GANTT_TASK_STATUS {
    PLANNED = 'planned',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
    CANCELLED = 'cancelled',
}

export const GANTT_TASK_TEXT = new Map([
    [GANTT_TASK_STATUS.PLANNED, 'Запланирована'],
    [GANTT_TASK_STATUS.IN_PROGRESS, 'В работе'],
    [GANTT_TASK_STATUS.DONE, 'Завершена'],
    [GANTT_TASK_STATUS.CANCELLED, 'Отменена'],
]);

export const GANTT_TASK_STYLE = new Map([
    [GANTT_TASK_STATUS.PLANNED, 'bg-blue-400 border-blue-500 text-white'],
    [GANTT_TASK_STATUS.IN_PROGRESS, 'bg-yellow-500 border-yellow-600 text-white'],
    [GANTT_TASK_STATUS.DONE, 'bg-green-400 border-green-500 text-white'],
    [GANTT_TASK_STATUS.CANCELLED, 'bg-gray-500 border-gray-600 text-white opacity-40'],
]);

export interface IGanttTask {
    id: number;
    name: string;
    description: string;
    started_at: string;
    deadline_at: string;
    status: GANTT_TASK_STATUS;
    next_task_id?: number | null;
}

export interface IGanttSprint {
    id: number;
    name: string;
    description: string;
    status: GANTT_TASK_STATUS;
    tasks: IGanttTask[];
}

export interface IGanttBar {
    id: number;
    name: string;
    description: string;
    x: number;
    y: number;
    days: number;
    status: GANTT_TASK_STATUS;
    next_task_id?: number | null;
    isLocked?: boolean;
    sprint_id: number;
}

/** Вычисленный layout спринта для рендера */
export interface IGanttSprintBar {
    id: number;
    name: string;
    x: number;
    y: number;
    days: number;
    height: number;
    headerHeight: number;
    status: GANTT_TASK_STATUS;
}

export const MS_PER_DAY = 1000 * 60 * 60 * 24;
