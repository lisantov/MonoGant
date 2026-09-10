<script setup lang="ts"></script>

<template>
  <div
    class="widget flex w-full justify-center items-end rounded-[40px] bg-white relative pb-[10%] overflow-hidden"
  >
    <div class="flex flex-col justify-end items-center absolute gap-[4px]">
      <p class="text-[32px] text-white">
        Оптимизируй работу своей команды
      </p>
      <p class="text-[18px] text-white opacity-70">
        Создай свою команду и следи за достижениями
      </p>
    </div>
  </div>
</template>

<style scoped>
.widget::before {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    opacity: 80%;
    bottom: 0;
    background-image: linear-gradient(0, var(--dark-gray) 21%, transparent 81%);
}
</style>
