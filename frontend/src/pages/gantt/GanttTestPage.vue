<script setup lang="ts">
import { DEFAULT_TASKS, GanttChart } from '@/widgets';
import { ref } from 'vue';
const tasks = ref(DEFAULT_TASKS);
</script>

<template>
  <GanttChart :tasks />
</template>
