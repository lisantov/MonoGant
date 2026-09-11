import { describe, expect, it } from 'vitest';

import { registerSchema } from '../validation';

type ParseResult = Awaited<ReturnType<typeof registerSchema.parse>>;

const check = async (values: object) => {
    const result: ParseResult = await registerSchema.parse(values);
    const errors: Record<string, string> = {};
    for (const item of result.errors ?? []) {
        errors[item.path] = item.errors[0]!;
    }
    return { valid: result.errors.length === 0, errors };
};

const valid = () => ({
    name: 'Иван',
    email: 'ivan@mail.ru',
    password: 'Abcdef!1',
    confirmPassword: 'Abcdef!1',
});

describe('registerSchema', () => {
    it('принимает корректные данные', async () => {
        const { valid: isValid } = await check(valid());
        expect(isValid).toBe(true);
    });

    it('отклоняет несовпадающие пароли', async () => {
        const { valid: isValid, errors } = await check({
            ...valid(),
            confirmPassword: 'Different1!',
        });
        expect(isValid).toBe(false);
        expect(errors.confirmPassword).toBeTruthy();
    });

    it('отклоняет слабый пароль', async () => {
        const { valid: isValid, errors } = await check({ ...valid(), password: 'qwerty' });
        expect(isValid).toBe(false);
        expect(errors.password).toBeTruthy();
    });

    it('отклоняет некорректный email', async () => {
        const { valid: isValid, errors } = await check({ ...valid(), email: 'not-an-email' });
        expect(isValid).toBe(false);
        expect(errors.email).toBeTruthy();
    });

    it('отклоняет недопустимое имя', async () => {
        const { valid: isValid, errors } = await check({ ...valid(), name: '   ' });
        expect(isValid).toBe(false);
        expect(errors.name).toBeTruthy();
    });
});
