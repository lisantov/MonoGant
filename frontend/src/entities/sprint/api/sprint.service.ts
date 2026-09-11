import { api } from '@/shared/api';
import type {
    Sprint,
    SprintListResponse,
    SprintResponse,
    StoreSprintBody,
    UpdateSprintBody,
} from '@/entities';

export const sprintService = {
    list: (projectId: number) =>
        api.get<SprintListResponse>(`projects/${projectId}/sprints`).then((res) => res.data),

    create: (projectId: number, data: StoreSprintBody) =>
        api.post<SprintResponse>(`projects/${projectId}/sprints`, data).then((res) => res.data),

    show: (id: number) => api.get<Sprint>(`sprints/${id}`).then((res) => res.data),

    update: (id: number, data: UpdateSprintBody) =>
        api.patch<SprintResponse>(`sprints/${id}`, data).then((res) => res.data),

    remove: (id: number) => api.delete(`sprints/${id}`).then((res) => res.data),
};
