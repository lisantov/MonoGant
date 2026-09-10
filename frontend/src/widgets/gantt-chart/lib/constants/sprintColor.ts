export interface ISprintColor {
    /** цвет рамки и подписи */
    border: string;
    /** цвет фона плашки */
    bg: string;
    /** цвет текста заголовка */
    text: string;
}

export const SPRINT_COLORS: ISprintColor[] = [
    { border: '#60a5fa', bg: 'rgba(96,165,250,0.10)', text: '#1e40af' }, // blue
    { border: '#34d399', bg: 'rgba(52,211,153,0.10)', text: '#065f46' }, // emerald
    { border: '#f59e0b', bg: 'rgba(245,158,11,0.10)', text: '#92400e' }, // amber
    { border: '#a78bfa', bg: 'rgba(167,139,250,0.10)', text: '#5b21b6' }, // violet
    { border: '#f472b6', bg: 'rgba(244,114,182,0.10)', text: '#9d174d' }, // pink
    { border: '#22d3ee', bg: 'rgba(34,211,238,0.10)', text: '#155e75' }, // cyan
    { border: '#fb7185', bg: 'rgba(251,113,133,0.10)', text: '#9f1239' }, // rose
    { border: '#84cc16', bg: 'rgba(132,204,22,0.10)', text: '#3f6212' }, // lime
];

export const getSprintColor = (index: number): ISprintColor =>
    SPRINT_COLORS[index % SPRINT_COLORS.length]!;
