<script setup lang="ts">
import { ref } from 'vue';
import { useGanttBarResize, type IGanttBar } from '../lib';
import { useGranttConfigStore } from '../stores';

interface IProps {
    bar: IGanttBar;
}
const props = defineProps<IProps>();
const currentBar = ref<IGanttBar>(props.bar);

// если бар — часть store, эмит не нужен, мутируем прямо там
const { dayHeight, dayWidth } = useGranttConfigStore();

const { isResizing, startLeft, startRight } = useGanttBarResize(() => currentBar.value, {
    dayWidth,
    minDays: 1,
    minX: 0,
    onChange: ({ x, days }) => {
        // вариант A: bar приходит из store — обновляем там
        currentBar.value = {
            ...currentBar.value,
            x,
            days,
        };

        // вариант B: bar — проп, отдаём наверх
        // emit('update:bar', { ...props.bar, x, days })
    },
});
</script>

<template>
  <div
    class="absolute flex bg-blue-500 text-sm text-white rounded-md ring-0 ring-transparent transition duration-150"
    :class="{ 'ring-2 ring-blue-700!': isResizing }"
    :style="{
      left: currentBar.x + 'px',
      top: currentBar.y + 3 + 'px',
      height: dayHeight - 6 + 'px',
      width: currentBar.days * dayWidth + 'px',
    }"
  >
    <div class="w-full flex items-center px-2 relative">
      <div
        class="absolute h-full w-2 bg-transparent left-0 cursor-col-resize"
        @mousedown="startLeft"
      />
      {{ bar.name }}
      <div
        class="absolute h-full w-2 bg-transparent right-0 cursor-col-resize"
        @mousedown="startRight"
      />
    </div>
  </div>
</template>
