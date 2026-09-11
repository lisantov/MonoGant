<script setup lang="ts">
import { buttonVariants } from '@/shared';

interface Props {
    variantButton?: 'accent' | 'danger' | 'solid';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
    type: 'button',
    disabled: false,
    variantButton: 'solid',
    size: 'lg',
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonVariants({ type: variantButton, size })"
  >
    <slot />
  </button>
</template>
