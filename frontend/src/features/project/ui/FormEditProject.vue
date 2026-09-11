<script setup lang="ts">
import { useForm } from 'vee-validate';
import { AppButton, GANTT_TASK_STATUS } from '@/shared';
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
    <div class="flex flex-col gap-1">
      <input
        v-model="name"
        type="text"
        placeholder="Название проекта"
        class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        v-bind="nameAttrs"
      >
      <p class="text-xs text-error">
        {{ errors.name }}
      </p>
    </div>
    <div class="flex flex-col gap-1">
      <input
        v-model="started_at"
        type="date"
        placeholder="Дата начала"
        class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        v-bind="startedAtAttrs"
      >
      <p class="text-xs text-error">
        {{ errors.started_at }}
      </p>
    </div>
    <div class="flex flex-col gap-1">
      <input
        v-model="deadline_at"
        type="date"
        placeholder="Дата окончания"
        class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        v-bind="deadlineAtAttrs"
      >
      <p class="text-xs text-error">
        {{ errors.deadline_at }}
      </p>
    </div>
    <div class="flex flex-col gap-1">
      <select
        v-model="status"
        class="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none"
      >
        <option
          v-for="option in statusOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
    <app-button
      type="submit"
      :disabled="isLoading || !!Object.keys(errors).length"
    >
      Сохранить
    </app-button>
  </form>
</template>
