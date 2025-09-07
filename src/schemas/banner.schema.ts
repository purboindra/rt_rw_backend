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
