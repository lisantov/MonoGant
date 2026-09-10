import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { emailValid, passwordValid, usernameValid } from '@/shared';

const registrationSchemaRaw = z
    .object({
        username: usernameValid,
        email: emailValid,
        password: passwordValid,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
        when: () => true,
    });

export const registerSchema = toTypedSchema(registrationSchemaRaw);
export type RegisterFormValues = z.infer<typeof registrationSchemaRaw>;
