import * as z from "zod";

export const createNewsSchema = z.object({
  title: z
    .string({
      error: "Judul berita diperlukan",
    })
    .min(1, "Judul berita diperlukan"),
  description: z.string().optional(),
  body: z
    .string({
      error: "Isi berita diperlukan",
    })
    .min(1, "Isi berita diperlukan"),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema> & {
  authorId: string;
  rtId: string;
};

export const updateNewsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  body: z.string().optional(),
});

export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;

export const getNewsQuery = z.object({
  q: z.string().optional(),
  rtId: z.string().uuid().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  cursor: z.string().optional(),
  order: z.enum(["desc", "asc"]).default("desc"),
});
