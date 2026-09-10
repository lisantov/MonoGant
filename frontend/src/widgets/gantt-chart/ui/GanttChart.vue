<script setup lang="ts">
import { computed, onMounted, provide, ref, toRef } from 'vue';
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
    usePanScroll,
} from '../lib';

interface IProps {
    tasks?: IGanttTask[];
    config?: IGanttConfig;
}
const props = defineProps<IProps>();
const scrollContainer = ref<HTMLElement | null>(null);

onMounted(() => {
    if (scrollContainer.value) {
        const firstTask = tasksSource.tasks.value[0];
        if (!firstTask) scrollContainer.value.scrollTo({ left: 0 });

        const x = timescale.dateToX(new Date(firstTask!.started_at));
        scrollContainer.value.scrollTo({ left: Math.max(0, x - 24) });
    }
});

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

const { isPanning, onMouseDown: onPanStart } = usePanScroll(scrollContainer, {
    shouldIgnore: (target) =>
        !!target.closest('.gantt-bar') ||
        !!target.closest('.gantt-bar-resizer') ||
        !!target.closest('button, a, input, select, textarea'),
});
</script>

<template>
  <section
    ref="scrollContainer"
    class="rounded-xl border border-gray-400 bg-white flex flex-col overflow-auto"
    :class="{ 'cursor-grabbing': isPanning, 'cursor-grab': !isPanning }"
    @mousedown="onPanStart"
  >
    <GanttHeader :months="months" />
    <GanttBody
      :months="months"
      :tasks="tasksSource.tasks.value"
    />
  </section>
</template>
