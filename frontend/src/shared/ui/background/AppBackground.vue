<script setup lang="ts"></script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-gray-950">
    <div class="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />

    <div
      class="absolute opacity-80 w-[20%] h-[30%] left-89 -top-35 rounded-full gradient blur-[320px]"
    />
    <div
      class="absolute opacity-80 w-[50%] h-[75%] left-45 top-150 rounded-full gradient blur-[140px]"
    />
    <div
      class="absolute opacity-80 w-[40%] h-[70%] -right-50 -top-40 rounded-full gradient blur-[300px]"
    />
  </div>
</template>

<style scoped>
.gradient {
    background: linear-gradient(180deg, #00ffe1 0%, rgba(37, 239, 37, 100) 100%);
}
</style>
