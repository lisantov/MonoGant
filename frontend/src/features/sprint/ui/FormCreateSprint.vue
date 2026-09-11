<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useCreateSprint, type Sprint } from '@/entities';
import { sprintCreateSchema } from '../lib/validation';

interface IProps {
    projectId: number;
}
const props = defineProps<IProps>();

const emit = defineEmits<{
    created: [sprint: Sprint];
}>();

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: sprintCreateSchema,
});

const [name, nameAttrs] = defineField('name');

const { mutateAsync, isLoading } = useCreateSprint();

const onSubmit = handleSubmit(async (values) => {
    const result = await mutateAsync({
        projectId: props.projectId,
        name: values.name,
        description: '',
    });
    name.value = '';
    emit('created', result.sprint);
});
</script>

<template>
  <form
    class="flex flex-col gap-2"
    @submit.prevent="onSubmit"
  >
    <input
      v-model="name"
      type="text"
      placeholder="Название спринта"
      class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
      v-bind="nameAttrs"
    >
    <button
      type="submit"
      class="rounded bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 disabled:opacity-50"
      :disabled="isLoading || !!Object.keys(errors).length"
    >
      + Добавить спринт
    </button>
  </form>
</template>
