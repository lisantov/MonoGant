<script setup lang="ts">
import { useForm } from 'vee-validate';
import { registerSchema } from '@/features';

const { defineField, errors } = useForm({
    validationSchema: registerSchema,
});

// const { mutateAsync, isLoading } = useRegister()

const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

// const onSubmit = handleSubmit((values) => {
//   mutateAsync(values)
// })
import { AppButton, AppInput } from '@/shared';
</script>

<template>
  <form class="flex flex-col justify-center">
    <h2 class="text-[60px] text-white font-jost font-semibold text-center">
      Создание аккаунта
    </h2>
    <div class="flex flex-col items-center justify-center gap-5">
      <app-input
        v-model="name"
        placeholder="Имя"
        :error="errors.name"
        v-bind="nameAttrs"
      />
      <app-input
        v-model="email"
        placeholder="Почта"
        :error="errors.email"
        v-bind="emailAttrs"
      />
      <app-input
        v-model="password"
        placeholder="Пароль"
        :error="errors.password"
        v-bind="passwordAttrs"
      />
      <app-input
        v-model="confirmPassword"
        placeholder="Повторите пароль"
        :error="errors.confirmPassword"
        v-bind="confirmPasswordAttrs"
      />
    </div>
    <div>
      <app-button> Регистрация </app-button>
    </div>
  </form>
</template>

<style scoped lang="scss"></style>
