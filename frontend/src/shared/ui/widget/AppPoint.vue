<script setup lang="ts">
interface Props {
    isActive: boolean;
    progress: number;
}

defineProps<Props>();
</script>

<template>
  <svg
    width="40"
    height="40"
    xmlns="http://www.w3.org/2000/svg"
    class="relative flex items-center justify-center"
    :style="{ transform: 'rotate(-90deg)' }"
  >
    <circle
      cx="20"
      cy="20"
      r="7"
      :style="{
        fill: isActive ? 'var(--accent-base)' : 'var(--white)',
        opacity: isActive ? 1 : 0.5,
      }"
    />

    <circle
      v-if="isActive"
      cx="20"
      cy="20"
      r="11"
      stroke="black"
      stroke-width="8"
      fill="none"
      class="absolute stroke-accent-base opacity-80 transition duration-300"
      :style="{
        strokeDasharray: `${progress}, ${2 * 3.14 * 11}`,
        strokeDashoffset: 0,
      }"
    />
  </svg>
</template>
