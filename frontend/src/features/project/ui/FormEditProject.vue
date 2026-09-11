<script setup lang="ts">
import { useForm } from 'vee-validate';
import { AppButton, AppInput, GANTT_TASK_STATUS } from '@/shared';
import { useUpdateProject, type Project } from '@/entities';
import { projectEditSchema } from '../lib/validation';
import { ref } from 'vue';

interface IProps {
    project: Project;
}
const props = defineProps<IProps>();

interface Props {
    status: 'planned' | 'in_progress' | 'done' | 'cancelled';
}

const emit = defineEmits<{
    updated: [project: Project];
}>();

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: projectEditSchema,
    initialValues: {
        name: props.project.name,
        started_at: props.project.started_at,
        deadline_at: props.project.deadline_at ?? '',
        status: props.project.status,
    },
});

const isOpen = ref(false);

const [name, nameAttrs] = defineField('name');
const [started_at, startedAtAttrs] = defineField('started_at');
const [deadline_at, deadlineAtAttrs] = defineField('deadline_at');
const [status] = defineField('status');

const { mutateAsync, isLoading } = useUpdateProject();

const statusOptions = Object.values(GANTT_TASK_STATUS);

const onSubmit = handleSubmit(async (values) => {
    const updated = await mutateAsync({
        id: props.project.id,
        data: {
            name: values.name,
            started_at: values.started_at,
            deadline_at: values.deadline_at || undefined,
            status: values.status as GANTT_TASK_STATUS,
        },
    });
    emit('updated', updated);
});

const translatedStatuses: Record<Props['status'], string> = {
    planned: 'Запланирован',
    in_progress: 'В работе',
    done: 'Завершён',
    cancelled: 'Отменён',
};

const translateStatus = (status: Props['status']): string => {
    return translatedStatuses[status] ?? status;
};
</script>

<template>
  <form
    class="flex flex-col gap-4"
    @submit.prevent="onSubmit"
  >
    <div class="flex flex-col gap-1">
      <app-input
        v-model="name"
        type="text"
        placeholder="Название проекта"
        v-bind="nameAttrs"
      />
      <p class="text-xs text-error">
        {{ errors.name }}
      </p>
    </div>
    <div class="flex flex-col gap-1">
      <app-input
        v-model="started_at"
        type="date"
        placeholder="Дата начала"
        v-bind="startedAtAttrs"
      />
      <p class="text-xs text-error">
        {{ errors.started_at }}
      </p>
    </div>
    <div class="flex flex-col gap-1">
      <app-input
        v-model="deadline_at"
        type="date"
        placeholder="Дата окончания"
        v-bind="deadlineAtAttrs"
      />
      <p class="text-xs text-error">
        {{ errors.deadline_at }}
      </p>
    </div>
    <div class="relative w-full">
      <button
        type="button"
        class="flex p-4 outline-none font-montserrat justify-between items-center w-full gap-4 text-white bg-dark-gray rounded-2xl border-2 border-input-outline transition duration-300 hover:bg-white/5 hover:shadow-[0_0_12px_1px_rgba(2,255,11,0.3)] active:bg-white/10 focus:shadow-[0_0_20px_1px_rgba(2,255,11,0.3)]"
        @click="isOpen = !isOpen"
      >
        <span :class="status ? 'text-white' : 'text-input-placeholder font-montserrat'">
          {{ translateStatus(status) || 'Выбрать статус' }}
        </span>

        <svg
          class="w-5 h-5 transition-transform duration-300"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 w-full rounded-2xl border-2 border-input-outline bg-dark-gray shadow-[0_0_20px_1px_rgba(2,255,11,0.15)] overflow-hidden backdrop-blur-sm"
      >
        <ul class="max-h-60 overflow-y-auto py-2 custom-scrollbar">
          <li
            v-for="option in statusOptions"
            :key="option"
            class="px-4 py-3 font-montserrat text-white transition-all duration-200 cursor-pointer hover:bg-white/10 hover:shadow-[inset_4px_0_0_0_rgba(2,255,11,0.8)] active:bg-white/20"
            :class="status === option ? 'bg-white/5 text-[#02ff0b] font-semibold' : ''"
            @click="
              status = option;
              isOpen = false;
            "
          >
            {{ translateStatus(option) }}
          </li>
        </ul>
      </div>
    </div>

    <app-button
      type="submit"
      :disabled="isLoading || !!Object.keys(errors).length"
      variant-button="accent"
    >
      Сохранить
    </app-button>
  </form>
</template>
