<script setup lang="ts">
import { useForm } from 'vee-validate';
import { AppButton, AppInput, GANTT_TASK_STATUS } from '@/shared';
import { useUpdateTask, PROJECT_QUERY_KEYS, type Task } from '@/entities';
import { taskEditSchema } from '../lib/validation';
import { ref, watch } from 'vue';
import { useQueryCache } from '@pinia/colada';

interface IProps {
    task?: Task;
    userOptions: Array<{ name: string; email: string }>;
    projectId?: number;
}
const props = defineProps<IProps>();

const emit = defineEmits<{
    updated: [task: Task];
    cancel: [];
}>();

const isDropdownOpen = ref<boolean>(false);

const { defineField, errors, handleSubmit, resetForm, values } = useForm({
    validationSchema: taskEditSchema,
    initialValues: {
        name: props.task?.name ?? '',
        description: props.task?.description ?? '',
        started_at: props.task?.started_at,
        deadline_at: props.task?.deadline_at,
        status: props.task?.status,
        user_email: props.task?.user?.email ?? '',
    },
});

const { mutateAsync, isLoading } = useUpdateTask();
const queryCache = useQueryCache();

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [started_at] = defineField('started_at');
const [deadline_at] = defineField('deadline_at');
const [status] = defineField('status');
const [user_email] = defineField('user_email');

watch(
    () => props.task,
    (task) => {
        if (!task) return;
        resetForm({
            values: {
                name: task.name,
                description: task.description ?? '',
                started_at: task.started_at,
                deadline_at: task.deadline_at,
                status: task.status,
                user_email: task.user?.email ?? '',
            },
        });
        console.log(values);
    },
    { immediate: true }
);

const statusLabels: Record<GANTT_TASK_STATUS, string> = {
    [GANTT_TASK_STATUS.PLANNED]: 'Запланирована',
    [GANTT_TASK_STATUS.IN_PROGRESS]: 'В работе',
    [GANTT_TASK_STATUS.DONE]: 'Завершена',
    [GANTT_TASK_STATUS.CANCELLED]: 'Отменена',
};

const onSubmit = handleSubmit(async (values) => {
    const updated = await mutateAsync({
        id: props.task!.id,
        data: {
            name: values.name,
            description: values.description || undefined,
            started_at: values.started_at,
            deadline_at: values.deadline_at,
            status: values.status as GANTT_TASK_STATUS,
            user_email: values.user_email || undefined,
        },
    });
    emit('updated', updated.task);
    if (props.projectId) {
        queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.parse(props.projectId) });
    }
});
</script>

<template>
  <form
    class="flex flex-col gap-4"
    @submit.prevent="onSubmit"
  >
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
    <div class="flex gap-4">
      <div class="flex flex-col flex-1">
        <input
          v-model="started_at"
          type="date"
          placeholder="Дата начала"
          class="bg-dark-gray font-montserrat text-white px-4 py-3 rounded-2xl border-2 border-input-outline outline-none transition duration-300 focus:border-accent-base"
        >
      </div>
      <div class="flex flex-col flex-1">
        <input
          v-model="deadline_at"
          type="date"
          placeholder="Дата конца"
          class="bg-dark-gray font-montserrat text-white px-4 py-3 rounded-2xl border-2 border-input-outline outline-none transition duration-300 focus:border-accent-base"
        >
      </div>
    </div>
    <label class="flex flex-col gap-1">
      <span class="text-sm font-montserrat text-input-placeholder"> Статус </span>
      <select
        v-model="status"
        class="bg-dark-gray font-montserrat text-white leading-none rounded-2xl border-2 border-input-outline px-4 py-3 outline-none transition duration-300 hover:bg-white/5 focus:border-accent-base"
      >
        <option
          v-for="option in Object.values(GANTT_TASK_STATUS)"
          :key="option"
          :value="option"
          class="bg-dark-gray text-white"
        >
          {{ statusLabels[option as GANTT_TASK_STATUS] }}
        </option>
      </select>
    </label>
    <div class="relative w-full">
      <button
        type="button"
        class="flex p-4 outline-none font-montserrat justify-between items-center w-full gap-4 text-white bg-dark-gray rounded-2xl border-2 border-input-outline transition duration-300 hover:bg-white/5 hover:shadow-[0_0_12px_1px_rgba(2,255,11,0.3)] active:bg-white/10 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 focus:shadow-[0_0_20px_1px_rgba(2,255,11,0.3)]"
        @click="isDropdownOpen = !isDropdownOpen"
      >
        <span :class="user_email ? 'text-white' : 'text-input-placeholder font-montserrat'">
          {{
            user_email
              ? userOptions.find((u) => u.email === user_email)?.name
              : 'Выбрать исполнителя'
          }}
        </span>
        <svg
          class="w-5 h-5 transition-transform duration-300"
          :class="{ 'rotate-180': isDropdownOpen }"
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
        v-if="isDropdownOpen"
        class="absolute z-50 mt-2 w-full rounded-2xl border-2 border-input-outline bg-dark-gray shadow-[0_0_20px_1px_rgba(2,255,11,0.15)] overflow-hidden backdrop-blur-sm"
      >
        <ul class="max-h-60 overflow-y-auto py-2 custom-scrollbar">
          <li
            v-if="!userOptions.length"
            class="px-4 py-3 text-input-placeholder font-montserrat cursor-default"
          >
            Нет участников
          </li>
          <li
            v-for="option in userOptions"
            :key="option.email"
            class="px-4 py-3 font-montserrat text-white transition-all duration-200 cursor-pointer hover:bg-white/10 hover:shadow-[inset_4px_0_0_0_rgba(2,255,11,0.8)] active:bg-white/20"
            :class="
              user_email === option.email
                ? 'bg-white/5 text-[#02ff0b] font-semibold'
                : ''
            "
            @click="
              user_email = option.email;
              isDropdownOpen = false;
            "
          >
            {{ option.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex gap-3">
      <app-button
        type="submit"
        :disabled="isLoading || !!Object.keys(errors).length"
        variant-button="accent"
      >
        Сохранить
      </app-button>
      <app-button
        type="button"
        variant-button="solid"
        @click="emit('cancel')"
      >
        Отмена
      </app-button>
    </div>
  </form>
</template>
