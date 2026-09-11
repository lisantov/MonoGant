<script setup lang="ts">
import { textAreaVariants } from '@/shared';

interface Props {
    error?: string | boolean;
    placeholder?: string;
    required?: boolean;
}

withDefaults(defineProps<Props>(), {
    error: undefined,
    placeholder: '',
    required: false,
});

const model = defineModel<string>({ default: '' });
</script>

<template>
  <div class="flex flex-col transition-all duration-500">
    <transition
      name="errorShow"
      class="text-error pl-5 text-xs transition duration-500 pb-2"
    >
      <p v-if="error">
        {{ error }}
      </p>
    </transition>
    <label
      class="label justify-center items-center"
      :class="textAreaVariants({ error: !!error })"
    >
      <textarea
        v-model="model"
        :placeholder="placeholder"
        class="w-full outline-none"
        cols="3"
        :required="required"
      />
    </label>
  </div>
</template>

<style lang="scss" scoped>
.errorShow-enter-active {
    max-height: 15px;
    transition: 0.2s ease-in-out;
    transform: translateY(20px);
}
.errorShow-enter-from {
    max-height: 0;
    padding-bottom: 0;
    opacity: 0;
    transform: translateY(10px);
}
.errorShow-leave-active {
    max-height: 15px;
    padding-bottom: 8px;
    transition: 0.5s ease-in-out;
}
.errorShow-leave-to {
    max-height: 0;
    padding-bottom: 0;
    opacity: 0;
    transform: translateY(10px);
    transition: 0.3s;
}
.label {
    &:has(input:focus) {
        background-color: var(--background-input-focus);
    }
}
</style>
