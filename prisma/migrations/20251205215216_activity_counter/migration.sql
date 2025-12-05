/*
  Warnings:

  - A unique constraint covering the columns `[activityId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Activity" ADD COLUMN     "activityId" TEXT;

-- CreateTable
CREATE TABLE "public"."activitycounter" (
    "rt_id" TEXT NOT NULL,
    "yyyymmdd" TEXT NOT NULL,
    "last_no" INTEGER NOT NULL,

    CONSTRAINT "activitycounter_pkey" PRIMARY KEY ("rt_id","yyyymmdd")
);

-- CreateIndex
CREATE UNIQUE INDEX "Activity_activityId_key" ON "public"."Activity"("activityId");
