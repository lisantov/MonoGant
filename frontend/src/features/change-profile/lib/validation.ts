import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { emailValid, nameValid } from '@/shared';

const profileSchemaRaw = z.object({
    name: nameValid,
    email: emailValid,
});

export const profileSchema = toTypedSchema(profileSchemaRaw);
export type ProfileFormValues = z.infer<typeof profileSchemaRaw>;
