<script setup lang="ts">
import { AppButton, AppInput, useModal } from '@/shared';
import { useForm } from 'vee-validate';
import { useQueryCache } from '@pinia/colada';
import { taskCreateSchema } from '@/features';
import { useCreateTask, PROJECT_QUERY_KEYS, type Task } from '@/entities';
import { ref } from 'vue';

interface IProps {
    sprintId: number;
    userOptions: Array<{ name: string; email: string }>;
    projectId?: number;
}
const props = defineProps<IProps>();

const emit = defineEmits<{
    created: [task: Task];
}>();

const isDropdownOpen = ref<boolean>(false);

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: taskCreateSchema,
});

const { mutateAsync, isLoading } = useCreateTask();
const queryCache = useQueryCache();
const { closeModal } = useModal();

const [name, nameAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [started_at] = defineField('started_at');
const [deadline_at] = defineField('deadline_at');
const [user_email] = defineField('user_email');

const onSubmit = handleSubmit(async (values) => {
    const created = await mutateAsync({ ...values, sprintId: props.sprintId });
    emit('created', created?.task);
    if (props.projectId) {
        closeModal();
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
        <div class="relative w-full">
          <button
            type="button"
            class="flex p-4 outline-none font-montserrat justify-between items-center w-full gap-4 text-white bg-dark-gray rounded-2xl border-2 border-input-outline transition duration-300 hover:bg-white/5 hover:shadow-[0_0_12px_1px_rgba(2,255,11,0.3)] active:bg-white/10 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 focus:shadow-[0_0_20px_1px_rgba(2,255,11,0.3)]"
            @click="isDropdownOpen = !isDropdownOpen"
          >
            <span
              :class="
                user_email ? 'text-white' : 'text-input-placeholder font-montserrat'
              "
            >
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

          <input
            type="hidden"
            name="user_email"
            :value="user_email"
          >
        </div>
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
          variant-button="accent"
        >
          Создать задачу
        </app-button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
