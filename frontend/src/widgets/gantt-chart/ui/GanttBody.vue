<script lang="ts" setup>
import { computed, inject } from 'vue';
import { GanttBar } from '.';
import { MS_PER_DAY, TIMESCALE_KEY, type IGanttBar, type IGanttTask, type IMonth } from '../lib';

interface IProps {
    months: IMonth[];
    tasks: IGanttTask[];
}
const props = defineProps<IProps>();

const timescale = inject(TIMESCALE_KEY)!;

const bars = computed<IGanttBar[]>(() =>
    props.tasks.map((task, index) => {
        const start = new Date(task.started_at);
        const end = new Date(task.deadline_at);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const days = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;

        return {
            id: task.id,
            name: task.name,
            description: task.description,
            x: timescale.dateToX(start),
            y: index * timescale.dayHeight.value,
            days: Math.max(days, 1),
        };
    })
);
</script>

<template>
  <div class="flex w-full relative min-h-10">
    <div class="absolute inset-0 flex">
      <div
        v-for="month in months"
        :key="`${month.year}-${month.title}`"
        class="flex not-last:border-r border-gray-400"
      >
        <div
          v-for="day in month.days"
          :key="`${month.year}-${month.title}-${day}`"
          class="flex justify-center items-center not-last:border-r border-gray-100"
          :style="{ width: timescale.dayWidth.value + 'px' }"
        />
      </div>
    </div>
    <div
      class="relative"
      :style="{ height: bars.length * timescale.dayHeight.value + 'px' }"
    >
      <GanttBar
        v-for="(bar, i) in bars"
        :key="bar.id ?? i"
        :bar="bar"
      />
    </div>
  </div>
</template>
