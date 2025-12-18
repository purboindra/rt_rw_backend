-- CreateEnum
CREATE TYPE "public"."StatusHouseholds" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "houseHoldsId" TEXT;

-- CreateTable
CREATE TABLE "public"."households" (
    "id" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "public"."StatusHouseholds" DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "households_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "households_userId_key" ON "public"."households"("userId");

-- AddForeignKey
ALTER TABLE "public"."households" ADD CONSTRAINT "households_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
