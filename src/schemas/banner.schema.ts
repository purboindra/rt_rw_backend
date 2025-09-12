import { z } from "zod";

const boolish = z.preprocess((v) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(s)) return true;
    if (["false", "0", "no", "off"].includes(s)) return false;
  }
  return v;
}, z.boolean());

const numberish = z.preprocess((v) => {
  if (typeof v === "string" && v !== "") return Number(v);
  return v;
}, z.number());

const dateish = z.preprocess((v) => {
  if (v === "" || v == null) return undefined;
  if (typeof v === "string") return new Date(v);
  return v;
}, z.date());

const platforms = z.preprocess((v) => {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") return v.split(",").map((s) => s.trim());
  return v;
}, z.array(z.enum(["ANDROID", "IOS", "WEB"])));

export const bannerFieldsSchema = z.object({
  minAppVersion: z.string().optional(),
  sortOrder: numberish.pipe(z.number().int().min(0)).default(0),
  isActive: boolish.default(true),
  linkUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  placement: z
    .enum(["HOME_CAROUSEL", "ONBOARDING", "INTERSTITIAL"])
    .default("HOME_CAROUSEL"),
  linkType: z.enum(["NONE", "EXTERNAL", "DEEPLINK"]).default("NONE"),
  platform: platforms.default(["ANDROID"]),
  title: z.string().optional(),
  subTitle: z.string().optional(),
  allText: z.string().optional(),
  startsAt: dateish.optional(),
  endsAt: dateish.optional(),
  links: z.any(),
});

export const bannerCreateSchema = bannerFieldsSchema.extend({
  imagePath: z.string(),
  imageKitFileId: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type BannerCreateInput = z.infer<typeof bannerCreateSchema>;

export type CreateBannerInput = z.infer<typeof bannerCreateSchema>;

export const updateBannerSchema = z.object({
  imagePath: z.string().optional(),
  imageKitFileId: z.string().optional(),
  imageUrl: z.string().optional(),
  minAppVersion: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  linkUrl: z.string().optional(),
  placement: z.enum(["HOME_CAROUSEL", "ONBOARDING", "INTERSTITIAL"]).optional(),
  linkType: z.enum(["NONE", "EXTERNAL", "DEEPLINK"]).optional(),
  platform: z.array(z.enum(["ANDROID", "IOS", "WEB"])).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  allText: z.string().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  deletedAt: z.string().datetime().optional(),
});

export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;

export const patchBannerSchema = z.object({
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  altText: z.string().trim().optional(),
  linkType: z.enum(["NONE", "EXTERNAL", "DEEPLINK"]).optional(),
  linkUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  platforms: z
    .string()
    .optional()
    .transform((v) =>
      v ? v.split(",").map((s) => s.trim().toUpperCase()) : undefined
    ),
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
  startsAt: z.coerce.date().optional().nullable(),
  endsAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional(),
  imagePath: z.never().optional(),
  imageUrl: z.never().optional(),
  imageKitFileId: z.never().optional(),
});
