<template>
  <AppModal name="mini">
    <div class="flex flex-col gap-16 bg-[#fff] dark:bg-black-700 px-20 py-16 rounded-[48px]">
      <p class="max-w-[320px] text-center text-sm font-medium font-second">
        Вы действительно хотите выйти из аккаунта?
      </p>
      <div class="flex gap-6 justify-center">
        <app-button
          variant="primaryOrange"
          font-weight="Medium"
          padding="none"
          class="px-11 py-4 w-30 h-[49px]"
          size="sm"
          @click="closeModal"
        >
          Нет
        </app-button>
        <app-button
          variant="primaryBlack"
          font-weight="Medium"
          padding="none"
          class="px-11 py-4 w-30 h-[49px]"
          size="sm"
          @click="onConfirm"
        >
          Да
        </app-button>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from './AppModal.vue';
import { AppButton, useModal } from '@/shared';

interface Props {
    title?: string;
}

withDefaults(defineProps<Props>(), {
    title: '',
});

const emit = defineEmits<{
    confirm: [];
}>();

const { closeModal } = useModal();

const onConfirm = () => {
    emit('confirm');
    closeModal();
};
</script>
