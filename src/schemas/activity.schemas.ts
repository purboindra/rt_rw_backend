import { z } from "zod";

export const getActivitiesQuery = z
  .object({
    rtId: z.string().optional(),
    q: z.string().trim().optional(),
    type: z.string().optional(),
    picId: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(25),
    cursor: z.string().optional(),
    order: z.enum(["desc", "asc"]).default("desc"),
  })
  .optional();

export const updateActivitySchema = z.object({
  imageUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  date: z.number().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  picId: z.string().optional(),
  userIds: z.array(z.string()).optional(),
});
