import z from "zod";
import { DuesFrequenceyEnum } from "../utils/enums";
import { baseQuery, rtIdQuery } from "./general.schema";

export const createDuesTypeSchema = z.object({
  rtId: z.guid().min(1, "RT id diperlukan"),
  name: z.string().min(1, "Nama diperlukan"),
  code: z.string().min(1, "Kode diperlukan"),
  defaultAmount: z.preprocess((val) => (typeof val === "string" ? Number(val) : val), z.number().int().nonnegative()),
  frequency: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    DuesFrequenceyEnum.default("MONTHLY"),
  ),
});

export type CreateDuesTypeInput = z.infer<typeof createDuesTypeSchema>;

export const updateDuesTypeSchema = z
  .object({
    name: z.string().min(1, "Nama diperlukan").optional(),
    defaultAmount: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z.number().int().nonnegative().optional(),
    ),
    code: z.string().optional(),
    frequency: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
      DuesFrequenceyEnum.optional(),
    ),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu field harus diupdate",
  });

export type UpdateDuesTypeInput = z.infer<typeof updateDuesTypeSchema>;

const statusQuery = z.object({
  status: DuesFrequenceyEnum.optional(),
  address: z.string().min(3, "Minimal 3 huruf").optional(),
});

export const getDuesTypeQuery = baseQuery.merge(rtIdQuery).merge(statusQuery);
