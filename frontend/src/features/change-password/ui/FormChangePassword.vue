<script setup lang="ts">
import { push } from 'notivue';
import { useForm } from 'vee-validate';
import { AppButton, AppInput, useModal } from '@/shared';
import { useChangePassword } from '@/entities';
import { changePasswordSchema } from '../lib/validation';

const { closeModal } = useModal();

const { defineField, errors, handleSubmit, resetForm } = useForm({
    validationSchema: changePasswordSchema,
});

const { mutateAsync: changePassword, isLoading } = useChangePassword();

const [old_password, oldPasswordAttrs] = defineField('old_password');
const [new_password, newPasswordAttrs] = defineField('new_password');
const [confirm_password, confirmPasswordAttrs] = defineField('confirm_password');

const onSubmit = handleSubmit(async (values) => {
    try {
        await changePassword({
            old_password: values.old_password,
            new_password: values.new_password,
        });
        push.success('Пароль изменён');
        resetForm();
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
      v-model="old_password"
      type="password"
      placeholder="Текущий пароль"
      :error="errors.old_password"
      v-bind="oldPasswordAttrs"
    />
    <app-input
      v-model="new_password"
      type="password"
      placeholder="Новый пароль"
      :error="errors.new_password"
      v-bind="newPasswordAttrs"
    />
    <app-input
      v-model="confirm_password"
      type="password"
      placeholder="Повторите новый пароль"
      :error="errors.confirm_password"
      v-bind="confirmPasswordAttrs"
    />
    <app-button
      type="submit"
      :disabled="isLoading || !!Object.keys(errors).length"
    >
      Сменить пароль
    </app-button>
  </form>
</template>
