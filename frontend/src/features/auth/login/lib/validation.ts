import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const loginSchemaRaw = z.object({
    login: z.string(),
    password: z.string(),
});

export const loginSchema = toTypedSchema(loginSchemaRaw);
export type LoginFormValues = z.infer<typeof loginSchemaRaw>;
