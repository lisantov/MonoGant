<template>
  <div class="flex w-full">
    <div class="flex border-b border-gray-400">
      <div
        v-for="value in months"
        :key="`${value}`"
        class="flex flex-col border-r border-gray-400"
      >
        <div class="w-full flex justify-center items-center border-b border-gray-400">
          {{ value.title }} {{ value.year }}г.
        </div>
        <div class="w-full flex justify-center items-center">
          <div
            v-for="day in value.days"
            :key="`${value}-${day}`"
            class="flex flex-col justify-center items-center not-last:border-r w-10 border-gray-400"
            :style="{ width: dayWidth + 'px' }"
          >
            <p>{{ day }}</p>
            <span class="text-xs opacity-60">{{ DAY_NAMES[day % 7]! }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IMonth } from '../lib';
import { DAY_NAMES } from '../lib/constants/date';
import { useGranttConfigStore } from '../stores';

interface IProps {
    months: IMonth[];
}
defineProps<IProps>();

const { dayWidth } = useGranttConfigStore();
</script>
