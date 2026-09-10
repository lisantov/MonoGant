<script setup lang="ts">
// import { registerSchema } from '@/features';
// import {useForm} from "vee-validate";

// const { defineField, handleSubmit, errors, meta } = useForm({
//   validationSchema: registerSchema,
// })

// const { mutateAsync, isLoading } = useRegister()

// const [username, usernameAttrs] = defineField("username")
// const [email, emailAttrs] = defineField("email")
// const [password, passwordAttrs] = defineField("password")
// const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword")

// const onSubmit = handleSubmit((values) => {
//   mutateAsync(values)
// })
</script>

<template>
  <div>
    <form>
      <label for="name">
        <input>
      </label>
      <label for="email">
        <input>
      </label>
      <label for="password">
        <input>
      </label>
      <label for="confirmPassword">
        <input>
      </label>
    </form>
  </div>
</template>

<style scoped lang="scss"></style>
