import * as z from "zod";

export const createRTSchema = z.object({
  name: z
    .string({
      error: "Nama RT Diperlukan",
    })
    .min(1, "Nama RT Diperlukan"),
  address: z
    .string({
      error: "Alamat RT Diperlukan",
    })
    .min(1, "Alamat RT Diperlukan"),
  totalFunds: z.number().optional(),
  users: z
    .array(
      z.string({
        error: "User id harus bertipe string",
      })
    )
    .default([])
    .optional(),
  activities: z
    .array(
      z.string({
        error: "Activity id harus bertipe string",
      })
    )
    .default([])
    .optional(),
  news: z
    .array(
      z.string({
        error: "Berita/informasi id harus bertipe string",
      })
    )
    .default([])
    .optional(),
});

export type CreateRTInput = z.infer<typeof createRTSchema>;
