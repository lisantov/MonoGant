import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const PASSWORD_PATTERN = /^[A-Za-z0-9%:\.,\(\)\[\]\{\};\*\!\/<>\_\-\–@#\?\']+$/;

const changePasswordSchemaRaw = z
    .object({
        old_password: z.string().min(1, 'Введите текущий пароль'),
        new_password: z
            .string()
            .min(6, 'Минимум 6 символов')
            .regex(PASSWORD_PATTERN, 'Недопустимые символы'),
        confirm_password: z.string(),
    })
    .refine((values) => values.new_password === values.confirm_password, {
        message: 'Пароли не совпадают',
        path: ['confirm_password'],
    });

export const changePasswordSchema = toTypedSchema(changePasswordSchemaRaw);
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchemaRaw>;
