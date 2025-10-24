/*
  Warnings:

  - The primary key for the `reportcounter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lastNo` on the `reportcounter` table. All the data in the column will be lost.
  - You are about to drop the column `rtId` on the `reportcounter` table. All the data in the column will be lost.
  - Added the required column `last_no` to the `reportcounter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rt_id` to the `reportcounter` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."reportcounter_rtId_yyyymmdd_key";

-- AlterTable
ALTER TABLE "public"."reportcounter" DROP CONSTRAINT "reportcounter_pkey",
DROP COLUMN "lastNo",
DROP COLUMN "rtId",
ADD COLUMN     "last_no" INTEGER NOT NULL,
ADD COLUMN     "rt_id" TEXT NOT NULL,
ADD CONSTRAINT "reportcounter_pkey" PRIMARY KEY ("rt_id", "yyyymmdd");
