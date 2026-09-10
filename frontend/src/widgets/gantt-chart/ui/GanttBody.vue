<script lang="ts" setup>
import { computed, inject, provide, ref } from 'vue';
import { GanttBar } from '.';
import {
    buildDependencyPath,
    GANTT_TASK_STATUS,
    GANTT_UI_KEY,
    MS_PER_DAY,
    TIMESCALE_KEY,
    topoSort,
    type IGanttBar,
    type IGanttTask,
    type IMonth,
} from '../lib';

interface IProps {
    months: IMonth[];
    tasks: IGanttTask[];
}
const props = defineProps<IProps>();

const timescale = inject(TIMESCALE_KEY)!;

const hoveredBarId = ref<number | null>(null);
provide(GANTT_UI_KEY, { hoveredBarId });

const bars = computed<IGanttBar[]>(() => {
    const result: IGanttBar[] = [];
    const map = new Map<number, IGanttBar>();

    const sorted = topoSort([...props.tasks]);

    for (const [index, task] of sorted.entries()) {
        const start = new Date(task.started_at);
        const end = new Date(task.deadline_at);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const days = Math.max(Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1, 1);

        let x = timescale.dateToX(start);

        // зависимая задача всегда прижата к правому краю родителя
        if (task.depends_on != null) {
            const parent = map.get(task.depends_on);
            if (parent) {
                x = parent.x + parent.days * timescale.dayWidth.value;
            }
        }

        const bar: IGanttBar = {
            id: task.id,
            name: task.name,
            description: task.description,
            x,
            y: index * timescale.dayHeight.value,
            days,
            status: task.status,
            depends_on: task.depends_on,
            isLocked: task.depends_on != null,
        };
        result.push(bar);
        map.set(bar.id, bar);
    }

    return result;
});

// карта id → бар
const barById = computed(() => {
    const map = new Map<number, IGanttBar>();
    for (const b of bars.value) map.set(b.id, b);
    return map;
});

// все стрелки
const links = computed(() =>
    props.tasks
        .filter((t) => t.depends_on != null)
        .filter((t) => t.status !== GANTT_TASK_STATUS.CANCELLED)
        .map((t) => {
            const from = barById.value.get(t.depends_on!);
            const to = barById.value.get(t.id);
            if (!from || !to) return null;
            return {
                id: `${from.id}->${to.id}`,
                fromId: from.id,
                toId: to.id,
                d: buildDependencyPath(
                    from,
                    to,
                    timescale.dayWidth.value,
                    timescale.dayHeight.value
                ),
            };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
);

const isLinkActive = (link: { id: string; fromId: number; toId: number }) =>
    hoveredBarId.value === link.fromId || hoveredBarId.value === link.toId;

// размеры полотна
const totalWidth = computed(() => {
    const lastX = bars.value.reduce(
        (max, b) => Math.max(max, b.x + b.days * timescale.dayWidth.value),
        0
    );
    return lastX;
});
const totalHeight = computed(() => (bars.value.length + 2) * timescale.dayHeight.value);

const isItToday = (month: IMonth, day: number) =>
    new Date().getFullYear() === month.year &&
    new Date().getMonth() === month.monthIndex &&
    new Date().getDate() === day;
</script>

<template>
  <div class="flex w-full relative min-h-80">
    <!-- сетка -->
    <div class="absolute inset-0 flex">
      <div
        v-for="month in months"
        :key="`${month.year}-${month.monthIndex}`"
        class="flex not-last:border-r border-gray-400"
      >
        <div
          v-for="day in month.days"
          :key="`${month.year}-${month.monthIndex}-${day}`"
          class="flex justify-center items-center not-last:border-r border-gray-100 relative"
          :style="{ width: timescale.dayWidth.value + 'px' }"
        >
          <div
            v-if="isItToday(month, day)"
            class="absolute top-0.5 bottom-0.5 w-2 rounded-xl -left-1 bg-red-600 z-999 opacity-30"
          />
        </div>
      </div>
    </div>

    <!-- контейнер с барами + SVG-слой -->
    <div
      class="relative"
      :style="{ width: totalWidth + 'px', height: totalHeight + 'px' }"
    >
      <!-- бары -->
      <GanttBar
        v-for="(bar, i) in bars"
        :key="bar.id ?? i"
        :bar="bar"
      />

      <!-- стрелки-связи: z-10, pointer-events-none чтобы не ловить клики -->
      <svg
        class="absolute inset-0 z-10"
        :width="totalWidth"
        :height="totalHeight"
        style="pointer-events: none"
      >
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill="#93c5fd"
            />
          </marker>
          <marker
            id="arrowhead-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill="#1e40af"
            />
          </marker>
        </defs>

        <path
          v-for="link in links"
          :key="link.id"
          :d="link.d"
          class="gantt-link"
          :class="{ 'gantt-link--active': isLinkActive(link) }"
          fill="none"
          stroke-linejoin="round"
          :marker-end="isLinkActive(link) ? 'url(#arrowhead-active)' : 'url(#arrowhead)'"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.gantt-link {
    stroke: #93c5fd;
    stroke-width: 1.5;
    pointer-events: stroke;
    transition:
        stroke 0.15s,
        stroke-width 0.15s;
}

.gantt-link--active {
    stroke: #1e40af;
    stroke-width: 2;
}
</style>
