<script setup lang="ts">
import { useRouter } from 'vue-router';
import { AppButton, AppInput, AppLink, Routes } from '@/shared';
import { useLogin } from '@/entities';
import { useForm } from 'vee-validate';
import { loginSchema } from '@/features';
import { useLogin } from '@/entities';

const router = useRouter();

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: loginSchema,
});

const { mutateAsync: login, isLoading } = useLogin();

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit((values) => {
    login({ email: values.email, password: values.password }).then(() => {
        router.push(Routes.main.path);
    });
});
</script>

<template>
  <form
    class="linear-border flex flex-col justify-center gap-15 px-30"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-[60px] font-jost font-semibold text-center text-white">
      Вход в аккаунт
    </h2>
    <div class="flex flex-col gap-20 justify-center">
      <div class="flex flex-col gap-5">
        <app-input
          v-model="email"
          placeholder="Email"
          :error="errors.email"
          v-bind="emailAttrs"
        />
        <app-input
          v-model="password"
          placeholder="Пароль"
          :error="errors.password"
          v-bind="passwordAttrs"
        />
      </div>
      <div class="flex flex-col gap-5 items-center">
        <app-button
          type="submit"
          :disabled="!!Object.keys(errors).length || isLoading"
        >
          Войти
        </app-button>
        <p class="text-[18px] font-montserrat text-white">
          Впервые на платформе? <AppLink to="register">
            Зарегистрироваться
          </AppLink>
        </p>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
