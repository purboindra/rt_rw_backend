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
