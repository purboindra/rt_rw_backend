/*
  Warnings:

  - You are about to drop the column `houseHoldsId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_houseHoldsId_fkey";

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "houseHoldsId",
ADD COLUMN     "houseHoldId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_houseHoldId_fkey" FOREIGN KEY ("houseHoldId") REFERENCES "public"."households"("id") ON DELETE SET NULL ON UPDATE CASCADE;
