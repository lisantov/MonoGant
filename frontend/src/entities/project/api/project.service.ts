import { api } from '@/shared/api';
import type { GetProjectsResponse } from '@/entities';

export const projectService = {
    getProjects: () => api.get<GetProjectsResponse>(`projects`).then((res) => res.data),
};
