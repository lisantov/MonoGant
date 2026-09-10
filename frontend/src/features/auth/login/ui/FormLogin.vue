<script setup lang="ts">
// import {useForm} from "vee-validate";
// import { loginSchema } from "../lib/validation.ts"

// const { defineField, handleSubmit, errors, meta } = useForm({
//   validationSchema: loginSchema,
// })

// const [login, loginAttrs] = defineField("login")
// const [password, passwordAttrs] = defineField("password")

// const onSubmit = handleSubmit((values) => {
//   mutateAsync(values)
// })
</script>

<template>
  <form class="linear-border">
    <h2>Авторизация</h2>
    <div>
      <input>
      <input>
    </div>
    <div>
      <div class="w-full">
        <a
          class="w-fit text-gray-100 text-sm transition duration-300 hover:text-primary-orange"
        >
          Забыли пароль?
        </a>
      </div>
    </div>
    <div>
      <button />
      <p
        class="font-semibold text-primary-orange dark:text-gray-100 transition duration-300 hover:text-primary-orange"
      >
        Зарегистрироваться
      </p>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
