import { z } from "zod";

export const signInSchema = z.object({
  phone: z.string().min(11).max(13),
});
