<script setup lang="ts">
import { AppBackground } from '@/shared';
</script>

<template>
  <div class="flex min-h-screen flex-col relative">
    <div class="fixed w-full h-full -z-1">
      <AppBackground />
    </div>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
