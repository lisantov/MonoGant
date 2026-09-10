<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import { GanttBody, GanttHeader } from '.';
import {
    addDays,
    MONTH_NAMES,
    TIMESCALE_KEY,
    TASKS_KEY,
    useTimeScale,
    useGanttTasks,
    type IGanttConfig,
    type IGanttTask,
    type IMonth,
} from '../lib';

interface IProps {
    tasks?: IGanttTask[];
    config?: IGanttConfig;
}
const props = defineProps<IProps>();

const tasksSource = useGanttTasks(toRef(props, 'tasks'));
const timescale = useTimeScale(props.config, tasksSource.tasks);

provide(TASKS_KEY, tasksSource);
provide(TIMESCALE_KEY, timescale);

const months = computed<IMonth[]>(() => {
    const { minStart, maxEnd } = timescale.getBounds(tasksSource.tasks.value);

    const from = minStart ?? timescale.timelineStart.value;
    const to = maxEnd ?? addDays(timescale.timelineStart.value, 60);

    from.setHours(0, 0, 0, 0);
    to.setHours(0, 0, 0, 0);

    if (from > to) return [];

    const result: IMonth[] = [];
    const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
    const end = new Date(to.getFullYear(), to.getMonth(), 1);

    while (cursor <= end) {
        const year = cursor.getFullYear();
        const monthIndex = cursor.getMonth();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        const startDay =
            year === from.getFullYear() && monthIndex === from.getMonth() ? from.getDate() : 1;

        const endDay =
            year === to.getFullYear() && monthIndex === to.getMonth() ? to.getDate() : daysInMonth;

        result.push({
            title: MONTH_NAMES[monthIndex]!,
            year,
            monthIndex,
            days: Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i),
        });

        cursor.setMonth(cursor.getMonth() + 1);
    }

    return result;
});
</script>

<template>
  <section
    class="rounded-xl overflow-hidden border border-gray-400 bg-white flex flex-col overflow-x-auto"
  >
    <GanttHeader :months="months" />
    <GanttBody
      :months="months"
      :tasks="tasksSource.sortedTasks.value"
    />
  </section>
</template>
