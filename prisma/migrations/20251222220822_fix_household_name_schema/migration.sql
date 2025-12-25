/*
  Warnings:

  - You are about to drop the column `houseHoldId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `households` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DuesInvoice" DROP CONSTRAINT "DuesInvoice_householdId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_houseHoldId_fkey";

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "houseHoldId",
ADD COLUMN     "householdId" TEXT;

-- DropTable
DROP TABLE "public"."households";

-- CreateTable
CREATE TABLE "public"."household" (
    "id" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "public"."StatusHouseholds" DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,

    CONSTRAINT "household_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "household_rtId_idx" ON "public"."household"("rtId");

-- CreateIndex
CREATE UNIQUE INDEX "household_rtId_address_key" ON "public"."household"("rtId", "address");

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "public"."household"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DuesInvoice" ADD CONSTRAINT "DuesInvoice_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "public"."household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
