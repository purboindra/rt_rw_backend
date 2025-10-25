-- AlterTable
ALTER TABLE "public"."reportincident" ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "resolvedById" TEXT;
