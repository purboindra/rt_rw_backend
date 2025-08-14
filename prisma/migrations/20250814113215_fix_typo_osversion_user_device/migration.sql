/*
  Warnings:

  - You are about to drop the column `onVersion` on the `UserDevice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserDevice" DROP COLUMN "onVersion",
ADD COLUMN     "osVersion" TEXT;
