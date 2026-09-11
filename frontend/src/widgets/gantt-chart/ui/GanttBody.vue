<script lang="ts" setup>
import { computed, inject, provide, ref, onBeforeUnmount, reactive } from 'vue';
import { GanttBar } from '.';
import {
    buildDependencyPath,
    GANTT_TASK_STATUS,
    GANTT_UI_KEY,
    MS_PER_DAY,
    SPRINTS_KEY,
    TIMESCALE_KEY,
    GANTT_LINK_KEY,
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

const HEADER_HEIGHT = 66;

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

const chartRef = ref<HTMLElement | null>(null);

const linkingFrom = ref<number | null>(null);
const hoveredTargetId = ref<number | null>(null);
const cursor = reactive({ x: 0, y: 0 });

const toLocal = (e: MouseEvent) => {
    const r = chartRef.value!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
};

const hitTest = (x: number, y: number): number | null => {
    for (const b of bars.value) {
        const w = b.days * timescale.dayWidth.value;
        const h = timescale.dayHeight.value;
        if (x >= b.x && x <= b.x + w && y >= b.y && y <= b.y + h) {
            return b.id;
        }
    }
    return null;
};

const onMouseMove = (e: MouseEvent) => {
    if (linkingFrom.value == null) return;
    const p = toLocal(e);
    cursor.x = p.x;
    cursor.y = p.y;

    const hitId = hitTest(p.x, p.y);

    // валидная цель: не сам source, не потомок source, в том же спринте
    if (hitId == null || hitId === linkingFrom.value) {
        hoveredTargetId.value = null;
        return;
    }
    const sourceBar = bars.value.find((b) => b.id === linkingFrom.value);
    const targetBar = bars.value.find((b) => b.id === hitId);
    if (!sourceBar || !targetBar || sourceBar.sprint_id !== targetBar.sprint_id) {
        hoveredTargetId.value = null;
        return;
    }
    hoveredTargetId.value = hitId;
};

const onMouseUp = () => {
    if (linkingFrom.value != null && hoveredTargetId.value != null) {
        const res = sprintsSource.linkTasks(linkingFrom.value, hoveredTargetId.value);
        if (!res.ok) console.warn('[gantt] link:', res.error);
    }
    stopLink();
};

const stopLink = () => {
    linkingFrom.value = null;
    hoveredTargetId.value = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
};

const startLink = (barId: number, e: MouseEvent) => {
    e.preventDefault();
    linkingFrom.value = barId;
    hoveredTargetId.value = null;
    const p = toLocal(e);
    cursor.x = p.x;
    cursor.y = p.y;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'crosshair';
};

provide(GANTT_LINK_KEY, { linkingFrom, hoveredTargetId, startLink });
onBeforeUnmount(stopLink);

const linkPreviewPath = computed(() => {
    if (linkingFrom.value == null) return null;
    const from = barById.value.get(linkingFrom.value);
    if (!from) return null;

    let endX = cursor.x;
    let endY = cursor.y;

    if (hoveredTargetId.value != null) {
        const to = barById.value.get(hoveredTargetId.value);
        if (to) {
            endX = to.x;
            endY = to.y + timescale.dayHeight.value / 2;
        }
    }

    return buildDependencyPath(
        from,
        { x: endX, y: endY },
        timescale.dayWidth.value,
        timescale.dayHeight.value
    );
});
</script>

<template>
    <div class="flex w-full relative h-full">
        <!-- сетка -->
        <div class="absolute inset-0 flex">
            <div
                v-for="month in months"
                :key="`${month.year}-${month.monthIndex}`"
                class="flex not-last:border-r border-white/32 bg-gray"
            >
                <div
                    v-for="day in month.days"
                    :key="`${month.year}-${month.monthIndex}-${day}`"
                    class="flex justify-center items-center not-last:border-r border-white/6 relative"
                    :style="{ width: timescale.dayWidth.value + 'px' }"
                >
                    <div
                        v-if="isItToday(month, day)"
                        class="absolute top-2.5 bottom-2.5 w-30 rounded-3xl left-0 bg-red-600 z-999 opacity-20"
                    />
                </div>
            </div>
        </div>

        <div ref="chartRef" class="relative">
            <div
                v-for="sprint in sprintLayouts"
                :key="`sprint-${sprint.id}`"
                class="absolute top-0 bottom-0 rounded-lg border-2 border-dashed pointer-events-none p-3.75"
                :style="{
                    left: sprint.x + 'px',
                    width: sprint.days * timescale.dayWidth.value + 'px',
                    borderColor: sprint.color.border,
                    backgroundColor: sprint.color.bg,
                }"
            >
                <div
                    class="w-min flex items-center justify-center whitespace-nowrap gap-2 px-3 py-2 font-jost font-regular text-md text-input-placeholder bg-input-placeholder-hover/10 border border-input-placeholder-hover/20 rounded-[10px]"
                >
                    <div class="rounded-full bg-input-placeholder w-2 aspect-square" />
                    {{ sprint.name }}
                </div>
            </div>

            <!-- бары задач -->
            <GanttBar v-for="(bar, i) in bars" :key="bar.id ?? i" :bar="bar" />

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
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#56ae63" />
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
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#55f05b" />
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
                <path
                    v-if="linkPreviewPath"
                    :d="linkPreviewPath"
                    class="gantt-link gantt-link--preview"
                    fill="none"
                    stroke-linejoin="round"
                    marker-end="url(#arrowhead-active)"
                />
            </svg>
        </div>
    </div>
</template>

<style scoped>
.gantt-link {
    stroke: #56ae63;
    stroke-width: 1.5;
    pointer-events: stroke;
    transition:
        stroke 0.15s,
        stroke-width 0.15s;
}

.gantt-link--active {
    stroke: #55f05b;
    stroke-width: 2;
}

.gantt-link--preview {
    stroke: #1e40af;
    stroke-dasharray: 4 4;
    stroke-width: 2;
}
</style>
