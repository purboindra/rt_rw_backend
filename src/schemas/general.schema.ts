import * as z from "zod";

export const idParams = z.object({
  id: z.uuid({
    error: "ID Tidak valid",
  }),
});

export const baseQuery = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  cursor: z.string().optional(),
  order: z.enum(["desc", "asc"]).default("desc"),
  q: z.string().optional(),
});

export const rtIdQuery = z.object({
  rtId: z.string().uuid().optional(),
});

export const houseHoldIdQuery = z.object({
  householdId: z.string().uuid().optional(),
});
