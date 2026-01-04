/*
  Warnings:

  - Added the required column `paymentId` to the `dues_payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."dues_invoice" ADD COLUMN     "invoiceId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "public"."dues_payment" ADD COLUMN     "paymentId" TEXT NOT NULL,
ALTER COLUMN "invoiceId" SET DEFAULT '';
