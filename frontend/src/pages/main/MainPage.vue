<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { push } from 'notivue';
import { AppButton, AppIcon, SwitchProject, AppModal, AppMiniModal, useModal } from '@/shared';
import { Routes } from '@/shared/lib';
import { useProjects, useDeleteProject, useLogout, type Project, useProfile } from '@/entities';
import {
    FormCreateProject,
    FormEditProject,
    FormChangePassword,
    FormEditProfile,
} from '@/features';

const { data: profile } = useProfile();
const { data: projects, isLoading } = useProjects();
const { mutateAsync: deleteProject } = useDeleteProject();
const { mutateAsync: logout } = useLogout();

const { openModal, closeModal } = useModal();
const router = useRouter();

const editingProject = ref<Project | null>(null);
const deletingProject = ref<Project | null>(null);

const switchProjects = computed(() =>
    (projects.value?.data ?? []).map((project) => ({
        id: project.id,
        name: project.name,
        participants: project.members.length,
        owner: project.owner?.name ?? '—',
        responsible: '—',
        createDate: project.started_at,
        endDate: project.deadline_at,
        status: project.status as 'planned' | 'in_progress' | 'done' | 'cancelled',
    }))
);

const findProject = (id: number): Project | null =>
    projects.value?.data?.find((project) => project.id === id) ?? null;

const openCreateProject = () => openModal('projectCreate');

const openEditProject = (id: number) => {
    const project = findProject(id);
    if (!project) return;
    editingProject.value = project;
    openModal('projectEdit');
};

const openDeleteProject = (id: number) => {
    const project = findProject(id);
    if (!project) return;
    deletingProject.value = project;
    openModal('projectDelete');
};

const openProject = (id: number) => {
    router.push({ name: Routes.ganttById.name, params: { id } });
};

const onProjectCreated = () => {
    push.success('Проект создан');
    closeModal();
};

const onProjectUpdated = () => {
    push.success('Проект обновлён');
    closeModal();
};

const onDeleteConfirm = async () => {
    if (!deletingProject.value) return;
    await deleteProject(deletingProject.value.id);
    deletingProject.value = null;
    closeModal();
    push.success('Проект удалён');
};

const handleLogout = async () => {
    await logout();
    router.push(Routes.login);
};
</script>

<template>
  <div class="grid grid-cols-12 gap-6 w-full max-h-screen overflow-hidden px-20 pt-10">
    <div class="col-span-8 flex flex-col gap-4">
      <div class="flex items-start">
        <div
          class="flex bg-gray p-5 gap-4 justify-start items-center text-accent-base rounded-[20px] hover:opacity-80 cursor-pointer transition duration-250"
          @click="openCreateProject"
        >
          <div class="drop-shadow-[0_0_6px_rgba(0,185,6,0.75)]">
            <app-icon name="plus" />
          </div>
          <p
            class="font-montserrat font-medium text-xl drop-shadow-[0_0_6px_rgba(0,185,6,0.75)]"
          >
            Создать проект
          </p>
        </div>
      </div>
      <div class="bg-gray p-7 rounded-3xl max-h-[92vh] flex flex-col">
        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center py-16 text-white"
        >
          <p>Загрузка проектов...</p>
        </div>
        <div
          v-else-if="switchProjects.length === 0"
          class="flex flex-col font-jost text-xl items-center justify-center py-16 text-white"
        >
          <p>Проектов пока нет</p>
        </div>
        <div
          v-else
          class="projects-scroll flex flex-col gap-4 overflow-y-auto"
        >
          <div
            v-for="project in switchProjects"
            :key="project.id"
          >
            <switch-project
              :name="project.name"
              :participants="project.participants"
              :owner="project.owner"
              :responsible="project.responsible"
              :create-date="project.createDate"
              :end-date="project.endDate"
              :status="project.status"
              @open="openProject(project.id)"
              @edit="openEditProject(project.id)"
              @delete="openDeleteProject(project.id)"
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
          @click="openModal('mini')"
        >
          <app-icon name="exit" />
        </div>
      </div>
      <div class="flex flex-col items-center gap-4">
        <app-icon name="avatar" />
        <div class="flex flex-col gap-4 text-white w-full text-2xl">
          <div class="flex w-full items-center justify-between">
            <p>
              {{ profile?.user.name }}
            </p>
            <div
              class="min-w-10 min-h-10 cursor-pointer flex justify-center rounded-xl p-2 bg-gray items-center"
              @click="openModal('profileEdit')"
            >
              <app-icon name="edit" />
            </div>
          </div>
          <div class="flex w-full items-center justify-between">
            <p>
              {{ profile?.user.email }}
            </p>
          </div>
        </div>
        <app-button
          variant-button="solid"
          @click="openModal('changePassword')"
        >
          Сменить пароль
        </app-button>
      </div>
    </div>
  </div>

  <app-modal name="projectCreate">
    <div class="flex flex-col gap-4 bg-gray p-8 rounded-[20px] w-[420px] text-white">
      <h2 class="text-2xl font-jost">
        Создать проект
      </h2>
      <form-create-project @created="onProjectCreated" />
    </div>
  </app-modal>

  <app-modal name="projectEdit">
    <div class="flex flex-col gap-4 bg-gray p-8 rounded-[20px] w-[420px] text-white">
      <h2 class="text-2xl font-montserrat">
        Редактировать проект
      </h2>
      <form-edit-project
        v-if="editingProject"
        :project="editingProject"
        @updated="onProjectUpdated"
      />
    </div>
  </app-modal>

  <app-modal name="projectDelete">
    <div
      class="flex flex-col gap-6 bg-gray p-8 rounded-[20px] w-[380px] text-white items-center"
    >
      <p class="text-xl font-montserrat">
        Удалить проект «{{ deletingProject?.name ?? '' }}»?
      </p>
      <div class="flex gap-4 justify-center">
        <app-button
          variant-button="solid"
          @click="closeModal"
        >
          Отмена
        </app-button>
        <app-button
          variant-button="danger"
          @click="onDeleteConfirm"
        >
          Удалить
        </app-button>
      </div>
    </div>
  </app-modal>

  <app-modal name="changePassword">
    <div class="flex flex-col gap-4 bg-gray p-8 rounded-[20px] w-[420px] text-white">
      <h2 class="text-2xl font-jost">
        Сменить пароль
      </h2>
      <form-change-password />
    </div>
  </app-modal>

  <app-modal name="profileEdit">
    <div class="flex flex-col gap-4 bg-gray p-8 rounded-[20px] w-[420px] text-white">
      <h2 class="text-2xl font-jost">
        Редактировать профиль
      </h2>
      <form-edit-profile
        v-if="profile"
        :user-name="profile.user.name"
        :user-email="profile.user.email"
      />
    </div>
  </app-modal>

  <app-mini-modal @confirm="handleLogout" />
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
