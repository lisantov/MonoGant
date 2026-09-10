<script setup lang="ts">
import { AppButton, AppInput } from '@/shared';
import { useForm } from 'vee-validate';
import { loginSchema } from '@/features';

const { defineField, errors } = useForm({
    validationSchema: loginSchema,
});

const [login, loginAttrs] = defineField('login');
const [password, passwordAttrs] = defineField('password');

// const onSubmit = handleSubmit((values) => {
//   mutateAsync(values)
// })
</script>

<template>
  <form class="linear-border flex flex-col gap-15">
    <h2 class="text-[32px] text-center">
      Логин
    </h2>
    <div class="flex flex-col gap-20 justify-center">
      <div class="flex flex-col gap-5">
        <app-input
          v-model="login"
          placeholder="Логин"
          :error="errors.login"
          v-bind="loginAttrs"
        />
        <app-input
          v-model="password"
          placeholder="Пароль"
          :error="errors.password"
          v-bind="passwordAttrs"
        />
      </div>
      <div class="flex flex-col gap-5">
        <app-button>Войти</app-button>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
