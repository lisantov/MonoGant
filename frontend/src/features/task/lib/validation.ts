import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const taskCreateSchemaRaw = z.object({
    name: z.string().max(255, 'Максимум 255 символов'),
    description: z.string().max(255, 'Максимум 255 символов').optional().or(z.literal('')),
    started_at: z.string().regex(/^[\d]{4}-[\d]{2}-[\d]{2}$/, 'Введите корректную дату'),
    deadline_at: z.string().regex(/^[\d]{4}-[\d]{2}-[\d]{2}$/, 'Введите корректную дату'),
    user_email: z.string().email('Выберите корректного пользователя').optional().or(z.literal('')),
});

export const taskCreateSchema = toTypedSchema(taskCreateSchemaRaw);
export type TaskCreateFormValues = z.infer<typeof taskCreateSchemaRaw>;
