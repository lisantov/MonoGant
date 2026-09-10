import type { InjectionKey, Ref } from 'vue';
import type { useTimeScale, useGanttSprints } from './composables';

export type TimeScale = ReturnType<typeof useTimeScale>;
export type SprintsStore = ReturnType<typeof useGanttSprints>;

export interface GanttLinkState {
    /** id бара-источника, или null если не тянем */
    linkingFrom: Ref<number | null>;
    /** id бара под курсором (валидная цель) */
    hoveredTargetId: Ref<number | null>;
    /** запустить протяжку — вызывается из GanttBar */
    startLink: (barId: number, e: MouseEvent) => void;
}

export interface GanttUiState {
    hoveredBarId: Ref<number | null>;
}

export const TIMESCALE_KEY = Symbol('timescale') as InjectionKey<TimeScale>;
export const SPRINTS_KEY = Symbol('sprints') as InjectionKey<SprintsStore>;
export const GANTT_UI_KEY = Symbol('gantt-ui') as InjectionKey<GanttUiState>;
export const GANTT_LINK_KEY = Symbol('gantt-link') as InjectionKey<GanttLinkState>;
