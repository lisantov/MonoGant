<script lang="ts" setup>
import { computed, inject } from 'vue';
import { GANTT_TASK_STATUS, SPRINTS_KEY } from '../lib';
import { AppButton, AppIcon, Routes } from '@/shared';
import { useRouter } from 'vue-router';

const sprints = inject(SPRINTS_KEY);
const completedTasks = computed(
    () => sprints?.allTasks.value.filter((i) => i.task.status === GANTT_TASK_STATUS.DONE).length
);
const router = useRouter();
</script>

<template>
  <div class="w-full px-8 py-10 flex justify-between bg-dark-gray border-t border-white/6">
    <p class="font-jost text-md text-dark-blue-gray">
      Всего задач: {{ sprints?.allTasks.value.length ?? 0 }} &bull; Выполнено:
      {{ completedTasks }} &bull; Не выполнено:
      {{ (sprints?.allTasks.value.length ?? 0) - (completedTasks ?? 0) }} &bull; Команда: 3
      человека
    </p>
    <div class="w-min whitespace-nowrap flex items-center gap-8">
      <app-button
        variant-button="solid"
        size="md"
        class="flex justify-center items-center gap-3 text-[16px] font-jost font-normal"
        @click.stop="router.push(Routes.main.path)"
      >
        <app-icon name="exit" />
        Вернуться к проектам
      </app-button>
      <app-button
        variant-button="accent"
        size="md"
        class="flex justify-center items-center gap-3 text-[16px] font-jost font-normal"
      >
        <app-icon name="team" />
        Настроить команду
      </app-button>
    </div>
  </div>
</template>
