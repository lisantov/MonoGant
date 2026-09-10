import type { InjectionKey, Ref } from 'vue';
import type { useTimeScale, useGanttTasks } from './composables';

export type TimeScale = ReturnType<typeof useTimeScale>;
export type TasksStore = ReturnType<typeof useGanttTasks>;

export const TIMESCALE_KEY = Symbol('timescale') as InjectionKey<TimeScale>;
export const TASKS_KEY = Symbol('tasks') as InjectionKey<TasksStore>;

export interface GanttUiState {
    hoveredBarId: Ref<number | null>;
}
export const GANTT_UI_KEY = Symbol('gantt-ui') as InjectionKey<GanttUiState>;
