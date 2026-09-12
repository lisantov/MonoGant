<script setup lang="ts">
import { computed, ref } from 'vue';
import { push } from 'notivue';
import { AppButton, AppModal, GANTT_TASK_STATUS } from '@/shared';
import { useTask, useComments, useCreateComment, useDeleteTask, type Comment } from '@/entities';
import { FormEditTask } from '@/features';
import { useTaskDetail } from '../lib/use-task-detail';

interface IProps {
    projectId?: number;
    members?: Array<{ name: string; email: string }>;
    isOwner?: boolean;
}
withDefaults(defineProps<IProps>(), {
    projectId: undefined,
    members: () => [],
    isOwner: false,
});

const { selection, closeTaskDetail } = useTaskDetail();

const taskId = computed<number | null>(() => selection.value?.taskId ?? null);
const sprintName = computed<string>(() => selection.value?.sprintName ?? 'Спринт');

const close = () => {
    editing.value = false;
    confirmingDelete.value = false;
    commentText.value = '';
    closeTaskDetail();
};

const { data: task } = useTask(taskId);
const { data: comments } = useComments(taskId);

const editing = ref<boolean>(false);
const confirmingDelete = ref<boolean>(false);
const commentText = ref<string>('');

const { mutateAsync: createComment, isLoading: isCreatingComment } = useCreateComment();
const { mutateAsync: deleteTask, isLoading: isDeleting } = useDeleteTask();

const statusLabels: Record<GANTT_TASK_STATUS, string> = {
    [GANTT_TASK_STATUS.PLANNED]: 'Запланирована',
    [GANTT_TASK_STATUS.IN_PROGRESS]: 'В работе',
    [GANTT_TASK_STATUS.DONE]: 'Завершена',
    [GANTT_TASK_STATUS.CANCELLED]: 'Отменена',
};

const onSendComment = async () => {
    if (!taskId.value || !commentText.value.trim()) return;
    await createComment({ taskId: taskId.value, body: { body: commentText.value.trim() } });
    commentText.value = '';
};

const onDeleteConfirm = async () => {
    if (!taskId.value) return;
    await deleteTask(taskId.value);
    push.success('Задача удалена');
    close();
};

const sortedComments = computed<Comment[]>(() => comments.value?.data ?? []);
</script>

<template>
  <app-modal name="taskDetail">
    <div
      v-if="task"
      class="flex flex-col gap-4 bg-gray p-8 rounded-[20px] w-[560px] max-h-[80vh] overflow-y-auto text-white"
    >
      <div class="flex items-center justify-between gap-4">
        <h3 class="text-2xl font-montserrat font-semibold truncate">
          {{ task.name }}
        </h3>
        <span
          class="shrink-0 rounded-full px-3 py-1 text-sm font-jost border"
          :class="
            task.status === GANTT_TASK_STATUS.DONE
              ? 'bg-accent-dark/30 text-accent-base border-accent-base'
              : task.status === GANTT_TASK_STATUS.CANCELLED
                ? 'bg-pink/20 text-pink border-pink'
                : 'bg-white/10 text-input-placeholder border-white/20'
          "
        >
          {{ statusLabels[task.status] }}
        </span>
      </div>

      <div class="flex flex-wrap gap-x-6 gap-y-1 text-sm font-jost text-input-placeholder">
        <span>Спринт: {{ sprintName }}</span>
        <span>{{ task.started_at }} → {{ task.deadline_at }}</span>
        <span v-if="task.user?.email">
          Исполнитель: {{ task.user.name }} ({{ task.user.email }})
        </span>
        <span v-else> Исполнитель: не назначен </span>
      </div>

      <div
        v-if="task.description"
        class="text-sm font-montserrat text-white/90 whitespace-pre-wrap break-words bg-dark-gray rounded-2xl border border-white/10 p-4"
      >
        {{ task.description }}
      </div>

      <template v-if="isOwner && !editing">
        <div class="flex gap-3">
          <app-button
            variant-button="solid"
            @click="editing = true"
          >
            Редактировать
          </app-button>
          <app-button
            v-if="!confirmingDelete"
            variant-button="danger"
            @click="confirmingDelete = true"
          >
            Удалить
          </app-button>
          <template v-else>
            <app-button
              variant-button="solid"
              :disabled="isDeleting"
              @click="confirmingDelete = false"
            >
              Отмена
            </app-button>
            <app-button
              variant-button="danger"
              :disabled="isDeleting"
              @click="onDeleteConfirm"
            >
              Точно удалить
            </app-button>
          </template>
        </div>
      </template>

      <form-edit-task
        v-if="editing"
        :key="task.id"
        :task="task.data"
        :user-options="members ?? []"
        :project-id="projectId"
        @updated="
          editing = false;
          push.success('Задача обновлена');
        "
        @cancel="editing = false"
      />

      <div class="flex flex-col gap-3 border-t border-white/10 pt-4">
        <h4 class="text-lg font-montserrat font-semibold">
          Комментарии ({{ sortedComments.length }})
        </h4>

        <ul
          v-if="sortedComments.length"
          class="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1"
        >
          <li
            v-for="comment in sortedComments"
            :key="comment.id"
            class="flex flex-col gap-1 bg-dark-gray rounded-2xl border border-white/10 px-4 py-3"
          >
            <p class="text-sm font-montserrat text-white/90 break-words">
              {{ comment.body }}
            </p>
            <span class="text-xs text-input-placeholder">
              {{ new Date(comment.created_at).toLocaleString('ru-RU') }}
            </span>
          </li>
        </ul>
        <p
          v-else
          class="text-sm text-input-placeholder italic"
        >
          Комментариев пока нет
        </p>

        <form
          class="flex flex-col gap-2"
          @submit.prevent="onSendComment"
        >
          <textarea
            v-model="commentText"
            rows="3"
            placeholder="Написать комментарий..."
            class="resize-none bg-dark-gray text-white font-montserrat px-4 py-3 rounded-2xl border-2 border-input-outline outline-none transition duration-300 focus:border-accent-base placeholder:text-input-placeholder"
          />
          <div class="flex justify-end">
            <app-button
              type="submit"
              variant-button="accent"
              :disabled="isCreatingComment || !commentText.trim()"
            >
              Отправить
            </app-button>
          </div>
        </form>
      </div>

      <button
        class="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 transition duration-200 text-white flex items-center justify-center cursor-pointer z-10"
        :title="'Закрыть'"
        @click="close"
      >
        ✕
      </button>
    </div>
  </app-modal>
</template>
