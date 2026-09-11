<template>
  <teleport to="#modals">
    <transition name="fade">
      <div
        v-if="currentModal === name"
        class="app-modal fixed flex justify-center items-center top-0 left-0 right-0 bottom-0 z-99999"
      >
        <div
          ref="modalEl"
          class="h-fit"
        >
          <slot />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useModal } from '@/shared';

const { name } = defineProps<{ name: string }>();
const { openModal, currentModal } = useModal();

const modalEl = ref<HTMLElement | null>(null);

onClickOutside(modalEl, () => {
    if (currentModal.value) openModal(null);
});
</script>

<style scoped lang="scss">
.app-modal {
    background: rgba(0, 0, 0, 0.2);
}
</style>
