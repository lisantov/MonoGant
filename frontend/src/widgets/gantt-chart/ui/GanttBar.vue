<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import {
    useGanttBarResize,
    useGanttBarDrag,
    TIMESCALE_KEY,
    SPRINTS_KEY,
    GANTT_UI_KEY,
    type IGanttBar,
    GANTT_TASK_STYLE,
} from '../lib';

interface IProps {
    bar: IGanttBar;
}
const props = defineProps<IProps>();

const timescale = inject(TIMESCALE_KEY)!;
const sprints = inject(SPRINTS_KEY)!;

const { hoveredBarId } = inject(GANTT_UI_KEY)!;

// локальная копия для composable'ов (нужен актуальный объект под рукой)
const currentBar = ref<IGanttBar>({ ...props.bar });
watch(
    () => props.bar,
    (v) => {
        currentBar.value = { ...v };
    }
);

const commit = (patch: Partial<Pick<IGanttBar, 'x' | 'days'>>) => {
    currentBar.value = { ...currentBar.value, ...patch };

    sprints.applyTaskLayout(
        currentBar.value.sprint_id!,
        currentBar.value.id,
        { x: currentBar.value.x, days: currentBar.value.days },
        timescale
    );
};

const {
    isResizing,
    ghostX: resizeGhostX,
    ghostDays: resizeGhostDays,
    startLeft,
    startRight,
} = useGanttBarResize(() => currentBar.value, {
    dayWidth: timescale.dayWidth,
    minDays: 1,
    minX: 0,
    maxX: 365 * timescale.dayWidth.value,
    onChange: ({ x, days }) => commit({ x, days }),
});

const {
    isDragging,
    ghostX: dragGhostX,
    start: startDrag,
} = useGanttBarDrag(() => currentBar.value, {
    dayWidth: timescale.dayWidth,
    minX: 0,
    maxX: 365 * timescale.dayWidth.value,
    onChange: ({ x }) => commit({ x }),
});

const onBarMouseDown = (e: MouseEvent) => {
    if (currentBar.value.isLocked) return;
    startDrag(e);
};

const onResizeMouseDown = (e: MouseEvent) => {
    if (currentBar.value.isLocked) return;
    startLeft(e);
};
</script>

<template>
  <div
    class="gantt-bar absolute flex text-sm border rounded-md ring-0 ring-transparent transition duration-150 cursor-default"
    :class="{
      'opacity-40': isDragging || isResizing,
      'cursor-grab': !isDragging && !bar.isLocked,
      'cursor-grabbing': isDragging && !bar.isLocked,
      [GANTT_TASK_STYLE.get(bar.status)!]: true,
    }"
    :style="{
      left: currentBar.x + 'px',
      top: currentBar.y + 3 + 'px',
      height: timescale.dayHeight.value - 6 + 'px',
      width: currentBar.days * timescale.dayWidth.value + 'px',
    }"
    @mousedown="onBarMouseDown"
    @mouseenter="hoveredBarId = currentBar.id"
    @mouseleave="hoveredBarId = null"
  >
    <div class="w-full flex items-center px-2 relative">
      <div
        class="gantt-bar-resizer absolute h-full w-2 bg-transparent left-0"
        :class="bar.isLocked ? 'cursor-default' : 'cursor-col-resize'"
        @mousedown.stop="onResizeMouseDown"
      />
      {{ currentBar.name }}
      <div
        class="gantt-bar-resizer absolute h-full w-2 bg-transparent right-0 cursor-col-resize"
        @mousedown.stop="startRight"
      />
    </div>
  </div>

  <!-- Призрак драга -->
  <div
    v-if="isDragging"
    class="absolute pointer-events-none rounded-md border-2 border-dashed border-blue-700 bg-blue-500/25 z-50"
    :style="{
      left: dragGhostX + 'px',
      top: currentBar.y + 3 + 'px',
      height: timescale.dayHeight.value - 6 + 'px',
      width: currentBar.days * timescale.dayWidth.value + 'px',
    }"
  >
    <div class="w-full h-full flex items-center px-2 text-xs text-blue-900 font-medium">
      {{ currentBar.name }}
    </div>
  </div>

  <!-- Призрак ресайза -->
  <div
    v-if="isResizing"
    class="absolute pointer-events-none rounded-md border-2 border-dashed border-blue-700 bg-blue-500/25 z-50"
    :style="{
      left: resizeGhostX + 'px',
      top: currentBar.y + 3 + 'px',
      height: timescale.dayHeight.value - 6 + 'px',
      width: resizeGhostDays * timescale.dayWidth.value + 'px',
    }"
  >
    <div class="w-full h-full flex items-center px-2 text-xs text-blue-900 font-medium">
      {{ currentBar.name }}
    </div>
  </div>
</template>
