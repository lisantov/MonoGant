<script setup lang="ts">
import { DEFAULT_SPRINTS, GanttChart } from '@/widgets';
import { ref } from 'vue';
const sprints = ref(DEFAULT_SPRINTS);
</script>

<template>
  <GanttChart :sprints />
</template>
