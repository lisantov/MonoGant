<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProjects, useParseProject, useProfile } from '@/entities';
import { GanttChart, type IGanttSprint, type IGanttTask } from '@/widgets';

const route = useRoute();

const { data: projects, isLoading: projectsLoading } = useProjects();
const { data: profile } = useProfile();

const projectIdFromParam = computed<number | undefined>(() => {
    const raw = route.params.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const id = Number(value);
    return Number.isFinite(id) && id > 0 ? id : undefined;
});

const activeProjectId = computed<number | undefined>(
    () => projectIdFromParam.value ?? projects.value?.data?.[0]?.id
);

const isOwner = computed<boolean>(
    () =>
        !!profile.value?.user.email &&
        profile.value.user.email === parsed.value?.project.owner?.email
);

const { data: parsed } = useParseProject(activeProjectId);

const sprints = computed<IGanttSprint[]>(() =>
    (parsed.value?.project.sprints ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? '',
        status: s.status,
        completion_percentage: s.completion_percentage,
        tasks: s.tasks.map((t): IGanttTask => ({
            id: t.id,
            name: t.name,
            description: t.description ?? '',
            started_at: t.started_at,
            deadline_at: t.deadline_at,
            status: t.status,
            next_task_id: t.next_task_id,
        })),
    }))
);
</script>

<template>
  <div>
    <p
      v-if="projectsLoading"
      class="text-sm text-gray-500 p-4"
    >
      Загрузка...
    </p>
    <p
      v-else-if="!activeProjectId"
      class="text-sm text-gray-500 p-4"
    >
      Нет проектов — создайте проект, чтобы работать с диаграммой Ганта
    </p>
    <GanttChart
      v-else
      :sprints="sprints"
      :project-id="activeProjectId"
      :members="parsed?.project?.members ?? []"
      :is-owner="isOwner"
    />
  </div>
</template>
