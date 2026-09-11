import { describe, expect, it } from 'vitest';

import { projectCreateSchema, projectEditSchema } from '../validation';

type CreateResult = Awaited<ReturnType<typeof projectCreateSchema.parse>>;
type EditResult = Awaited<ReturnType<typeof projectEditSchema.parse>>;

const toErrors = (result: { errors: Array<{ path: string; errors: string[] }> }) => {
    const errors: Record<string, string> = {};
    for (const item of result.errors) {
        errors[item.path] = item.errors[0]!;
    }
    return errors;
};

const checkCreate = async (values: object) => {
    const result: CreateResult = await projectCreateSchema.parse(values);
    return { valid: result.errors.length === 0, errors: toErrors(result) };
};

const checkEdit = async (values: object) => {
    const result: EditResult = await projectEditSchema.parse(values);
    return { valid: result.errors.length === 0, errors: toErrors(result) };
};

const base = { name: 'Проект', started_at: '2026-09-01', deadline_at: '2026-12-31' };

describe('projectCreateSchema', () => {
    it('принимает корректные данные', async () => {
        expect((await checkCreate(base)).valid).toBe(true);
    });

    it('принимает пустой deadline_at', async () => {
        expect((await checkCreate({ ...base, deadline_at: '' })).valid).toBe(true);
    });

    it('отклоняет некорректную дату', async () => {
        const { valid, errors } = await checkCreate({ ...base, started_at: '01/09/2026' });
        expect(valid).toBe(false);
        expect(errors.started_at).toBeTruthy();
    });
});

describe('projectEditSchema', () => {
    it('принимает корректные данные со статусом', async () => {
        expect((await checkEdit({ ...base, status: 'planned' })).valid).toBe(true);
    });

    it('отклоняет неизвестный статус', async () => {
        const { valid, errors } = await checkEdit({ ...base, status: 'archived' });
        expect(valid).toBe(false);
        expect(errors.status).toBeTruthy();
    });
});
