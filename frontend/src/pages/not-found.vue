<template>
  <div class="flex flex-col min-h-[90vh] w-full items-center justify-center gap-10">
    <h1 class="text-[280px] font-jost">
      404
    </h1>
    <div class="flex flex-col gap-4">
      <span class="text-2xl font-jost">Кажется, вы заблудились</span>
      <router-link :to="Routes.home">
        <app-button> На главную </app-button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Routes } from '@/shared';
import { AppButton } from '@/shared/ui';
import { RouterLink } from 'vue-router';
</script>

<style scoped></style>
