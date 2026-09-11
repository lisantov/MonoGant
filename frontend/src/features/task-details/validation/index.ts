import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const commentarySchemaRaw = z.object({
    commentary: z
        .string({ required_error: 'Поле не должно быть пустым' })
        .max(255, 'Максимум 255 символов'),
});

export const commentarySchema = toTypedSchema(commentarySchemaRaw);
export type TaskCommentaryFormValues = z.infer<typeof commentarySchemaRaw>;
