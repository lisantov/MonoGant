<script setup lang="ts">
import { AppButton, AppModal } from '@/shared';
import AppTask from '@/shared/ui/task/AppTask.vue';
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
      <div>
        <div>
          <select>
            выбрать исполнителя
          </select>
          <div />
        </div>
        <div class="flex justify-between">
          <label>
            <input
              type="date"
              class="date"
            >
          </label>
          <div class="h-[2px] w-[54px] bg-input-placeholder" />
          <label>
            <input
              type="date"
              class="date"
            >
          </label>
        </div>
        <app-button>Создать задание</app-button>
      </div>
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
