import { describe, expect, it } from 'vitest';

import { changePasswordSchema } from '../validation';

type ParseResult = Awaited<ReturnType<typeof changePasswordSchema.parse>>;

const check = async (values: object) => {
    const result: ParseResult = await changePasswordSchema.parse(values);
    const errors: Record<string, string> = {};
    for (const item of result.errors ?? []) {
        errors[item.path] = item.errors[0]!;
    }
    return { valid: result.errors.length === 0, errors };
};

const valid = () => ({
    old_password: 'Oldpass!1',
    new_password: 'Newpass!1',
    confirm_password: 'Newpass!1',
});

describe('changePasswordSchema', () => {
    it('принимает корректные данные', async () => {
        const { valid: isValid } = await check(valid());
        expect(isValid).toBe(true);
    });

    it('отклоняет несовпадающие подтверждение и новый пароль', async () => {
        const { valid: isValid, errors } = await check({
            ...valid(),
            confirm_password: 'Otherpass!1',
        });
        expect(isValid).toBe(false);
        expect(errors.confirm_password).toBeTruthy();
    });

    it('отклоняет пустой старый пароль', async () => {
        const { valid: isValid, errors } = await check({ ...valid(), old_password: '' });
        expect(isValid).toBe(false);
        expect(errors.old_password).toBeTruthy();
    });

    it('отклоняет короткий новый пароль', async () => {
        const { valid: isValid, errors } = await check({ ...valid(), new_password: 'Ab1!' });
        expect(isValid).toBe(false);
        expect(errors.new_password).toBeTruthy();
    });

    it('отклоняет новый пароль с недопустимыми символами', async () => {
        const { valid: isValid, errors } = await check({ ...valid(), new_password: 'Newpass!й' });
        expect(isValid).toBe(false);
        expect(errors.new_password).toBeTruthy();
    });
});
