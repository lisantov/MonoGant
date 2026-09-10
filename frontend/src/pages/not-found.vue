<template>
  <div class="flex w-full items-center gap-12">
    <h1 class="text-[180px] font-medium">
      404
    </h1>
    <div class="flex flex-col gap-4">
      <span class="text-2xl">Кажется, вы заблудились</span>
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
