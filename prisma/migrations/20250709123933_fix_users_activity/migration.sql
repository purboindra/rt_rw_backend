/*
  Warnings:

  - You are about to drop the column `userId` on the `Activity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_ActivityToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActivityToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ActivityToUser_B_index" ON "_ActivityToUser"("B");

-- AddForeignKey
ALTER TABLE "_ActivityToUser" ADD CONSTRAINT "_ActivityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToUser" ADD CONSTRAINT "_ActivityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
