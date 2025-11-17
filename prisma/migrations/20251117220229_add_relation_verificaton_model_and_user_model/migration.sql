/*
  Warnings:

  - You are about to drop the column `identifier` on the `verification` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `verification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `verification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."verification" DROP COLUMN "identifier",
DROP COLUMN "value",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_key" ON "public"."verification"("token");

-- CreateIndex
CREATE INDEX "verification_userId_email_idx" ON "public"."verification"("userId", "email");

-- AddForeignKey
ALTER TABLE "public"."verification" ADD CONSTRAINT "verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
