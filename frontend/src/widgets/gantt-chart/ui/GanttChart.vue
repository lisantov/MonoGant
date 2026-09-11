<script setup lang="ts">
import { computed, onMounted, provide, ref, toRef } from 'vue';
import { GanttBody, GanttHeader, GanttSidebar } from '.';
import {
    addDays,
    MONTH_NAMES,
    TIMESCALE_KEY,
    SPRINTS_KEY,
    useTimeScale,
    useGanttSprints,
    type IGanttConfig,
    type IGanttSprint,
    type IMonth,
    usePanScroll,
} from '../lib';

interface IProps {
    sprints?: IGanttSprint[];
    config?: IGanttConfig;
}
const props = defineProps<IProps>();

const scrollContainer = ref<HTMLElement | null>(null);

const sprintsSource = useGanttSprints(toRef(props, 'sprints'));

// timescale принимает все задачи всех спринтов
const timescale = useTimeScale(props.config, () => sprintsSource.allTasks.value.map((x) => x.task));

provide(SPRINTS_KEY, sprintsSource);
provide(TIMESCALE_KEY, timescale);

const months = computed<IMonth[]>(() => {
    const tasks = sprintsSource.allTasks.value.map((x) => x.task);
    const { minStart, maxEnd } = timescale.getBounds(tasks);

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
        !!target.closest('.gantt-link-handle') ||
        !!target.closest('button, a, input, select, textarea'),
});

onMounted(() => {
    const el = scrollContainer.value;
    if (!el) return;

    const first = sprintsSource.allTasks.value[0];
    if (!first) {
        el.scrollTo({ left: 0 });
        return;
    }
    const x = timescale.dateToX(new Date(first.task.started_at));
    el.scrollTo({ left: Math.max(0, x - 24) });
});
</script>

<template>
  <div
    class="rounded-xl border border-gray-400 bg-white flex overflow-hidden"
    style="height: 600px"
  >
    <GanttSidebar />

    <section
      ref="scrollContainer"
      class="flex-1 flex flex-col overflow-auto [overflow-anchor:none]"
      :class="{ 'cursor-grabbing': isPanning, 'cursor-grab': !isPanning }"
      @mousedown="onPanStart"
    >
      <GanttHeader :months="months" />
      <GanttBody :months="months" />
    </section>
  </div>
</template>
