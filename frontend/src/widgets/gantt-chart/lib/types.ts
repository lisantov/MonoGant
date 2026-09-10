export interface IMonth {
    title: string;
    year: number;
    monthIndex: number;
    days: number[];
}

export interface IGanttConfig {
    dayWidth: number;
    dayHeight: number;
    minDayWidth: number;
    maxDayWidth: number;
}

export interface IGanttTask {
    id: number;
    name: string;
    description: string;
    started_at: string;
    deadline_at: string;
    depends_on?: number | null;
}

export interface IGanttBar {
    id: number;
    name: string;
    description: string;
    x: number;
    y: number;
    days: number;
    depends_on?: number | null;
}

export const MS_PER_DAY = 1000 * 60 * 60 * 24;
