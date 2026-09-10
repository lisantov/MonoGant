<script lang="ts" setup>
import { inject } from 'vue';
import { DAY_NAMES, TIMESCALE_KEY, type IMonth } from '../lib';

interface IProps {
    months: IMonth[];
}
defineProps<IProps>();

const timescale = inject(TIMESCALE_KEY)!;

const weekday = (year: number, monthIndex: number, day: number) =>
    DAY_NAMES[new Date(year, monthIndex, day).getDay()];
</script>

<template>
  <div class="flex w-full">
    <div class="flex border-b border-gray-400">
      <div
        v-for="month in months"
        :key="`${month.year}-${month.monthIndex}`"
        class="flex flex-col border-r border-gray-400"
      >
        <div class="w-full flex justify-center items-center border-b border-gray-400">
          {{ month.title }} {{ month.year }}г.
        </div>
        <div class="w-full flex justify-center items-center">
          <div
            v-for="day in month.days"
            :key="`${month.year}-${month.monthIndex}-${day}`"
            class="flex flex-col justify-center items-center not-last:border-r border-gray-400"
            :style="{ width: timescale.dayWidth.value + 'px' }"
          >
            <p>{{ day }}</p>
            <span class="text-xs opacity-60">
              {{ weekday(month.year, month.monthIndex, day) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
