-- AlterTable
ALTER TABLE "public"."Activity" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" TEXT;
