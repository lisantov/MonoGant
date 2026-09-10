<script setup lang="ts">
import { buttonVariants } from '@/shared';

interface Props {
    variantButton?: 'accent' | 'danger' | 'solid';
    type?: 'button' | 'submit' | 'reset';
    accessibilityLabel?: string;
    disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
    type: 'button',
    disabled: false,
    variant: 'primary',
    size: 'md',
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonVariants({ type: variantButton })"
  >
    <slot />
  </button>
</template>
