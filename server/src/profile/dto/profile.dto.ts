import { z } from 'zod';

export const profileSchema = z.object({
  bio: z.string(),
  contact: z.string(),
});
