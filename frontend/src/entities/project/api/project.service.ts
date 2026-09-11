import { api } from '@/shared/api';
import type {
    CreateProjectBody,
    ParseProject,
    Project,
    ProjectListResponse,
    ProjectMemberResponse,
    ProjectMembersResponse,
    ProjectResponse,
    UpdateProjectBody,
} from '@/entities';
import type { ProjectMemberRole } from '@/entities/project/types/project.types';

export const projectService = {
    list: () => api.get<ProjectListResponse>('projects').then((res) => res.data),

    create: (data: CreateProjectBody) =>
        api.post<ProjectResponse>('projects', data).then((res) => res.data),

    show: (id: number) => api.get<Project>(`projects/${id}`).then((res) => res.data),

    update: (id: number, data: UpdateProjectBody) =>
        api.patch<Project>(`projects/${id}`, data).then((res) => res.data),

    remove: (id: number) => api.delete(`projects/${id}`).then((res) => res.data),

    parse: (id: number) =>
        api.get<{ project: ParseProject }>(`projects/parse/${id}`).then((res) => res.data),

    addMembers: (id: number, emails: string[]) =>
        api
            .post<ProjectMembersResponse>(`projects/${id}/members`, { emails })
            .then((res) => res.data),

    setMemberRole: (id: number, memberId: number, role: ProjectMemberRole) =>
        api
            .patch<ProjectMemberResponse>(`projects/${id}/members/${memberId}`, { role })
            .then((res) => res.data),

    removeMember: (id: number, memberId: number) =>
        api.delete(`projects/${id}/members/${memberId}`).then((res) => res.data),
};
