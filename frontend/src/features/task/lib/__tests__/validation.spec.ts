import { describe, expect, it } from 'vitest';

import { taskCreateSchema, taskEditSchema } from '../validation';

type CreateResult = Awaited<ReturnType<typeof taskCreateSchema.parse>>;
type EditResult = Awaited<ReturnType<typeof taskEditSchema.parse>>;

const toErrors = (result: { errors: Array<{ path: string; errors: string[] }> }) => {
    const errors: Record<string, string> = {};
    for (const item of result.errors) {
        errors[item.path] = item.errors[0]!;
    }
    return errors;
};

const checkCreate = async (values: object) => {
    const result: CreateResult = await taskCreateSchema.parse(values);
    return { valid: result.errors.length === 0, errors: toErrors(result) };
};

const checkEdit = async (values: object) => {
    const result: EditResult = await taskEditSchema.parse(values);
    return { valid: result.errors.length === 0, errors: toErrors(result) };
};

const base = {
    name: 'Сверстать экран',
    description: '',
    started_at: '2026-09-10',
    deadline_at: '2026-09-15',
    user_email: '',
};

describe('taskCreateSchema', () => {
    it('принимает корректные данные', async () => {
        expect((await checkCreate(base)).valid).toBe(true);
    });

    it('требует корректное поле started_at', async () => {
        const { valid, errors } = await checkCreate({ ...base, started_at: '10-09-2026' });
        expect(valid).toBe(false);
        expect(errors.started_at).toBeTruthy();
    });

    it('требует корректное поле deadline_at', async () => {
        const { valid, errors } = await checkCreate({ ...base, deadline_at: '10.09.2026' });
        expect(valid).toBe(false);
        expect(errors.deadline_at).toBeTruthy();
    });

    it('отклоняет имя длиннее 255 символов', async () => {
        const { valid, errors } = await checkCreate({ ...base, name: 'а'.repeat(256) });
        expect(valid).toBe(false);
        expect(errors.name).toBeTruthy();
    });

    it('отклоняет некорректный user_email', async () => {
        const { valid, errors } = await checkCreate({ ...base, user_email: 'not-email' });
        expect(valid).toBe(false);
        expect(errors.user_email).toBeTruthy();
    });
});

describe('taskEditSchema', () => {
    it('принимает корректные данные со статусом', async () => {
        expect((await checkEdit({ ...base, status: 'in_progress' })).valid).toBe(true);
    });

    it('отклоняет неизвестный статус', async () => {
        const { valid, errors } = await checkEdit({ ...base, status: 'unknown' });
        expect(valid).toBe(false);
        expect(errors.status).toBeTruthy();
    });

    it('отклоняет пустое имя', async () => {
        const { valid, errors } = await checkEdit({ ...base, status: 'done', name: '' });
        expect(valid).toBe(false);
        expect(errors.name).toBeTruthy();
    });
});
