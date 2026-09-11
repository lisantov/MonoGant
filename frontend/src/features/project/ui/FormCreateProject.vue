<script setup lang="ts">
import { useForm } from 'vee-validate';
import { AppButton } from '@/shared';
import { useCreateProject, type Project } from '@/entities';
import { projectCreateSchema } from '../lib/validation';

const emit = defineEmits<{
    created: [project: Project];
}>();

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: projectCreateSchema,
});

const [name, nameAttrs] = defineField('name');
const [started_at, startedAtAttrs] = defineField('started_at');
const [deadline_at, deadlineAtAttrs] = defineField('deadline_at');

const { mutateAsync, isLoading } = useCreateProject();

const onSubmit = handleSubmit(async (values) => {
    const created = await mutateAsync({
        name: values.name,
        started_at: values.started_at,
        deadline_at: values.deadline_at || undefined,
    });
    emit('created', created.project);
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
    <app-button
      type="submit"
      :disabled="isLoading || !!Object.keys(errors).length"
    >
      Создать проект
    </app-button>
  </form>
</template>
