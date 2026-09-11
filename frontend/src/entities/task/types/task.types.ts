import type { User } from '@/entities/account/types/account.types';
import type { GANTT_TASK_STATUS } from '@/shared';

export interface Task {
    id: number;
    name: string;
    description: string;
    started_at: string;
    deadline_at: string;
    status: GANTT_TASK_STATUS;
    sprint_id: number;
    next_task_id: number | null;
    user: User;
}

export interface CreateBody {
    name: string;
    description?: string;
    started_at?: string;
    deadline_at?: string;
    status?: GANTT_TASK_STATUS;
    user_email?: string;
}

export interface UpdateBody extends Partial<CreateBody> {
    next_task_id?: number | null;
}

export interface TaskListResponse {
    data: Task[];
}

export interface TaskResponse {
    message: string;
    task: Task;
}
