/*
  Warnings:

  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Banner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DuesInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DuesPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DuesType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `News` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDevice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activitycounter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `outbox` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reportcounter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reportincident` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Activity" DROP CONSTRAINT "Activity_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Activity" DROP CONSTRAINT "Activity_picId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Activity" DROP CONSTRAINT "Activity_rtId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DuesInvoice" DROP CONSTRAINT "DuesInvoice_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."DuesInvoice" DROP CONSTRAINT "DuesInvoice_duesTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DuesInvoice" DROP CONSTRAINT "DuesInvoice_householdId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DuesPayment" DROP CONSTRAINT "DuesPayment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DuesPayment" DROP CONSTRAINT "DuesPayment_payerUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DuesPayment" DROP CONSTRAINT "DuesPayment_verifiedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."News" DROP CONSTRAINT "News_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."News" DROP CONSTRAINT "News_rtId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserContact" DROP CONSTRAINT "UserContact_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserDevice" DROP CONSTRAINT "UserDevice_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ActivityToUser" DROP CONSTRAINT "_ActivityToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."reportincident" DROP CONSTRAINT "reportincident_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_rtId_fkey";

-- DropTable
DROP TABLE "public"."Activity";

-- DropTable
DROP TABLE "public"."Banner";

-- DropTable
DROP TABLE "public"."DuesInvoice";

-- DropTable
DROP TABLE "public"."DuesPayment";

-- DropTable
DROP TABLE "public"."DuesType";

-- DropTable
DROP TABLE "public"."News";

-- DropTable
DROP TABLE "public"."Otp";

-- DropTable
DROP TABLE "public"."RefreshToken";

-- DropTable
DROP TABLE "public"."Rt";

-- DropTable
DROP TABLE "public"."UserContact";

-- DropTable
DROP TABLE "public"."UserDevice";

-- DropTable
DROP TABLE "public"."activitycounter";

-- DropTable
DROP TABLE "public"."outbox";

-- DropTable
DROP TABLE "public"."reportcounter";

-- DropTable
DROP TABLE "public"."reportincident";

-- CreateTable
CREATE TABLE "public"."dues_types" (
    "id" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "frequency" "public"."DuesFrequencey" NOT NULL DEFAULT 'MONTHLY',
    "defaultAmount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,

    CONSTRAINT "dues_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dues_invoice" (
    "id" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "duesTypeId" TEXT NOT NULL,
    "period" TIMESTAMP(3),
    "amount" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,

    CONSTRAINT "dues_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dues_payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "payerUserId" TEXT,
    "paidAmount" INTEGER NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "proofUrl" TEXT,
    "note" TEXT,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,

    CONSTRAINT "dues_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fcmToken" TEXT NOT NULL,
    "platform" "public"."DevicePlatform" NOT NULL,
    "deviceModel" TEXT,
    "appVersion" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "osVersion" TEXT,

    CONSTRAINT "user_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rt" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "totalFunds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity" (
    "id" TEXT NOT NULL,
    "activityId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."ActivityType" NOT NULL,
    "date" INTEGER NOT NULL,
    "rtId" TEXT NOT NULL,
    "picId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "bannerImageUrl" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_counter" (
    "rt_id" TEXT NOT NULL,
    "yyyymmdd" TEXT NOT NULL,
    "last_no" INTEGER NOT NULL,

    CONSTRAINT "activity_counter_pkey" PRIMARY KEY ("rt_id","yyyymmdd")
);

-- CreateTable
CREATE TABLE "public"."refresh_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL,
    "rotatedAt" TIMESTAMP(3),

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otp" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_contact" (
    "id" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."banner" (
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

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report_incident" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report_counter" (
    "rt_id" TEXT NOT NULL,
    "yyyymmdd" TEXT NOT NULL,
    "last_no" INTEGER NOT NULL,

    CONSTRAINT "report_counter_pkey" PRIMARY KEY ("rt_id","yyyymmdd")
);

-- CreateTable
CREATE TABLE "public"."out_box" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "lockedAt" TIMESTAMP(3),
    "nextAttemptAt" TIMESTAMP(3),

    CONSTRAINT "out_box_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dues_types_rtId_idx" ON "public"."dues_types"("rtId");

-- CreateIndex
CREATE UNIQUE INDEX "dues_types_name_key" ON "public"."dues_types"("name");

-- CreateIndex
CREATE INDEX "dues_invoice_rtId_duesTypeId_idx" ON "public"."dues_invoice"("rtId", "duesTypeId");

-- CreateIndex
CREATE INDEX "dues_invoice_householdId_status_idx" ON "public"."dues_invoice"("householdId", "status");

-- CreateIndex
CREATE INDEX "dues_invoice_period_idx" ON "public"."dues_invoice"("period");

-- CreateIndex
CREATE UNIQUE INDEX "dues_invoice_householdId_duesTypeId_period_key" ON "public"."dues_invoice"("householdId", "duesTypeId", "period");

-- CreateIndex
CREATE INDEX "dues_payment_invoiceId_status_idx" ON "public"."dues_payment"("invoiceId", "status");

-- CreateIndex
CREATE INDEX "dues_payment_status_paidAt_idx" ON "public"."dues_payment"("status", "paidAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_device_userId_key" ON "public"."user_device"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_device_fcmToken_key" ON "public"."user_device"("fcmToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_device_userId_platform_key" ON "public"."user_device"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "activity_activityId_key" ON "public"."activity"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_key" ON "public"."refresh_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_contact_userId_key" ON "public"."user_contact"("userId");

-- CreateIndex
CREATE INDEX "banner_placement_isActive_startsAt_endsAt_sortOrder_idx" ON "public"."banner"("placement", "isActive", "startsAt", "endsAt", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "report_incident_reportId_key" ON "public"."report_incident"("reportId");

-- CreateIndex
CREATE INDEX "report_incident_rtId_createdAt_idx" ON "public"."report_incident"("rtId", "createdAt");

-- CreateIndex
CREATE INDEX "out_box_type_processedAt_idx" ON "public"."out_box"("type", "processedAt");

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_rtId_fkey" FOREIGN KEY ("rtId") REFERENCES "public"."rt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dues_invoice" ADD CONSTRAINT "dues_invoice_duesTypeId_fkey" FOREIGN KEY ("duesTypeId") REFERENCES "public"."dues_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dues_invoice" ADD CONSTRAINT "dues_invoice_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "public"."household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dues_invoice" ADD CONSTRAINT "dues_invoice_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dues_payment" ADD CONSTRAINT "dues_payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."dues_invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dues_payment" ADD CONSTRAINT "dues_payment_payerUserId_fkey" FOREIGN KEY ("payerUserId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dues_payment" ADD CONSTRAINT "dues_payment_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_device" ADD CONSTRAINT "user_device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."news" ADD CONSTRAINT "news_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."news" ADD CONSTRAINT "news_rtId_fkey" FOREIGN KEY ("rtId") REFERENCES "public"."rt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity" ADD CONSTRAINT "activity_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity" ADD CONSTRAINT "activity_picId_fkey" FOREIGN KEY ("picId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity" ADD CONSTRAINT "activity_rtId_fkey" FOREIGN KEY ("rtId") REFERENCES "public"."rt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."refresh_token" ADD CONSTRAINT "refresh_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_contact" ADD CONSTRAINT "user_contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report_incident" ADD CONSTRAINT "report_incident_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ActivityToUser" ADD CONSTRAINT "_ActivityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
