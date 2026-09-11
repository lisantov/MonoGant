import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { emailValid, passwordValid, nameValid } from '@/shared';

const registrationSchemaRaw = z
    .object({
        name: nameValid,
        email: emailValid,
        password: passwordValid,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
    });

export const registerSchema = toTypedSchema(registrationSchemaRaw);
export type RegisterFormValues = z.infer<typeof registrationSchemaRaw>;
