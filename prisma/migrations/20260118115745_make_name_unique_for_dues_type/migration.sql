/*
  Warnings:

  - A unique constraint covering the columns `[name,rtId]` on the table `dues_types` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "dues_types_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "dues_types_name_rtId_key" ON "dues_types"("name", "rtId");
