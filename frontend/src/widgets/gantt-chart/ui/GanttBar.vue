<script setup lang="ts">
import { ref } from 'vue';
import { useGanttBarResize, useGanttBarDrag, type IGanttBar } from '../lib';
import { useGranttConfigStore } from '../stores';

interface IProps {
    bar: IGanttBar;
}
const props = defineProps<IProps>();
const currentBar = ref<IGanttBar>({ ...props.bar });

// если бар — часть store, эмит не нужен, мутируем прямо там
const { dayHeight, dayWidth } = useGranttConfigStore();

const {
    isResizing,
    ghostX: resizeGhostX,
    ghostDays: resizeGhostDays,
    startLeft,
    startRight,
} = useGanttBarResize(() => currentBar.value, {
    dayWidth,
    minDays: 1,
    minX: 0,
    maxX: 365 * dayWidth,
    onChange: ({ x, days }) => {
        currentBar.value = { ...currentBar.value, x, days };
    },
});

const {
    isDragging,
    ghostX: dragGhostX,
    start: startDrag,
} = useGanttBarDrag(() => currentBar.value, {
    dayWidth,
    minX: 0,
    maxX: 365 * dayWidth, // пример верхней границы
    onChange: ({ x }) => {
        currentBar.value.x = x;
    },
});
</script>

<template>
  <div
    class="absolute flex bg-blue-500 text-sm text-white rounded-md ring-0 ring-transparent transition duration-150"
    :class="{
      'opacity-40': isDragging || isResizing,
      'cursor-grab': !isDragging,
      'cursor-grabbing': isDragging,
    }"
    :style="{
      left: currentBar.x + 'px',
      top: currentBar.y + 3 + 'px',
      height: dayHeight - 6 + 'px',
      width: currentBar.days * dayWidth + 'px',
    }"
    @mousedown="startDrag"
  >
    <div class="w-full flex items-center px-2 relative">
      <div
        class="absolute h-full w-2 bg-transparent left-0 cursor-col-resize"
        @mousedown.stop="startLeft"
      />
      {{ bar.name }}
      <div
        class="absolute h-full w-2 bg-transparent right-0 cursor-col-resize"
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
      height: dayHeight - 6 + 'px',
      width: currentBar.days * dayWidth + 'px',
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
      height: dayHeight - 6 + 'px',
      width: resizeGhostDays * dayWidth + 'px',
    }"
  >
    <div class="w-full h-full flex items-center px-2 text-xs text-blue-900 font-medium">
      {{ currentBar.name }}
    </div>
  </div>
</template>
