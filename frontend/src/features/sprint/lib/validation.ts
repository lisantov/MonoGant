import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const sprintCreateSchemaRaw = z.object({
    name: z.string().min(1, 'Введите название спринта').max(255, 'Максимум 255 символов'),
});

export const sprintCreateSchema = toTypedSchema(sprintCreateSchemaRaw);
export type SprintCreateFormValues = z.infer<typeof sprintCreateSchemaRaw>;
