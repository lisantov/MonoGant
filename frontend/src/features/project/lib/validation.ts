import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const DATE_PATTERN = /^[\d]{4}-[\d]{2}-[\d]{2}$/;

const projectFields = {
    name: z.string().min(1, 'Введите название').max(255, 'Максимум 255 символов'),
    started_at: z.string().regex(DATE_PATTERN, 'Введите корректную дату'),
    deadline_at: z
        .string()
        .regex(DATE_PATTERN, 'Введите корректную дату')
        .optional()
        .or(z.literal('')),
};

const projectCreateSchemaRaw = z.object(projectFields);

const projectEditSchemaRaw = z.object({
    ...projectFields,
    status: z.enum(['planned', 'in_progress', 'done', 'cancelled']),
});

export const projectCreateSchema = toTypedSchema(projectCreateSchemaRaw);
export type ProjectCreateFormValues = z.infer<typeof projectCreateSchemaRaw>;

export const projectEditSchema = toTypedSchema(projectEditSchemaRaw);
export type ProjectEditFormValues = z.infer<typeof projectEditSchemaRaw>;
