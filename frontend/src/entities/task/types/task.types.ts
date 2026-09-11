import type { GANTT_TASK_STATUS } from '@/widgets';

export interface Task {
    id: number;
    name: string;
    description: string;
    started_at: string;
    deadline_at: string;
    status: GANTT_TASK_STATUS;
    sprint_id: number;
    next_task_id: number | null;
    user: {
        name: string;
        email: string;
    };
}

export interface CreateBody {
    name: string;
    description: string;
    started_at: string;
    deadline_at: string;
    user_email: string;
}

export interface CreateResponse {
    message: string;
    task: Task;
}
