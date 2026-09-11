import { ref } from 'vue';
import { useModal } from '@/shared';

export interface TaskDetailSelection {
    taskId: number;
    sprintName: string;
}

const selection = ref<TaskDetailSelection | null>(null);

export const useTaskDetail = () => {
    const { openModal, closeModal } = useModal();

    const openTaskDetail = (payload: TaskDetailSelection) => {
        selection.value = payload;
        openModal('taskDetail');
    };

    const closeTaskDetail = () => {
        selection.value = null;
        closeModal();
    };

    return { selection, openTaskDetail, closeTaskDetail };
};
