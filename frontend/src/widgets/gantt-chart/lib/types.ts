export interface IMonth {
    title: string;
    year: number;
    days: number[];
}

export interface IGanttTask {
    name: string;
    description: string;
    started_at: string;
    deadline_at: string;
}

export interface IGanttBar {
    name: string;
    description: string;
    x: number;
    y: number;
    days: number;
}

export const MS_PER_DAY = 1000 * 60 * 60 * 24;
