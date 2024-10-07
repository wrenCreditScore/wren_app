import { z } from 'zod';

export const walletScheme = z.object({
    id: z.string(),
    user_id: z.string(),
    wallet_address: z.string(),
})