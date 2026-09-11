import { GANTT_TASK_STATUS } from '@/widgets';

export interface Project {
    id: number;
    name: string;
    started_at: string;
    deadline_at: string;
    status: GANTT_TASK_STATUS;
    owner: {
        name: string;
        email: string;
    };
    members: [
        {
            name: string;
            email: string;
        },
    ];
    responsible: null | string;
}

export interface GetProjectsResponse {
    data: Project[];
}
