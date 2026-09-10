<script setup lang="ts">
import { vMaska } from 'maska/vue';
import { inputVariants, type InputVariants } from '@/shared';

interface Props {
    size?: InputVariants['size'];
    error?: string | boolean;
    disabled?: boolean;
    modelValue?: string;
    type?: 'text' | 'email' | 'password' | 'tel' | 'number';
    placeholder?: string;
    mask?: string;
}

withDefaults(defineProps<Props>(), {
    type: 'text',
    modelValue: '',
    disabled: false,
    size: 'md',
    error: false,
});

const model = defineModel<string>();

defineEmits<{
    'update:modelValue': [value: string];
}>();
</script>

<template>
  <div>
    <p v-if="error">
      {{ error ?? 'нет' }}
    </p>
    <label>
      <input
        v-model="model"
        v-maska
        :data-maska="mask"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputVariants({ size, error, disabled })"
      >
    </label>
  </div>
</template>
