<script setup lang="ts">
import { AppButton, AppIcon, SwitchProject } from '@/shared';

interface Props {
    name: string;
    participants: string | number;
    owner: string;
    responsible: string;
    createDate: string;
    endDate: string;
    status: 'planned' | 'in_progress' | 'done' | 'cancelled';
}

const projectsData: Props[] = [
    {
        name: 'ArcheCode',
        participants: 13,
        owner: 'Олегов А.',
        responsible: 'Петров Б.',
        createDate: '01.01.2001',
        endDate: '01.01.2001',
        status: 'done',
    },
    {
        name: 'DataFlow',
        participants: 8,
        owner: 'Сидоров В.',
        responsible: 'Иванов Г.',
        createDate: '15.03.2024',
        endDate: '30.09.2024',
        status: 'in_progress',
    },
    {
        name: 'CloudSync',
        participants: 5,
        owner: 'Кузнецов Д.',
        responsible: 'Смирнов Е.',
        createDate: '10.06.2025',
        endDate: '15.12.2025',
        status: 'planned',
    },
    {
        name: 'NeuroNet',
        participants: 21,
        owner: 'Волков Ж.',
        responsible: 'Новиков З.',
        createDate: '05.01.2023',
        endDate: '20.08.2023',
        status: 'cancelled',
    },
    {
        name: 'SecureVault',
        participants: 12,
        owner: 'Морозов И.',
        responsible: 'Павлов К.',
        createDate: '22.11.2024',
        endDate: '01.06.2025',
        status: 'in_progress',
    },
];
</script>

<template>
  <div class="grid grid-cols-12 gap-6 w-full h-full">
    <div class="col-span-8 flex flex-col gap-4">
      <div class="flex items-start">
        <div
          class="flex bg-gray p-5 gap-4 justify-start items-center text-accent-base rounded-[20px] hover:opacity-80 cursor-pointer"
        >
          <div class="drop-shadow-[0_0_6px_rgba(0,185,6,0.75)]">
            <app-icon name="plus" />
          </div>
          <p class="drop-shadow-[0_0_6px_rgba(0,185,6,0.75)]">
            Создать проект
          </p>
        </div>
      </div>
      <div class="bg-gray p-7 rounded-3xl max-h-[92vh] flex flex-col">
        <div class="projects-scroll flex flex-col gap-4 overflow-y-auto">
          <div
            v-for="(project, index) in projectsData"
            :key="index"
          >
            <switch-project
              :name="project.name"
              :participants="project.participants"
              :owner="project.owner"
              :responsible="project.responsible"
              :create-date="project.createDate"
              :end-date="project.endDate"
              :status="project.status"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-1" />
    <div class="col-span-3 flex flex-col gap-8">
      <div class="flex justify-end">
        <div
          class="min-w-10 min-h-10 text-white cursor-pointer flex justify-center rounded-xl p-2 bg-gray border border-light-gray items-center"
        >
          <app-icon name="exit" />
        </div>
      </div>
      <div class="flex flex-col items-center gap-4">
        <app-icon name="avatar" />
        <div class="flex flex-col gap-4 text-white w-full text-2xl">
          <div class="flex w-full items-center justify-between">
            <p>Анатолий Рудской</p>
            <div
              class="min-w-10 min-h-10 cursor-pointer flex justify-center rounded-xl p-2 bg-gray items-center"
            >
              <app-icon name="edit" />
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <p>anatolya@gmail.com</p>
            <div
              class="min-w-10 min-h-10 cursor-pointer flex justify-center rounded-xl p-2 bg-gray items-center"
            >
              <app-icon name="edit" />
            </div>
          </div>
        </div>
        <app-button variant-button="solid">
          Сменить пароль
        </app-button>
      </div>
    </div>
  </div>
</template>

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
