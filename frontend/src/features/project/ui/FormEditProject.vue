<script setup lang="ts">
import { useForm } from 'vee-validate';
import { AppButton, AppInput, GANTT_TASK_STATUS } from '@/shared';
import { useUpdateProject, type Project } from '@/entities';
import { projectEditSchema } from '../lib/validation';

interface IProps {
    project: Project;
}
const props = defineProps<IProps>();

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

const [name, nameAttrs] = defineField('name');
const [started_at, startedAtAttrs] = defineField('started_at');
const [deadline_at, deadlineAtAttrs] = defineField('deadline_at');
const [status] = defineField('status');

const { mutateAsync, isLoading } = useUpdateProject();

const statusOptions = Object.values(GANTT_TASK_STATUS);

const statusLabels: Record<GANTT_TASK_STATUS, string> = {
    [GANTT_TASK_STATUS.PLANNED]: 'Запланирован',
    [GANTT_TASK_STATUS.IN_PROGRESS]: 'В процессе',
    [GANTT_TASK_STATUS.DONE]: 'Завершён',
    [GANTT_TASK_STATUS.CANCELLED]: 'Отменён',
};

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
</script>

<template>
  <form
    class="flex flex-col gap-4"
    @submit.prevent="onSubmit"
  >
    <app-input
      v-model="name"
      type="text"
      placeholder="Название проекта"
      :error="errors.name"
      v-bind="nameAttrs"
    />
    <app-input
      v-model="started_at"
      type="date"
      placeholder="Дата начала"
      :error="errors.started_at"
      v-bind="startedAtAttrs"
    />
    <app-input
      v-model="deadline_at"
      type="date"
      placeholder="Дата окончания"
      :error="errors.deadline_at"
      v-bind="deadlineAtAttrs"
    />
    <label class="flex flex-col gap-1">
      <span class="text-sm font-montserrat text-input-placeholder"> Статус </span>
      <select
        v-model="status"
        class="bg-dark-gray font-montserrat text-white leading-none rounded-2xl border-2 border-input-outline px-5 py-4 outline-none transition duration-300 hover:bg-white/5 focus:border-accent-base"
      >
        <option
          v-for="option in statusOptions"
          :key="option"
          :value="option"
          class="bg-dark-gray text-white"
        >
          {{ statusLabels[option] }}
        </option>
      </select>
    </label>
    <app-button
      type="submit"
      :disabled="isLoading || !!Object.keys(errors).length"
      variant-button="accent"
    >
      Сохранить
    </app-button>
  </form>
</template>
