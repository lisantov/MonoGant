<script lang="ts" setup>
import { useForm } from 'vee-validate';
import { commentarySchema, type TaskCommentaryFormValues } from '../validation';
import { AppButton, AppIcon, AppTextarea } from '@/shared';

const { defineField, handleSubmit, errors } = useForm<TaskCommentaryFormValues>({
    validationSchema: commentarySchema,
});

const onSubmit = handleSubmit(() => {
    console.log('Ура');
});

const [commentary, commentaryAttrs] = defineField('commentary');
</script>

<template>
  <form
    class="flex items-center gap-4"
    @submit.prevent="onSubmit"
  >
    <app-textarea
      v-model="commentary"
      placeholder="Напишите комментарий..."
      :error="errors.commentary"
      v-bind="commentaryAttrs"
      class="w-full text-[24px]"
    />
    <app-button
      type="submit"
      variant-button="accent"
      :disabled="!!Object.keys(errors).length"
      size="sm"
    >
      <app-icon name="send" />
    </app-button>
  </form>
</template>
