import { z } from "zod";

export enum ActivityEnum {
  RONDA = "RONDA",
  KERJA_BAKTI = "KERJA_BAKTI",
  RAPAT = "RAPAT",
  KEGIATAN_SOSIAL = "KEGIATAN_SOSIAL",
}

export enum DevicePlatformEnum {
  ANDROID = "ANDROID",
  IOS = "IOS",
  WEB = "WEB",
}

export enum BannerPlacementEnum {
  HOME_CAROUSEL = "HOME_CAROUSEL",
  ONBOARDING = "ONBOARDING",
  INTERSTITIAL = "INTERSTITIAL",
}

export enum BannerLinkTypeEnum {
  NONE = "NONE",
  EXTERNAL = "EXTERNAL",
  DEEPLINK = "DEEPLINK",
}

export enum BannerPlatformEnum {
  ANDROID = "ANDROID",
  IOS = "IOS",
  WEB = "WEB",
}

export const StatusEnum = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);

export const HouseholdStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export enum RoleEnum {
  WARGA = "WARGA",
  ADMIN = "ADMIN",
  BENDAHARA = "BENDAHARA",
}

export const DuesFrequenceyEnum = z.enum(["MONTHLY", "ONE_TIME"]);
