/*
  Warnings:

  - A unique constraint covering the columns `[rtId]` on the table `household` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "household_rtId_address_key";

-- CreateIndex
CREATE UNIQUE INDEX "household_rtId_key" ON "household"("rtId");
