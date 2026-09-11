<script setup lang="ts">
import { AppIcon } from '@/shared';

interface Props {
    name: string;
    participants: string | number;
    owner: string;
    responsible: string;
    createDate: string;
    endDate: string;
    status: 'planned' | 'in_progress' | 'done' | 'cancelled';
}

defineProps<Props>();

const translatedStatuses: Record<Props['status'], string> = {
    planned: 'Запланирован',
    in_progress: 'В работе',
    done: 'Завершён',
    cancelled: 'Отменён',
};

const translateStatus = (status: Props['status']): string => {
    return translatedStatuses[status] ?? status;
};

const editProject = () => {};
</script>

<template>
  <div
    class="flex bg-dark-gray p-8 gap-7 rounded-3xl flex-col w-full h-full font-montserrat text-white transition-all duration-300 hover:scale-97 cursor-pointer"
  >
    <div class="flex w-full justify-between items-center">
      <p class="text-[28px]">
        {{ name }}
      </p>
      <div class="flex gap-4">
        <div
          class="min-w-10 min-h-10 cursor-pointer flex justify-center rounded-xl p-2 bg-gray border border-light-gray items-center"
          @click="editProject"
        >
          <app-icon name="edit" />
        </div>
        <div
          class="min-w-10 min-h-10 cursor-pointer flex justify-center rounded-xl p-2 bg-gray border border-light-gray items-center"
        >
          <app-icon
            name="trashcan"
            class="text-error"
          />
        </div>
      </div>
    </div>
    <span class="border border-light-gray" />
    <div class="grid grid-cols-3 gap-6">
      <div class="card">
        <div class="flex justify-between">
          <p>Участники</p>
          <div
            class="min-w-5 min-h-5 flex justify-center rounded-xl p-2 bg-gray items-center"
          >
            <AppIcon name="people" />
          </div>
        </div>
        <p class="text-xl">
          {{ participants }}
        </p>
      </div>
      <div class="card">
        <div class="flex justify-between">
          <p class="text-sm">
            Дата создания
          </p>
          <div
            class="min-w-5 min-h-5 flex justify-center rounded-xl p-2 bg-gray items-center"
          >
            <AppIcon name="owner" />
          </div>
        </div>
        <p class="text-xl">
          {{ createDate }}
        </p>
      </div>
      <div class="card">
        <div class="flex justify-between">
          <p class="text-sm">
            Статус
          </p>
          <div
            class="min-w-5 min-h-5 flex justify-center rounded-xl p-2 bg-gray items-center"
          >
            <AppIcon name="info" />
          </div>
        </div>
        <div>
          <p class="text-xl">
            {{ translateStatus(status) }}
          </p>
        </div>
      </div>
      <div class="card">
        <div class="flex justify-between">
          <p class="text-sm">
            Владелец
          </p>
          <div
            class="min-w-5 min-h-5 flex justify-center rounded-xl p-2 bg-gray items-center"
          >
            <AppIcon name="owner" />
          </div>
        </div>
        <p class="text-xl">
          {{ owner }}
        </p>
      </div>
      <div class="card">
        <div class="flex justify-between">
          <p class="text-sm">
            Ответственный
          </p>
          <div
            class="min-w-5 min-h-5 flex justify-center rounded-xl p-2 bg-gray items-center"
          >
            <AppIcon name="responsible" />
          </div>
        </div>
        <p class="text-xl">
          {{ responsible }}
        </p>
      </div>
      <div class="card">
        <div class="flex justify-between">
          <p class="text-sm">
            Дата окончания
          </p>
          <div
            class="min-w-5 min-h-5 flex justify-center rounded-xl p-2 bg-gray items-center"
          >
            <AppIcon name="calendar-check" />
          </div>
        </div>
        <p class="text-xl">
          {{ endDate }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
    display: flex;
    gap: 8px;
    flex-direction: column;
    padding: 16px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
