import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const loginSchemaRaw = z.object({
    email: z.string().email('Введите корректный email').max(255, 'Максимум 255 символов'),
    password: z.string().max(30, 'Максимум 30 символов'),
});

export const loginSchema = toTypedSchema(loginSchemaRaw);
export type LoginFormValues = z.infer<typeof loginSchemaRaw>;
