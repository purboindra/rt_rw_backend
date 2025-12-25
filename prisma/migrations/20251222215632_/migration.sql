/*
  Warnings:

  - You are about to drop the column `userId` on the `households` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rtId,address]` on the table `households` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."households" DROP CONSTRAINT "households_userId_fkey";

-- DropIndex
DROP INDEX "public"."households_userId_key";

-- AlterTable
ALTER TABLE "public"."households" DROP COLUMN "userId";

-- CreateIndex
CREATE INDEX "households_rtId_idx" ON "public"."households"("rtId");

-- CreateIndex
CREATE UNIQUE INDEX "households_rtId_address_key" ON "public"."households"("rtId", "address");

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_houseHoldsId_fkey" FOREIGN KEY ("houseHoldsId") REFERENCES "public"."households"("id") ON DELETE SET NULL ON UPDATE CASCADE;
