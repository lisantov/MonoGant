import type { InjectionKey, Ref } from 'vue';
import type { useTimeScale, useGanttSprints } from './composables';

export type TimeScale = ReturnType<typeof useTimeScale>;
export type SprintsStore = ReturnType<typeof useGanttSprints>;

export const TIMESCALE_KEY = Symbol('timescale') as InjectionKey<TimeScale>;
export const SPRINTS_KEY = Symbol('sprints') as InjectionKey<SprintsStore>;

export interface GanttUiState {
    hoveredBarId: Ref<number | null>;
}
export const GANTT_UI_KEY = Symbol('gantt-ui') as InjectionKey<GanttUiState>;
