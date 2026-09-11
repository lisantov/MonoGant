import { api } from '@/shared/api';

export const taskService = {
    getCommentaries: (taskId: string) =>
        api.get(`tasks/${taskId}/comments`).then((res) => res.data),

    createCommentary: (taskId: string) =>
        api.get(`tasks/${taskId}/comments`).then((res) => res.data),
};
