<script setup lang="ts">
import { useForm } from 'vee-validate';
import { AppButton, AppInput } from '@/shared';
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
    class="flex flex-col gap-4"
    @submit.prevent="onSubmit"
  >
    <app-input
      v-model="name"
      type="text"
      placeholder="Название спринта"
      :error="errors.name"
      v-bind="nameAttrs"
    />
    <app-button
      type="submit"
      :disabled="isLoading || !!Object.keys(errors).length"
      variant-button="accent"
    >
      Добавить спринт
    </app-button>
  </form>
</template>
