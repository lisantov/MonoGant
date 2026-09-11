<script setup lang="ts">
import { AppButton, AppInput, AppLink } from '@/shared';
import { useForm } from 'vee-validate';
import { loginSchema } from '@/features';
import { useLogin } from '@/entities';

const { mutateAsync } = useLogin();

const { defineField, handleSubmit, errors } = useForm({
    validationSchema: loginSchema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit((values) => {
    mutateAsync(values);
});
</script>

<template>
  <form
    class="flex w-full h-full flex-col justify-between items-center py-[120px] px-[90px]"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-[60px] text-white font-jost font-semibold text-center">
      Вход в аккаунт
    </h2>
    <div class="flex w-full flex-col justify-center gap-10">
      <app-input
        v-model="email"
        placeholder="Логин"
        :error="errors.email"
        v-bind="emailAttrs"
        required
      />
      <app-input
        v-model="password"
        placeholder="Пароль"
        :error="errors.password"
        v-bind="passwordAttrs"
        required
      />
    </div>
    <div class="flex flex-col w-full justify-center gap-[15px]">
      <app-button type="submit">
        Войти
      </app-button>
      <p class="text-white font-montserrat font-normal text-[18px] text-center">
        У вас нет аккаунта?
        <AppLink to="register">
          Зарегистрироваться
        </AppLink>
      </p>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
