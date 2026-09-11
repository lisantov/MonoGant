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

const isWeekend = (day: number) => day === 0 || day === 6;
</script>

<template>
  <div class="flex w-full sticky top-0 z-9999">
    <div class="flex border-b border-widget-accent/30 bg-dark-gray text-white">
      <div
        v-for="month in months"
        :key="`${month.year}-${month.monthIndex}`"
        class="flex flex-col"
      >
        <div class="w-full flex justify-center items-center py-2">
          <p class="font-montserrat text-white font-medium text-[20px]">
            {{ month.title }}
            <span class="text-white opacity-40">{{ month.year }}г.</span>
          </p>
        </div>
        <div class="w-full flex justify-center items-center">
          <div
            v-for="day in month.days"
            :key="`${month.year}-${month.monthIndex}-${day}`"
            class="flex flex-col justify-center items-center"
            :style="{ width: timescale.dayWidth.value + 'px' }"
          >
            <p class="text-[13px] text-lighter-gray font-medium font-montserrat">
              {{ weekday(month.year, month.monthIndex, day) }}
            </p>
            <p
              class="font-montserrat font-bold text-[32px]"
              :class="
                isWeekend(new Date(month.year, month.monthIndex, day).getDay() % 7)
                  ? 'text-dark-blue-gray'
                  : 'text-white'
              "
            >
              {{ day }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
