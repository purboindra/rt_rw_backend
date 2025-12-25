import z from "zod";
import { HouseholdStatusEnum } from "../utils/enums";
import { baseQuery, rtIdQuery } from "./general.schema";

export const createHouseholdsSchema = z.object({
  rtId: z.guid().min(1, "RT id diperlukan"),
  address: z.string().min(1, "Alamat RT diperlukan"),
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    HouseholdStatusEnum.default("ACTIVE"),
  ),
  userIds: z.array(z.guid().min(1, "User id diperlukan")).min(1, "Setidaknya harus ada satu anggota rumah tangga"),
});

export type CreateHouseholdInput = z.infer<typeof createHouseholdsSchema>;

export const updateHouseholdsSchema = z.object({
  address: z.string().min(1, "Alamat RT diperlukan").optional(),
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    HouseholdStatusEnum.optional(),
  ),
  userIds: z
    .array(z.string().min(1, "User id diperlukan"))
    .min(1, "Setidaknya harus ada satu anggota rumah tangga")
    .optional(),
});

export type UpdateHouseholdInput = z.infer<typeof updateHouseholdsSchema>;

export const statusQuery = z.object({
  status: HouseholdStatusEnum.optional(),
});

export const getHouseholdsQuery = baseQuery.merge(rtIdQuery).merge(statusQuery);

export const attachMembersHouseholdSchema = z.object({
  userIds: z
    .array(z.string().min(1, "User id diperlukan"))
    .min(1, "Setidaknya harus ada satu anggota rumah tangga")
    .optional(),
});
