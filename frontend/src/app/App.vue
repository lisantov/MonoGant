<script setup lang="ts">
import { RouterView } from 'vue-router';
import { DefaultLayout } from './layouts';

import { Notivue, NotivueSwipe, Notification } from 'notivue';
</script>

<template>
  <Notivue v-slot="item">
    <NotivueSwipe :item="item">
      <Notification :item="item" />
    </NotivueSwipe>
  </Notivue>

  <default-layout>
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view />
    </transition>
  </default-layout>
  <div id="modals" />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5%);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
