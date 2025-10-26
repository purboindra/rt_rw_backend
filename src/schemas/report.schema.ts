import { z } from "zod";

const StatusEnum = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);

export const CreateReportSchema = z.object({
  userId: z.uuid().min(1, "User id diperlukan"),
  rtId: z.uuid().min(1, "RT id diperlukan"),
  status: z.preprocess((val) => (typeof val === "string" ? val.trim().toUpperCase() : val), StatusEnum.default("OPEN")),
  description: z.string().min(1, "Deksripsi diperlukan"),
  title: z.string().min(1, "Judul diperlukan"),
  imageUrl: z.string().min(1, "Gambar diperlukan"),
});

export type CreateReportInput = z.infer<typeof CreateReportSchema>;

export const getReportQuery = z.object({
  q: z.string().optional(),
  rtId: z.string().uuid().optional(),
  status: StatusEnum.optional(),
  limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  cursor: z.string().optional(),
  order: z.enum(["desc", "asc"]).default("desc"),
});

export const updateReportSchema = z.object({
  imageUrl: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z
    .string()
    .transform((stat) => stat.trim().toUpperCase())
    .pipe(StatusEnum)
    .optional(),
});
