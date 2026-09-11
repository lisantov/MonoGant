import { describe, expect, it } from 'vitest';

import {
    blockingValid,
    descriptionModelValid,
    emailValid,
    nameModelValid,
    nameValid,
    passwordValid,
    priceModelValid,
    reviewValid,
    searchValid,
} from '../const';

const check = (schema: typeof nameValid, value: unknown) => {
    const result = schema.safeParse(value);
    return {
        success: result.success,
        error: result.success ? null : result.error.issues[0]!.message,
    };
};

describe('nameValid', () => {
    it('принимает корректные имена', () => {
        expect(check(nameValid, 'Анна').success).toBe(true);
        expect(check(nameValid, 'John Doe').success).toBe(true);
        expect(check(nameValid, '123').success).toBe(true);
    });

    it('отклоняет пустую строку и строку из пробелов', () => {
        expect(check(nameValid, '').success).toBe(false);
        expect(check(nameValid, '   ').success).toBe(false);
        expect(check(nameValid, '!!!').success).toBe(false);
    });

    it('отклоняет недопустимые символы', () => {
        expect(check(nameValid, 'Анна<3').success).toBe(false);
    });

    it('отклоняет строки длиннее 50 символов', () => {
        expect(check(nameValid, 'а'.repeat(51)).success).toBe(false);
    });
});

describe('emailValid', () => {
    it('принимает корректные email', () => {
        expect(check(emailValid, 'user@mail.ru').success).toBe(true);
        expect(check(emailValid, 'a.b+c@sub.domain').success).toBe(true);
    });

    it('отклоняет некорректные email', () => {
        expect(check(emailValid, 'plainaddress').success).toBe(false);
        expect(check(emailValid, 'user@').success).toBe(false);
        expect(check(emailValid, 'a b@mail.ru').success).toBe(false);
        expect(check(emailValid, 'user@mail,r').success).toBe(false);
    });
});

describe('passwordValid', () => {
    it('принимает пароль с заглавной буквой и спецсимволом', () => {
        expect(check(passwordValid, 'Abcdef!1').success).toBe(true);
    });

    it('отклоняет пароль без заглавной буквы', () => {
        expect(check(passwordValid, 'abcdef!1').success).toBe(false);
    });

    it('отклоняет пароль без спецсимвола', () => {
        expect(check(passwordValid, 'Abcdef1').success).toBe(false);
    });

    it('отклоняет слишком короткий пароль', () => {
        expect(check(passwordValid, 'Ab1!').success).toBe(false);
    });

    it('отклоняет кириллицу и другие недопустимые символы', () => {
        expect(check(passwordValid, 'Abсdef!1').success).toBe(false);
    });
});

describe('searchValid', () => {
    it('принимает поисковый запрос', () => {
        expect(check(searchValid, 'query').success).toBe(true);
    });

    it('отклоняет строку из пробелов', () => {
        expect(check(searchValid, '   ').success).toBe(false);
    });

    it('отклоняет строки длиннее 50 символов', () => {
        expect(check(searchValid, 'q'.repeat(51)).success).toBe(false);
    });

    it('отклоняет недопустимые символы', () => {
        expect(check(searchValid, 'q<').success).toBe(false);
    });
});

describe('nameModelValid', () => {
    it('принимает корректные значения и отклоняет пробелы', () => {
        expect(check(nameModelValid, 'Модель').success).toBe(true);
        expect(check(nameModelValid, '   ').success).toBe(false);
    });
});

describe('priceModelValid', () => {
    it('принимает число, пустую строку и undefined', () => {
        expect(check(priceModelValid, '100').success).toBe(true);
        expect(check(priceModelValid, '').success).toBe(true);
        expect(check(priceModelValid, undefined).success).toBe(true);
    });

    it('отклоняет строки длиннее 8 символов', () => {
        expect(check(priceModelValid, '123456789').success).toBe(false);
    });
});

describe('descriptionModelValid', () => {
    it('принимает пустое и корректное описание', () => {
        expect(check(descriptionModelValid, '').success).toBe(true);
        expect(check(descriptionModelValid, 'Описание').success).toBe(true);
    });

    it('отклоняет описание из пробелов и длиннее 255 символов', () => {
        expect(check(descriptionModelValid, '   ').success).toBe(false);
        expect(check(descriptionModelValid, 'а'.repeat(256)).success).toBe(false);
    });
});

describe('reviewValid', () => {
    it('принимает текст отзыва и отклоняет пробелы', () => {
        expect(check(reviewValid, 'Круто!').success).toBe(true);
        expect(check(reviewValid, '   ').success).toBe(false);
    });
});

describe('blockingValid', () => {
    it('принимает текст и отклоняет пробелы', () => {
        expect(check(blockingValid, 'Заблокирован').success).toBe(true);
        expect(check(blockingValid, '   ').success).toBe(false);
    });
});
