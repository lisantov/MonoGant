import type { User } from '@/entities/account/types/account.types';
import type { GANTT_TASK_STATUS } from '@/shared';

export interface Project {
    id: number;
    name: string;
    started_at: string;
    deadline_at: string;
    status: GANTT_TASK_STATUS;
    owner: User | null;
    members: User[];
}

export interface CreateProjectBody {
    name: string;
    started_at: string;
    deadline_at?: string;
}

export interface UpdateProjectBody {
    name?: string;
    started_at?: string;
    deadline_at?: string;
    status?: GANTT_TASK_STATUS;
}

export type ProjectMemberRole = 'member' | 'responsible';

export interface ProjectMember {
    user: User;
    role: ProjectMemberRole;
}

export interface ProjectListResponse {
    data: Project[];
}

export interface ProjectResponse {
    message: string;
    project: Project;
}

export interface ProjectMembersResponse {
    message: string;
    count: number;
    members: User[];
}

export interface ProjectMemberResponse {
    message: string;
    member: ProjectMember;
}
