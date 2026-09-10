<script setup lang="ts">
interface Props {
    to: string;
}

defineProps<Props>();
</script>

<template>
  <router-link
    :to="{ name: to }"
    class="font-montserrat text-lg text-accent-light drop-shadow-[0_0_6px_rgba(0,185,6,0.75)] hover:opacity-80"
  >
    <slot />
  </router-link>
</template>

<style scoped lang="scss"></style>
