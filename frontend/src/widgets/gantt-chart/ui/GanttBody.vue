<template>
  <div class="flex w-full relative min-h-10">
    <div class="absolute inset-0 flex">
      <div
        v-for="value in months"
        :key="`${value}`"
        class="flex not-last:border-r border-gray-400"
      >
        <div
          v-for="day in value.days"
          :key="`${value}-${day}`"
          class="flex justify-center items-center not-last:border-r w-10 border-gray-100"
          :style="{ width: dayWidth + 'px' }"
        />
      </div>
    </div>
    <div
      class="relative"
      :style="{ height: bars.length * dayHeight + 'px' }"
    >
      <GanttBar
        v-for="(bar, i) in bars"
        :key="i"
        :bar
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GanttBar } from '.';
import { daysBetween, MS_PER_DAY, type IGanttBar, type IGanttTask, type IMonth } from '../lib';
import { useGranttConfigStore } from '../stores';

interface IProps {
    from: string | Date;
    months: IMonth[];
    tasks: IGanttTask[];
}
const props = defineProps<IProps>();
const { dayHeight, dayWidth } = useGranttConfigStore();

function toGanttBar(task: IGanttTask, index: number): IGanttBar {
    const start = new Date(task.started_at);
    const end = new Date(task.deadline_at);

    // округляем до целых суток, чтобы не ловить сдвиги времени
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // +1 — потому что и день старта, и день дедлайна включаются
    const days = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;

    return {
        name: task.name,
        description: task.description,
        x: daysBetween(new Date(props.from), new Date(task.started_at)) * dayWidth,
        y: index * dayHeight,
        days: Math.max(days, 1), // защита от отрицательных/нулевых диапазонов
    };
}

const bars: IGanttBar[] = props.tasks.map((t, i) => toGanttBar(t, i));
</script>
