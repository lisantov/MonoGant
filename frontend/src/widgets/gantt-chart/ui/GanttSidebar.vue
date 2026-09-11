<script setup lang="ts">
import { inject, ref, reactive } from 'vue';
import { SPRINTS_KEY, GANTT_TASK_TEXT, TIMESCALE_KEY } from '../lib';
import { AppButton, AppInput } from '@/shared';

const sprintsStore = inject(SPRINTS_KEY)!;
const timescale = inject(TIMESCALE_KEY)!;

const tasks = sprintsStore.allTasks.value.map((x) => x.task);
const { minStart, maxEnd } = timescale.getBounds(tasks);

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
  <aside class="w-72 p-5 shrink-0 border-r border-white/10 bg-dark-gray flex flex-col gap-16">
    <div class="flex flex-col">
      <h2 class="text-white font-bold font-montserrat text-[28px]">
        Задачи команды
      </h2>
      <p class="text-sm text-dark-blue-gray font-jost font-regular">
        {{ minStart?.toLocaleDateString('ru') }} - {{ maxEnd?.toLocaleDateString('ru') }}
      </p>
    </div>

    <div class="flex flex-1 flex-col gap-6 overflow-y-auto">
      <div class="flex gap-2">
        <app-input
          v-model="newSprintName"
          type="text"
          placeholder="Имя спринта"
          size="sm"
          @keydown.enter="createSprint"
        />
        <app-button
          :disabled="!newSprintName.trim()"
          size="sm"
          @click="createSprint"
        >
          +
        </app-button>
      </div>

      <div class="flex flex-1 flex-col gap-3">
        <div
          v-for="sprint in sprintsStore.sprints.value"
          :key="sprint.id"
          class=""
        >
          <div
            class="flex items-center justify-between px-2 py-1 relative before:absolute before:h-full before:w-0.5 before:left-0 before:bg-accent-base before:rounded-md"
          >
            <button
              class="flex items-center gap-1 text-md font-montserrat font-semibold text-white truncate hover:text-accent-lighter transition duration-150"
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
              <span class="text-[10px] pb-3 text-gray-400">({{ sprint.tasks.length }})</span>
            </button>

            <button
              class="w-6 h-6 pb-[1px] rounded hover:text-white/90 hover:bg-white/20 transition duration-200 cursor-pointer text-white/60 text-lg leading-none flex items-center justify-center shrink-0"
              title="Добавить задачу"
              @click="sprintsStore.addTask(sprint.id)"
            >
              +
            </button>
          </div>

          <ul
            v-show="!collapsed.has(sprint.id)"
            class="flex-1 overflow-y-auto divide-y divide-gray-100"
          >
            <li
              v-for="task in sprint.tasks"
              :key="task.id"
              class="px-2 py-1 text-md flex flex-col gap-0.5 font-jost"
            >
              <span class="truncate text-white">{{ task.name }}</span>
              <span class="text-[12px] text-dark-blue-gray">
                {{ GANTT_TASK_TEXT.get(task.status) }}
                · {{ task.started_at }} → {{ task.deadline_at }}
              </span>
            </li>
          </ul>

          <p
            v-if="!sprint.tasks.length && !collapsed.has(sprint.id)"
            class="px-2 py-1 text-md font-jost text-dark-blue-gray italic"
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
    </div>
  </aside>
</template>
