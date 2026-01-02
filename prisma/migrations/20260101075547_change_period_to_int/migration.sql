/*
  Warnings:

  - Added the required column `period` to the `dues_invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."dues_invoice" DROP COLUMN "period",
ADD COLUMN     "period" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "dues_invoice_period_idx" ON "public"."dues_invoice"("period");

-- CreateIndex
CREATE UNIQUE INDEX "dues_invoice_householdId_duesTypeId_period_key" ON "public"."dues_invoice"("householdId", "duesTypeId", "period");
