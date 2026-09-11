<script setup lang="ts">
import { FormCreateTask } from '@/features';
import { AppModal } from '@/shared';
import AppTask from '@/shared/ui/task/AppTask.vue';

interface IProps {
    sprintId: number;
}
defineProps<IProps>();
</script>

<template>
  <app-modal name="taskApp">
    <div class="bg-gray p-[16px] rounded-[15px] relative">
      <div class="flex w-full">
        <div
          class="absolute flex items-center whitespace-nowrap justify-between px-[12px] py-[7px] border-[1px] rounded-[10px] text-accent-light border-accent-light text-[22px] gap-[5px] font-jost"
        >
          <div class="size-[8px] rounded-[4px] bg-accent-light" />
          Спринт 1
        </div>
        <h3 class="w-full text-accent-light text-[36px] text-center textTask">
          Задачи
        </h3>
      </div>
      <form-create-task
        :sprint-id="sprintId"
        s
      />
      <div class="flex flex-col p-[20px] w-[850px] gap-[16px]">
        <app-task />
        <app-task />
      </div>
    </div>
  </app-modal>
</template>

<style scoped lang="scss">
.textTask {
    text-shadow: 0 19px 10px 0 rgba(85, 240, 91, 0.25);
}
</style>
