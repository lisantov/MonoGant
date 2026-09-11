<script setup lang="ts">
import { AppButton, AppInput } from '@/shared';
import { useForm } from 'vee-validate';
import { useQueryCache } from '@pinia/colada';
import { taskCreateSchema } from '@/features';
import { useCreateTask, PROJECT_QUERY_KEYS, type Task } from '@/entities';

interface IProps {
    sprintId: number;
    userOptions: Array<{ name: string; email: string }>;
    projectId?: number;
}
const props = defineProps<IProps>();

const emit = defineEmits<{
    created: [task: Task];
}>();

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: taskCreateSchema,
});

const { mutateAsync, isLoading } = useCreateTask();
const queryCache = useQueryCache();

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [started_at] = defineField('started_at');
const [deadline_at] = defineField('deadline_at');
const [user_email] = defineField('user_email');

const onSubmit = handleSubmit(async (values) => {
    const created = await mutateAsync({ ...values, sprintId: props.sprintId });
    emit('created', created?.task);
    if (props.projectId) {
        queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.parse(props.projectId) });
    }
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
          class="rounded-[10px] border-[1px] border-accent-light px-[12px] py-[10px] text-[18px] text-dark-gray bg-white outline-none"
        >
          <option
            value=""
            disabled
          >
            Выбрать исполнителя
          </option>
          <option
            v-if="!userOptions.length"
            value=""
            disabled
          >
            Нет участников
          </option>
          <option
            v-for="option in userOptions"
            :key="option.email"
            :value="option.email"
          >
            {{ option.name }}
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
