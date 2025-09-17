import * as z from "zod";

export const idParams = z.object({
  id: z.uuid({
    error: "ID Tidak valid",
  }),
});
