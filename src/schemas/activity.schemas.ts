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

export const createActivitySchema = z
  .object({
    date: z.coerce
      .number({
        error: "Tanggal pelaksanaan diperlukan",
      })
      .int()
      .positive(),

    title: z
      .string({
        error: "Judul aktifitas diperlukan",
      })
      .trim()
      .min(1, "Judul aktifitas diperlukan"),

    type: z
      .string({
        error: "Tipe aktifitas diperlukan",
      })
      .trim()
      .toUpperCase()
      .pipe(z.enum(["RONDA", "KERJA_BAKTI", "RAPAT", "KEGIATAN_SOSIAL"], {})),

    description: z
      .string({
        error: "Deskripsi aktifitas diperkukan",
      })
      .trim()
      .min(1, "Deskripsi aktifitas diperkukan"),

    picId: z
      .string({
        error: "Pic aktifitas diperlukan",
      })
      .uuid("Pic aktifitas tidak valid"),

    // rt_id: z
    //   .string({
    //     error: "RT diperlukan",
    //   })
    //   .min(1, "RT diperlukan"),

    // created_by_id: z
    //   .string({
    //     error: "Pembuat diperlukan",
    //   })
    //   .min(1, "Pembuat diperlukan"),

    userIds: z
      .array(
        z.string({
          error: "Peserta aktifitas diperlukan",
        })
      )
      .nonempty("Peserta aktifitas diperlukan"),
  })
  .strict();

export type createActivityInput = z.infer<typeof createActivitySchema> & {
  rtId: string;
  createdById: string;
};
