<script lang="ts" setup>
import { computed, inject, provide, ref } from 'vue';
import { GanttBar } from '.';
import {
    buildDependencyPath,
    GANTT_TASK_STATUS,
    GANTT_UI_KEY,
    MS_PER_DAY,
    SPRINTS_KEY,
    TIMESCALE_KEY,
    sortByChains,
    type IGanttBar,
    type IGanttSprintBar,
    type IGanttTask,
    type IMonth,
    getSprintColor,
} from '../lib';

interface IProps {
    months: IMonth[];
}
defineProps<IProps>();

const timescale = inject(TIMESCALE_KEY)!;
const sprintsSource = inject(SPRINTS_KEY)!;

const hoveredBarId = ref<number | null>(null);
provide(GANTT_UI_KEY, { hoveredBarId });

const HEADER_HEIGHT = 24;

const dayStart = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};
const dayDiff = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);

/** Раскладка спринтов: x, y, width, height */
const sprintLayouts = computed<IGanttSprintBar[]>(() => {
    const layouts: IGanttSprintBar[] = [];
    const sprintsList = sprintsSource.sprints.value;

    // высота = максимум по спринтам, а не сумма
    const maxTasks = Math.max(1, ...sprintsList.map((s) => s.tasks.length));
    const chartHeight = HEADER_HEIGHT + maxTasks * timescale.dayHeight.value;

    for (const [index, sprint] of sprintsList.entries()) {
        const b = sprintsSource.sprintBounds(sprint);

        let x: number;
        let days: number;
        if (b.start && b.end) {
            x = timescale.dateToX(b.start);
            days = dayDiff(b.start, b.end) + 1;
        } else {
            let latest: Date | null = null;
            for (const other of sprintsList) {
                if (other.id === sprint.id) continue;
                for (const t of other.tasks) {
                    const d = new Date(t.deadline_at);
                    d.setHours(0, 0, 0, 0);
                    if (!latest || d > latest) latest = d;
                }
            }
            const start = latest ? new Date(latest.getTime() + MS_PER_DAY) : new Date();
            x = timescale.dateToX(start);
            days = 7;
        }

        layouts.push({
            id: sprint.id,
            name: sprint.name,
            x,
            y: 0, // ← все спринты с top 0
            days,
            height: chartHeight, // ← все на всю высоту
            headerHeight: HEADER_HEIGHT,
            status: sprint.status,
            color: getSprintColor(index),
        });
    }
    return layouts;
});

/** Раскладка баров всех задач */
const bars = computed<IGanttBar[]>(() => {
    const result: IGanttBar[] = [];
    const sprintLayoutById = new Map(sprintLayouts.value.map((l) => [l.id, l]));

    for (const sprint of sprintsSource.sprints.value) {
        const layout = sprintLayoutById.get(sprint.id);
        if (!layout) continue;

        const sorted = sortByChains(sprint.tasks);

        // предшественники внутри спринта
        const predecessorOf = new Map<number, IGanttTask>();
        for (const t of sorted) {
            if (t.next_task_id != null) predecessorOf.set(t.next_task_id, t);
        }
        const lockedIds = new Set(predecessorOf.keys());

        const map = new Map<number, IGanttBar>();

        for (const [i, task] of sorted.entries()) {
            const start = dayStart(new Date(task.started_at));
            const end = dayStart(new Date(task.deadline_at));
            const days = Math.max(dayDiff(start, end) + 1, 1);

            let x = timescale.dateToX(start);
            const pred = predecessorOf.get(task.id);
            if (pred) {
                const parentBar = map.get(pred.id);
                if (parentBar) x = parentBar.x + parentBar.days * timescale.dayWidth.value;
            }

            const bar: IGanttBar = {
                id: task.id,
                name: task.name,
                description: task.description,
                x,
                y: HEADER_HEIGHT + i * timescale.dayHeight.value, // ← было layout.y + layout.headerHeight + i * dayHeight
                days,
                status: task.status,
                next_task_id: task.next_task_id,
                isLocked: lockedIds.has(task.id),
                sprint_id: sprint.id,
            };
            result.push(bar);
            map.set(bar.id, bar);
        }
    }
    return result;
});

const barById = computed(() => {
    const m = new Map<number, IGanttBar>();
    for (const b of bars.value) m.set(b.id, b);
    return m;
});

/** Связи внутри и между спринтами */
const links = computed(() => {
    // Плоский список всех задач
    const all: IGanttTask[] = [];
    for (const s of sprintsSource.sprints.value) all.push(...s.tasks);
    const byId = new Map(all.map((t) => [t.id, t]));

    return all
        .filter((t) => t.next_task_id != null)
        .filter((t) => {
            if (t.status === GANTT_TASK_STATUS.CANCELLED) return false;
            const next = byId.get(t.next_task_id!);
            if (next?.status === GANTT_TASK_STATUS.CANCELLED) return false;
            return true;
        })
        .map((t) => {
            const from = barById.value.get(t.id);
            const to = barById.value.get(t.next_task_id!);
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
        .filter((x): x is NonNullable<typeof x> => x !== null);
});

const isLinkActive = (link: { fromId: number; toId: number }) =>
    hoveredBarId.value === link.fromId || hoveredBarId.value === link.toId;

const totalWidth = computed(() => {
    const w1 = bars.value.reduce(
        (max, b) => Math.max(max, b.x + b.days * timescale.dayWidth.value),
        0
    );
    const w2 = sprintLayouts.value.reduce(
        (max, l) => Math.max(max, l.x + l.days * timescale.dayWidth.value),
        0
    );
    return Math.max(w1, w2);
});

const totalHeight = computed(() => {
    const maxTasks = Math.max(1, ...sprintsSource.sprints.value.map((s) => s.tasks.length));
    return HEADER_HEIGHT + maxTasks * timescale.dayHeight.value + 16;
});

const isItToday = (month: IMonth, day: number) => {
    const t = new Date();
    return (
        t.getFullYear() === month.year && t.getMonth() === month.monthIndex && t.getDate() === day
    );
};
</script>

<template>
  <div class="flex w-full relative">
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

    <div
      class="relative"
      :style="{ width: totalWidth + 'px', height: totalHeight + 'px' }"
    >
      <div
        v-for="sprint in sprintLayouts"
        :key="`sprint-${sprint.id}`"
        class="absolute top-0 bottom-0 rounded-lg border-2 border-dashed pointer-events-none"
        :style="{
          left: sprint.x + 'px',
          width: sprint.days * timescale.dayWidth.value + 'px',
          borderColor: sprint.color.border,
          backgroundColor: sprint.color.bg,
        }"
      >
        <div
          class="flex items-center px-2 font-semibold"
          :style="{
            height: sprint.headerHeight + 'px',
            color: sprint.color.text,
          }"
        >
          {{ sprint.name }}
        </div>
      </div>

      <!-- бары задач -->
      <GanttBar
        v-for="(bar, i) in bars"
        :key="bar.id ?? i"
        :bar="bar"
      />

      <!-- стрелки-связи -->
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
