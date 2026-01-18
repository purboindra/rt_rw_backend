/*
  Warnings:

  - You are about to drop the `household` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dues_invoice" DROP CONSTRAINT "dues_invoice_householdId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_householdId_fkey";

-- DropTable
DROP TABLE "household";

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "StatusHouseholds" DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Household_rtId_idx" ON "Household"("rtId");

-- CreateIndex
CREATE UNIQUE INDEX "Household_rtId_key" ON "Household"("rtId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dues_invoice" ADD CONSTRAINT "dues_invoice_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
