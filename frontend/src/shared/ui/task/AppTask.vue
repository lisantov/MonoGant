<script setup lang="ts">
import { AppIcon } from '@/shared';
</script>

<template>
  <article class="w-full flex flex-col p-[12px] py-[16px] bg-dark-gray gap-[16px] rounded-[15px]">
    <div class="flex justify-between">
      <div class="flex gap-[20px] items-center">
        <div
          class="flex items-center justify-between px-[12px] py-[7px] border-[1px] rounded-[10px] text-accent-dark border-accent-dark text-[22px]"
        >
          Задача 1
        </div>
        <p class="text-white text-[28px]">
          Анализ воронки конверсии
        </p>
      </div>
      <div class="flex gap-[12px]">
        <div class="p-[10px] bg-gray border-[1px] rounded-[12px] border-light-gray">
          <app-icon name="edit" />
        </div>
        <div
          class="p-[10px] px-[12px] bg-gray border-[1px] rounded-[12px] border-light-gray"
        >
          <app-icon name="trashcan" />
        </div>
      </div>
    </div>
    <p class="text-[24px] font-jost text-white opacity-80">
      Сделать воронку, туда-сюда, воу-воу-воу, это просто нечто, браток, а это будет делать
      прям няняня, кто америка прям обииииделпмб ывплоып
    </p>
    <div class="flex justify-between items-center">
      <div class="flex gap-[5px] items-center">
        <app-icon name="user" />
        <p class="text-white text-[24px] font-jost">
          Олег Нифонтов
        </p>
      </div>
      <div class="flex gap-[14px] items-center pt-[12px]">
        <p class="text-white text-[24px] font-jost">
          01.01.2027
        </p>
        <app-icon name="arrow-date" />
        <div class="flex gap-[5px] items-center">
          <app-icon name="flag" />
          <p class="text-white text-[24px] font-jost">
            01.01.2027
          </p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss"></style>
