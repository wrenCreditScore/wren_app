import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    phone_number: z.string(),
    CIN: z.string(),
});