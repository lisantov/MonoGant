<script setup lang="ts">
import { useForm } from 'vee-validate';
import { registerSchema } from '@/features';
import { AppButton, AppInput, AppLink } from '@/shared';
import { useRegister } from '@/entities';

const { defineField, handleSubmit, errors } = useForm({
    validationSchema: registerSchema,
});

const { mutateAsync } = useRegister();

const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword');

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
      Создание аккаунта
    </h2>
    <div class="flex w-full flex-col justify-center gap-5">
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
        type="password"
        placeholder="Пароль"
        :error="errors.password"
        v-bind="passwordAttrs"
      />
      <app-input
        v-model="confirmPassword"
        type="password"
        placeholder="Повторите пароль"
        :error="errors.confirmPassword"
        v-bind="confirmPasswordAttrs"
      />
    </div>
    <div class="flex flex-col w-full justify-center gap-[15px]">
      <app-button type="submit">
        Создать аккаунт
      </app-button>
      <p class="text-white font-montserrat font-normal text-[18px] text-center">
        У вас есть аккаунт?
        <AppLink to="login">
          Войти
        </AppLink>
      </p>
    </div>
  </form>
</template>
