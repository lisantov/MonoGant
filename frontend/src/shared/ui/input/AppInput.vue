<script setup lang="ts">
import { AppIcon, inputVariants } from '@/shared';
import { computed, ref } from 'vue';

interface Props {
    error?: string | boolean;
    disabled?: boolean;
    type?: string;
    placeholder?: string;
    required?: boolean;
    size?: 'sm' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    disabled: false,
    error: undefined,
    placeholder: '',
    required: false,
    size: 'lg',
});

const check = ref<boolean>(false);
const model = defineModel<string>({ default: '' });

const checkPassword = () => {
    check.value = !check.value;
};

const checkType = computed<string>(() => {
    if (check.value && props.type === 'password') return 'text';
    if (!check.value && props.type === 'password') return 'password';
    return props.type;
});
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
      :class="inputVariants({ error: !!error, disabled, size })"
    >
      <input
        v-model="model"
        :type="checkType"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full outline-none"
        :required="required"
      >
      <span class="flex justify-center w-6 h-6">
        <template v-if="type === 'password'">
          <template v-if="check === true">
            <app-icon
              name="password-open"
              class="cursor-pointer text-primary-dark hover:opacity-70 transition-opacity duration-300 w-6 h-6"
              @click="checkPassword"
            />
          </template>
          <template v-else>
            <app-icon
              name="password-lock"
              class="cursor-pointer text-primary-dark hover:opacity-70 transition-opacity duration-300"
              @click="checkPassword"
            />
          </template>
        </template>
      </span>
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
