import { z } from "zod";

export const getActivitiesQuery = z.object({
  rtId: z.string().optional(),
  q: z.string().trim().optional(),
  type: z.string().optional(),
  picId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().optional(),
  order: z.enum(["desc", "asc"]).default("desc"),
});
