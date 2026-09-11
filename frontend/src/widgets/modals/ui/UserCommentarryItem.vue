<script setup lang="ts">
import { AppIcon } from '@/shared';

// TODO: Добавить props с комментарием
</script>

<template>
  <div class="w-full rounded-2xl bg-gray border border-white/20 p-5 flex flex-col gap-2">
    <div class="w-full flex items-center justify-between gap-20">
      <div class="flex items-center gap-2">
        <app-icon name="default" />
        <p class="font-jost font-noraml text-[24px] text-white">
          {{ 'Конь Аллергик' }}
        </p>
        <!-- Заменить на commentary.user.name -->
      </div>
      <p class="font-jost font-noraml text-[16px] text-dark-blue-gray">
        {{ '01.01.2007' }}
      </p>
      <!-- Заменить на commentary.createdAt -->
    </div>
    <p class="font-jost text-[18px] text-white/60">
      {{
        'хмм... прекрасно живу, но даже не в Америке, я такой няшечка милашечка, ну прямткакая мили, обнимаю какашечки и кусаю за ляшечку, и да, женщины это враг нас - псов.'
      }}
    </p>
    <!-- Заменить на commentary.message -->
  </div>
</template>
