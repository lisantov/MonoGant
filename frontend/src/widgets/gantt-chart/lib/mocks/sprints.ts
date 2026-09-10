import { GANTT_TASK_STATUS, type IGanttSprint } from '../types';
import { DEFAULT_TASKS } from './tasks';

export const DEFAULT_SPRINTS: IGanttSprint[] = [
    {
        id: 1,
        name: 'Спринт 1',
        description: 'Крутой спринт',
        status: GANTT_TASK_STATUS.IN_PROGRESS,
        tasks: DEFAULT_TASKS,
    },
];
