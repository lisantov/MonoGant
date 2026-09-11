import { describe, expect, it } from 'vitest';

import { profileSchema } from '../validation';

type ParseResult = Awaited<ReturnType<typeof profileSchema.parse>>;

const check = async (values: object) => {
    const result: ParseResult = await profileSchema.parse(values);
    const errors: Record<string, string> = {};
    for (const item of result.errors ?? []) {
        errors[item.path] = item.errors[0]!;
    }
    return { valid: result.errors.length === 0, errors };
};

const valid = () => ({ name: 'Иван', email: 'ivan@mail.ru' });

describe('profileSchema', () => {
    it('принимает корректные данные', async () => {
        const { valid: isValid } = await check(valid());
        expect(isValid).toBe(true);
    });

    it('отклоняет некорректный email', async () => {
        const { valid: isValid, errors } = await check({ ...valid(), email: 'bad' });
        expect(isValid).toBe(false);
        expect(errors.email).toBeTruthy();
    });

    it('отклоняет имя из пробелов', async () => {
        const { valid: isValid, errors } = await check({ ...valid(), name: '   ' });
        expect(isValid).toBe(false);
        expect(errors.name).toBeTruthy();
    });
});
