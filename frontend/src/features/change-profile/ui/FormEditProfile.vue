<script setup lang="ts">
import { push } from 'notivue';
import { useForm } from 'vee-validate';
import { AppButton, AppInput, useModal } from '@/shared';
import { useUpdateProfile } from '@/entities';
import { profileSchema } from '../lib/validation';

interface IProps {
    userName: string;
    userEmail: string;
}

const props = defineProps<IProps>();

const { closeModal } = useModal();

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: profileSchema,
    initialValues: {
        name: props.userName,
        email: props.userEmail,
    },
});

const { mutateAsync: updateProfile, isLoading } = useUpdateProfile();

const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
    try {
        await updateProfile({ name: values.name, email: values.email });
        push.success('Профиль обновлён');
        closeModal();
    } catch {
        // Ошибка уже показана глобальным перехватчиком api
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
      type="text"
      placeholder="Имя"
      :error="errors.name"
      v-bind="nameAttrs"
    />
    <app-input
      v-model="email"
      type="email"
      placeholder="Email"
      :error="errors.email"
      v-bind="emailAttrs"
    />
    <app-button
      type="submit"
      :disabled="isLoading || !!Object.keys(errors).length"
    >
      Сохранить
    </app-button>
  </form>
</template>
