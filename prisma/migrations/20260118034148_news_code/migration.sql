/*
  Warnings:

  - A unique constraint covering the columns `[news_no]` on the table `news` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "news" ADD COLUMN     "news_no" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "news_news_no_key" ON "news"("news_no");
