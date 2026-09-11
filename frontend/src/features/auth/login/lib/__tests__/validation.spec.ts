import { describe, expect, it } from 'vitest';

import { loginSchema } from '../validation';

type ParseResult = Awaited<ReturnType<typeof loginSchema.parse>>;

const check = async (values: object) => {
    const result: ParseResult = await loginSchema.parse(values);
    const errors: Record<string, string> = {};
    for (const item of result.errors ?? []) {
        errors[item.path] = item.errors[0]!;
    }
    return { valid: result.errors.length === 0, errors };
};

describe('loginSchema', () => {
    it('принимает корректные данные', async () => {
        const { valid } = await check({ email: 'user@mail.ru', password: 'secret' });
        expect(valid).toBe(true);
    });

    it('отклоняет некорректный email', async () => {
        const { valid, errors } = await check({ email: 'bad-email', password: 'secret' });
        expect(valid).toBe(false);
        expect(errors.email).toBeTruthy();
    });

    it('отклоняет пароль длиннее 30 символов', async () => {
        const { valid, errors } = await check({ email: 'user@mail.ru', password: 'x'.repeat(31) });
        expect(valid).toBe(false);
        expect(errors.password).toBeTruthy();
    });
});
