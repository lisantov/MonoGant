import { describe, expect, it } from 'vitest';

import { SPRINT_COLORS, getSprintColor } from '../constants/sprintColor';
import { GANTT_TASK_STATUS, GANTT_TASK_STYLE, GANTT_TASK_TEXT } from '../types';

describe('getSprintColor', () => {
    it('возвращает палитры по кругу', () => {
        expect(getSprintColor(0)).toBe(SPRINT_COLORS[0]);
        expect(getSprintColor(1)).toBe(SPRINT_COLORS[1]);
        expect(getSprintColor(7)).toBe(SPRINT_COLORS[7]);
        expect(getSprintColor(8)).toBe(SPRINT_COLORS[0]);
        expect(getSprintColor(17)).toBe(SPRINT_COLORS[1]);
    });

    it('каждая палитра содержит border, bg и text', () => {
        for (const color of SPRINT_COLORS) {
            expect(color.border).toBeTruthy();
            expect(color.bg).toBeTruthy();
            expect(color.text).toBeTruthy();
        }
    });
});

describe('статусы задач', () => {
    it('каждый статус имеет текстовую подпись', () => {
        const statuses = [
            GANTT_TASK_STATUS.PLANNED,
            GANTT_TASK_STATUS.IN_PROGRESS,
            GANTT_TASK_STATUS.DONE,
            GANTT_TASK_STATUS.CANCELLED,
        ];

        expect(statuses).toHaveLength(GANTT_TASK_TEXT.size);
        for (const status of statuses) {
            expect(GANTT_TASK_TEXT.get(status)).toBeTruthy();
            expect(GANTT_TASK_STYLE.get(status)).toBeTruthy();
        }
    });

    it('русские подписи статусов', () => {
        expect(GANTT_TASK_TEXT.get(GANTT_TASK_STATUS.PLANNED)).toBe('Запланирована');
        expect(GANTT_TASK_TEXT.get(GANTT_TASK_STATUS.IN_PROGRESS)).toBe('В работе');
        expect(GANTT_TASK_TEXT.get(GANTT_TASK_STATUS.DONE)).toBe('Завершена');
        expect(GANTT_TASK_TEXT.get(GANTT_TASK_STATUS.CANCELLED)).toBe('Отменена');
    });
});
