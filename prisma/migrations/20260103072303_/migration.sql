/*
  Warnings:

  - You are about to drop the column `invoiceId` on the `dues_invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoice_no]` on the table `dues_invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."dues_invoice" DROP COLUMN "invoiceId",
ADD COLUMN     "invoice_no" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "public"."invoice_counter" (
    "rt_id" TEXT NOT NULL,
    "dues_type_id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "last_no" INTEGER NOT NULL,

    CONSTRAINT "invoice_counter_pkey" PRIMARY KEY ("rt_id","dues_type_id","period")
);

-- CreateIndex
CREATE UNIQUE INDEX "dues_invoice_invoice_no_key" ON "public"."dues_invoice"("invoice_no");
