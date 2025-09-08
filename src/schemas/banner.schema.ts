import { z } from "zod";

export const createBannerSchema = z.object({
  imagePath: z.string(),
  imageKitFileId: z.string().optional(),
  imageUrl: z.string().optional(),
  minAppVersion: z.string().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  linkUrl: z.string().optional(),
  placement: z
    .enum(["HOME_CAROUSEL", "ONBOARDING", "INTERSTITIAL"])
    .default("HOME_CAROUSEL"),
  linkType: z.enum(["NONE", "EXTERNAL", "DEEPLINK"]).default("NONE"),
  platform: z.array(z.enum(["ANDROID", "IOS", "WEB"])).default(["ANDROID"]),
  title: z.string().optional(),
  description: z.string().optional(),
  allText: z.string().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  deletedAt: z.string().datetime().optional(),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;

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
