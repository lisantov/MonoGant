import { describe, expect, it } from 'vitest';

import { sprintCreateSchema } from '../validation';

type ParseResult = Awaited<ReturnType<typeof sprintCreateSchema.parse>>;

const check = async (values: object) => {
    const result: ParseResult = await sprintCreateSchema.parse(values);
    const errors: Record<string, string> = {};
    for (const item of result.errors ?? []) {
        errors[item.path] = item.errors[0]!;
    }
    return { valid: result.errors.length === 0, errors };
};

describe('sprintCreateSchema', () => {
    it('принимает корректное название', async () => {
        expect((await check({ name: 'Спринт 1' })).valid).toBe(true);
    });

    it('отклоняет пустое название', async () => {
        const { valid, errors } = await check({ name: '' });
        expect(valid).toBe(false);
        expect(errors.name).toBeTruthy();
    });

    it('отклоняет длинное название', async () => {
        const { valid, errors } = await check({ name: 'с'.repeat(256) });
        expect(valid).toBe(false);
        expect(errors.name).toBeTruthy();
    });
});
