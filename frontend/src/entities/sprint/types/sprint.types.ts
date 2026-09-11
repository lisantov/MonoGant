import type { GANTT_TASK_STATUS } from '@/shared';

export interface Sprint {
    id: number;
    name: string;
    started_at: string | null;
    deadline_at: string | null;
    status: GANTT_TASK_STATUS;
    description: string | null;
    next_sprint_id: number | null;
}

export interface StoreSprintBody {
    name: string;
    description?: string | null;
    status?: GANTT_TASK_STATUS;
}

export interface UpdateSprintBody {
    name?: string;
    description?: string | null;
    status?: GANTT_TASK_STATUS;
    next_sprint_id?: number | null;
}

export interface SprintListResponse {
    data: Sprint[];
}

export interface SprintResponse {
    message: string;
    sprint: Sprint;
}
