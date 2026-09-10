<script setup lang="ts">
import { FormRegister } from '@/features';
import { AppWidget } from '@/widgets';
</script>

<template>
  <div
    class="contentBlock grid grid-cols-2 w-full rounded-[50px] p-[10px] shadow-[0_16px_16px_0_rgba(0,0,0,0.45)] relative"
  >
    <form-register />
    <app-widget />
  </div>
</template>
<style scoped>
.contentBlock {
    height: calc(100vh - 90px);
    border: 2px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image:
        linear-gradient(300deg, var(--gray), 25%, var(--dark-gray)),
        linear-gradient(300deg, var(--gray), var(--dark-gray));
}
</style>
