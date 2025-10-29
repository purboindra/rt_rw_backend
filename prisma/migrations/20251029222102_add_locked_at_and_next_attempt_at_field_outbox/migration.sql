-- AlterTable
ALTER TABLE "public"."outbox" ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "nextAttemptAt" TIMESTAMP(3);
