<script setup lang="ts">
import { AppButton, AppInput } from '@/shared';
import { useForm } from 'vee-validate';
import { taskCreateSchema } from '@/features';
import { useCreateTask, type Account } from '@/entities';

interface IProps {
    sprintId: number;
    userOptions: Omit<Account, 'createdAt' | 'updatedAt'>[];
}
const props = defineProps<IProps>();

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: taskCreateSchema,
});

const { mutateAsync, isLoading } = useCreateTask();

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [started_at] = defineField('started_at');
const [deadline_at] = defineField('deadline_at');
const [user_email] = defineField('user_email');

const onSubmit = handleSubmit((values) => {
    mutateAsync({ ...values, sprintId: props.sprintId });
});
</script>

<template>
  <form
    class="linear-border flex flex-col gap-15"
    @submit.prevent="onSubmit"
  >
    <div class="flex flex-col gap-20 justify-center">
      <div class="flex flex-col gap-5">
        <app-input
          v-model="name"
          placeholder="Название задачи"
          :error="errors.name"
          v-bind="nameAttrs"
        />
        <app-input
          v-model="description"
          placeholder="Описание задачи"
          :error="errors.description"
          v-bind="descriptionAttrs"
        />
        <select
          v-model="user_email"
          placeholder="Выбрать исполнителя"
        >
          <option
            v-for="option in userOptions"
            :key="option.id"
            :value="option.email"
          >
            {{ `${option.lastName} ${option.firstName}` }}
          </option>
        </select>
        <input
          v-model="started_at"
          type="date"
          placeholder="Дата начала"
        >
        <input
          v-model="deadline_at"
          type="date"
          placeholder="Дата конца"
        >
      </div>
      <div class="flex flex-col gap-5">
        <app-button
          type="submit"
          :disabled="!!Object.keys(errors).length || isLoading"
        >
          Создать задачу
        </app-button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
