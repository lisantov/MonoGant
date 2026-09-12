<template>
  <AppModal name="EditTeam">
    <div class="flex flex-col items-center bg-gray gap-8 p-8 rounded-xl min-w-200">
      <p
        class="font-montserrat text-2xl text-accent-light drop-shadow-[0_0_6px_rgba(0,185,6,0.75)]"
      >
        Редактирование команды проекта
        <span>(Участников: {{ props.members?.length ?? 0 }})</span>
      </p>
      <div
        class="flex w-full projects-scroll flex-col gap-4 overflow-y-auto max-h-150 text-white"
      >
        <div
          v-for="(data, index) in members"
          :key="index"
          class="flex w-full p-4 bg-dark-gray rounded-2xl justify-between items-center"
        >
          <p>{{ data.name }}</p>
          <p>{{ data.email }}</p>
          <div class="flex gap-2 items-center">
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
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { AppIcon, AppModal } from '@/shared';

interface IProps {
    members?: Array<{ name: string; email: string }>;
}

const props = defineProps<IProps>();
</script>

<style scoped lang="scss">
.projects-scroll {
    padding: 5px 10px 5px 6px;

    &::-webkit-scrollbar {
        width: 30px;
    }

    &::-webkit-scrollbar-track {
        background: #242424;
        border-radius: 10px;
        margin: 10px 0;
    }

    &::-webkit-scrollbar-thumb {
        border: 10px solid transparent;
        background-color: var(--accent-light);
        border-radius: 10px;
    }

    scrollbar-width: thin;
    scrollbar-color: var(--accent-light) #242424;
}
</style>
