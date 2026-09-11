<script setup lang="ts">
import { useRouter } from 'vue-router';
import { AppButton, AppInput, AppLink, Routes } from '@/shared';
import { useRegister } from '@/entities';
import { useForm } from 'vee-validate';
import { registerSchema } from '@/features';

const router = useRouter();

const { defineField, errors, handleSubmit } = useForm({
    validationSchema: registerSchema,
});

const { mutateAsync: register, isLoading } = useRegister();

const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

const onSubmit = handleSubmit((values) => {
    register({
        name: values.name,
        email: values.email,
        password: values.password,
    }).then(() => {
        router.push(Routes.main.path);
    });
});
</script>

<template>
  <form
    class="flex flex-col justify-center gap-6 px-20"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-[60px] text-white font-jost font-semibold text-center">
      Создание аккаунта
    </h2>
    <div class="w-full flex flex-col items-center justify-center gap-5">
      <app-input
        v-model="name"
        placeholder="Имя"
        :error="errors.name"
        v-bind="nameAttrs"
        class="w-full"
      />
      <app-input
        v-model="email"
        placeholder="Почта"
        :error="errors.email"
        v-bind="emailAttrs"
        class="w-full"
      />
      <app-input
        v-model="password"
        type="password"
        placeholder="Пароль"
        :error="errors.password"
        v-bind="passwordAttrs"
        class="w-full"
      />
      <app-input
        v-model="confirmPassword"
        type="password"
        placeholder="Повторите пароль"
        :error="errors.confirmPassword"
        v-bind="confirmPasswordAttrs"
        class="w-full"
      />
    </div>
    <app-button
      type="submit"
      :disabled="!!Object.keys(errors).length || isLoading"
    >
      Регистрация
    </app-button>
    <p class="text-[18px] font-montserrat text-white text-center">
      Впервые на платформе?
      <AppLink to="register">
        Зарегистрироваться
      </AppLink>
    </p>
  </form>
</template>
