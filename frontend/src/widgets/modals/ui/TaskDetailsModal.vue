<script setup lang="ts">
import { TaskCommentaryForm } from '@/features';
import { AppButton, AppIcon, AppModal } from '@/shared';

interface IProps {
    id: number;
}
defineProps<IProps>(); // TODO: получить таск по API и вывести информацию
</script>

<template>
  <AppModal name="taskDetails">
    <div class="px-8 py-6 flex flex-col bg-gray rounded-3xl gap-5">
      <div class="flex items-center justify-between gap-60">
        <div class="flex items-center gap-16">
          <div
            class="w-min flex items-center justify-center whitespace-nowrap gap-2 px-3 py-2 font-jost font-regular text-md text-input-placeholder bg-input-placeholder-hover/10 border border-input-placeholder-hover/20 rounded-[10px]"
          >
            {{ 'Задача 1' }}
            <!-- Заменить на "Задача" + task.id -->
          </div>
          <p class="font-jost font-normal text-[24px] text-white">
            {{ 'Олег Нифонтов' }}
            <!-- Заменить на task.user.name -->
          </p>
        </div>
        <div class="flex gap-4 items-center justify-center">
          <app-button variant-button="solid">
            <app-icon name="edit" />
          </app-button>
          <app-button variant-button="danger">
            <app-icon name="trashcan" />
          </app-button>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <p class="font-jost text-[36px] text-white">
          {{ 'Анализ воронки конверсии' }}
        </p>
        <!-- Заменить на task.name -->
        <p class="font-jost text-[24px] text-white">
          {{
            'Сделать воронку, туда-сюда, воу-воу-воу, это просто нечто, браток, а это будет делать прям няняня, кто америка прям обииииделпмб ывплоып '
          }}
        </p>
        <!-- Заменить на task.description -->
        <p class="font-jost text-[24px] text-white">
          {{ '01.01.2027 - 01.01.2027 ' }}
        </p>
        <!-- Заменить на task.started_at и task.deadline_at -->
      </div>
      <div class="flex flex-col gap-4">
        <p class="font-jost text-[36px] text-white">
          {{ 'Комментарии(107):' }}
        </p>
        <!-- Заменить на commentaries.length -->
        <div
          class="flex flex-col border-l border-lighter-gray pl-8 max-h-160 overflow-y-auto gap-5"
        />
      </div>
      <TaskCommentaryForm />
    </div>
  </AppModal>
</template>
