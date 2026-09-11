import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import type { GANTT_TASK_STATUS } from '@/shared';

const DATE_PATTERN = /^[\d]{4}-[\d]{2}-[\d]{2}$/;

const taskCreateSchemaRaw = z.object({
    name: z.string().max(255, 'Максимум 255 символов'),
    description: z.string().max(255, 'Максимум 255 символов').optional().or(z.literal('')),
    started_at: z.string().regex(DATE_PATTERN, 'Введите корректную дату'),
    deadline_at: z.string().regex(DATE_PATTERN, 'Введите корректную дату'),
    user_email: z.string().email('Выберите корректного пользователя').optional().or(z.literal('')),
});

export const taskCreateSchema = toTypedSchema(taskCreateSchemaRaw);
export type TaskCreateFormValues = z.infer<typeof taskCreateSchemaRaw>;

const taskEditSchemaRaw = z.object({
    name: z.string().min(1, 'Минимум 1 символ').max(255, 'Максимум 255 символов'),
    description: z.string().max(255, 'Максимум 255 символов').optional().or(z.literal('')),
    started_at: z.string().regex(DATE_PATTERN, 'Введите корректную дату'),
    deadline_at: z.string().regex(DATE_PATTERN, 'Введите корректную дату'),
    status: z.enum(['planned', 'in_progress', 'done', 'cancelled']),
    user_email: z.string().email('Выберите корректного пользователя').optional().or(z.literal('')),
});

export const taskEditSchema = toTypedSchema(taskEditSchemaRaw);
export type TaskEditFormValues = z.infer<typeof taskEditSchemaRaw> & {
    status: GANTT_TASK_STATUS;
};
