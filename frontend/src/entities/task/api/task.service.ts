import { api } from '@/shared/api';
import type { CreateBody, Task, TaskListResponse, TaskResponse, UpdateBody } from '@/entities';

export const taskService = {
    create: (data: CreateBody & { sprintId: number }) =>
        api
            .post<TaskResponse>(`sprints/${data.sprintId}/tasks`, {
                name: data.name,
                description: data.description,
                started_at: data.started_at,
                deadline_at: data.deadline_at,
                status: data.status,
                user_email: data.user_email,
            })
            .then((res) => res.data),

    list: (sprintId: number) =>
        api.get<TaskListResponse>(`sprints/${sprintId}/tasks`).then((res) => res.data),

    show: (id: number) => api.get<Task>(`tasks/${id}`).then((res) => res.data),

    update: (id: number, data: UpdateBody) =>
        api.patch<TaskResponse>(`tasks/${id}`, data).then((res) => res.data),

    remove: (id: number) => api.delete(`tasks/${id}`).then((res) => res.data),
};
