-- AlterTable
ALTER TABLE "public"."News" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" TEXT;
