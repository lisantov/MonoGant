import { api } from '@/shared/api';
import type { CreateBody, CreateResponse } from '@/entities';

export const taskService = {
    create: (data: CreateBody & { sprintId: number }) =>
        api
            .post<CreateResponse>(`sprints/${data.sprintId}/tasks`, {
                name: data.name,
                description: data.description,
                started_at: data.started_at,
                deadline_at: data.deadline_at,
                user_email: data.user_email,
            })
            .then((res) => res.data),
};
