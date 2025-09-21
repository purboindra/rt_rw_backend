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
  authorId: z.uuid({
    error: "Author berita tidak valid",
  }),
  rtId: z.uuid({
    error: "RT berita tidak valid",
  }),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;

export const updateNewsSchema = z.object({
  title: z
    .string({
      error: "Judul berita diperlukan",
    })
    .min(1, "Judul berita diperlukan")
    .optional(),
  description: z.string().optional(),
  body: z
    .string({
      error: "Isi berita diperlukan",
    })
    .min(1, "Isi berita diperlukan")
    .optional(),
});

export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
