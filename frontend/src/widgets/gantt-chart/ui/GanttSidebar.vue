<script setup lang="ts">
import { inject, ref, reactive } from 'vue';
import { SPRINTS_KEY, GANTT_TASK_TEXT } from '../lib';

const sprintsStore = inject(SPRINTS_KEY)!;

const newSprintName = ref('');
const collapsed = reactive(new Set<number>());

const toggle = (id: number) => (collapsed.has(id) ? collapsed.delete(id) : collapsed.add(id));

const createSprint = () => {
    const name = newSprintName.value.trim();
    if (!name) return;
    sprintsStore.addSprint(name);
    newSprintName.value = '';
};
</script>

<template>
  <aside class="w-72 shrink-0 border-r border-gray-300 bg-white flex flex-col">
    <!-- создание спринта -->
    <div class="p-3 border-b border-gray-200 flex flex-col gap-2">
      <input
        v-model="newSprintName"
        type="text"
        placeholder="Имя спринта"
        class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        @keydown.enter="createSprint"
      >
      <button
        class="rounded bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 disabled:opacity-50"
        :disabled="!newSprintName.trim()"
        @click="createSprint"
      >
        + Добавить спринт
      </button>
    </div>

    <!-- список спринтов -->
    <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
      <div
        v-for="sprint in sprintsStore.sprints.value"
        :key="sprint.id"
        class="border border-gray-200 rounded"
      >
        <div
          class="flex items-center justify-between px-2 py-1 bg-gray-50 border-b border-gray-200"
        >
          <button
            class="flex items-center gap-1 text-sm font-medium text-gray-700 truncate hover:text-blue-600"
            @click="toggle(sprint.id)"
          >
            <svg
              class="w-3 h-3 transition-transform"
              :class="{ '-rotate-90': collapsed.has(sprint.id) }"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path d="M2 4l4 4 4-4z" />
            </svg>
            <span class="truncate">{{ sprint.name }}</span>
            <span class="text-[10px] text-gray-400">({{ sprint.tasks.length }})</span>
          </button>

          <button
            class="w-6 h-6 rounded hover:bg-blue-100 text-blue-600 text-lg leading-none flex items-center justify-center shrink-0"
            title="Добавить задачу"
            @click="sprintsStore.addTask(sprint.id)"
          >
            +
          </button>
        </div>

        <ul
          v-show="!collapsed.has(sprint.id)"
          class="divide-y divide-gray-100"
        >
          <li
            v-for="task in sprint.tasks"
            :key="task.id"
            class="px-2 py-1 text-xs flex flex-col gap-0.5"
          >
            <span class="truncate text-gray-800">{{ task.name }}</span>
            <span class="text-[10px] text-gray-500">
              {{ GANTT_TASK_TEXT.get(task.status) }}
              · {{ task.started_at }} → {{ task.deadline_at }}
            </span>
          </li>
        </ul>

        <p
          v-if="!sprint.tasks.length && !collapsed.has(sprint.id)"
          class="px-2 py-1 text-xs text-gray-400 italic"
        >
          Нет задач
        </p>
      </div>

      <p
        v-if="!sprintsStore.sprints.value.length"
        class="text-xs text-gray-400 italic"
      >
        Нет спринтов. Добавьте первый.
      </p>
    </div>
  </aside>
</template>
