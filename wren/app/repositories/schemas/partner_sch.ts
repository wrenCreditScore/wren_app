import { z } from 'zod';

export const createPartnerSchema = z.object({
    name: z.string(),
    access_token: z.string(),
    phone_number: z.string(),
});