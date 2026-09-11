import { describe, expect, it } from 'vitest';

import { formatDate } from '../functions';

process.env.TZ = 'UTC';

describe('formatDate', () => {
    it('форматирует ISO-строку в DD.MM.YYYY HH:MM', () => {
        expect(formatDate('2026-09-10T12:30:00')).toBe('10.09.2026 12:30');
        expect(formatDate('2026-01-05T09:05:00')).toBe('05.01.2026 09:05');
    });

    it('добавляет ведущие нули', () => {
        expect(formatDate('2026-02-03T04:05:00')).toBe('03.02.2026 04:05');
    });

    it('возвращает пустую строку для undefined/null', () => {
        expect(formatDate(undefined)).toBe('');
        expect(formatDate(null)).toBe('');
    });

    it('возвращает пустую строку для некорректной даты', () => {
        expect(formatDate('не дата')).toBe('');
    });
});
