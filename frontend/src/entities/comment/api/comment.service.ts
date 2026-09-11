import { api } from '@/shared/api';
import type { Comment, CommentListResponse, CommentResponse, StoreCommentBody } from '@/entities';

export const commentService = {
    list: (taskId: number) =>
        api.get<CommentListResponse>(`tasks/${taskId}/comments`).then((res) => res.data),

    create: (taskId: number, body: StoreCommentBody) =>
        api.post<CommentResponse>(`tasks/${taskId}/comments`, body).then((res) => res.data),

    show: (id: number) => api.get<Comment>(`comments/${id}`).then((res) => res.data),
};
