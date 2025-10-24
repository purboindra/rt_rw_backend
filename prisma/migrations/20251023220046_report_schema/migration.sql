-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "public"."reportincident" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'OPEN',
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reportincident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reportcounter" (
    "rtId" TEXT NOT NULL,
    "yyyymmdd" TEXT NOT NULL,
    "lastNo" INTEGER NOT NULL,

    CONSTRAINT "reportcounter_pkey" PRIMARY KEY ("rtId")
);

-- CreateIndex
CREATE UNIQUE INDEX "reportincident_reportId_key" ON "public"."reportincident"("reportId");

-- CreateIndex
CREATE INDEX "reportincident_rtId_createdAt_idx" ON "public"."reportincident"("rtId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "reportcounter_rtId_yyyymmdd_key" ON "public"."reportcounter"("rtId", "yyyymmdd");

-- AddForeignKey
ALTER TABLE "public"."reportincident" ADD CONSTRAINT "reportincident_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
