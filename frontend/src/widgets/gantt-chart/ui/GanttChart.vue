<script setup lang="ts">
import { computed } from 'vue';
import { GanttBody, GanttHeader } from '.';
import { MONTH_NAMES, type IGanttTask, type IMonth } from '../lib';

interface IProps {
    from: string | Date;
    to: string | Date;
}
const props = defineProps<IProps>();

const months = computed<IMonth[]>(() => {
    const from = new Date(props.from);
    const to = new Date(props.to);

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

        // определяем границы дней внутри месяца
        const startDay =
            year === from.getFullYear() && monthIndex === from.getMonth() ? from.getDate() : 1;

        const endDay =
            year === to.getFullYear() && monthIndex === to.getMonth() ? to.getDate() : daysInMonth;

        result.push({
            title: MONTH_NAMES[monthIndex]!,
            year,
            days: Array.from({ length: endDay - startDay + 1 }, (_, i) => startDay + i),
        });

        cursor.setMonth(cursor.getMonth() + 1);
    }

    return result;
});

const tasks: IGanttTask[] = [
    {
        name: 'Задача 1',
        description: 'Задача 1',
        started_at: '2026-09-10',
        deadline_at: '2026-09-20',
    },
    {
        name: 'Задача 2',
        description: 'Задача 2',
        started_at: '2026-9-21',
        deadline_at: '2026-9-25',
    },
    {
        name: 'Задача 3',
        description: 'Задача 3',
        started_at: '2026-09-26',
        deadline_at: '2026-09-30',
    },
];
</script>

<template>
  <section
    class="rounded-xl overflow-hidden border border-gray-400 bg-white flex flex-col overflow-x-auto"
  >
    <GanttHeader :months />
    <GanttBody
      :from
      :months
      :tasks
    />
  </section>
</template>
