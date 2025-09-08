-- CreateEnum
CREATE TYPE "public"."BannerPlacement" AS ENUM ('HOME_CAROUSEL', 'ONBOARDING', 'INTERSTITIAL');

-- CreateEnum
CREATE TYPE "public"."BannerLinkType" AS ENUM ('NONE', 'EXTERNAL', 'DEEPLINK');

-- CreateEnum
CREATE TYPE "public"."BannerPlatform" AS ENUM ('ANDROID', 'IOS', 'WEB');

-- CreateTable
CREATE TABLE "public"."Banner" (
    "id" TEXT NOT NULL,
    "placement" "public"."BannerPlacement" NOT NULL DEFAULT 'HOME_CAROUSEL',
    "title" TEXT,
    "subTitle" TEXT,
    "allText" TEXT,
    "imagePath" TEXT NOT NULL,
    "imageKitFileId" TEXT,
    "imageUrl" TEXT,
    "linkType" "public"."BannerLinkType" NOT NULL DEFAULT 'NONE',
    "linkUrl" TEXT,
    "links" JSONB,
    "platform" "public"."BannerPlatform"[] DEFAULT ARRAY[]::"public"."BannerPlatform"[],
    "minAppVersion" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Banner_placement_isActive_startsAt_endsAt_sortOrder_idx" ON "public"."Banner"("placement", "isActive", "startsAt", "endsAt", "sortOrder");
