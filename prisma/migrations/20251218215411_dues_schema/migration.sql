-- CreateEnum
CREATE TYPE "public"."DuesFrequencey" AS ENUM ('MONTHLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'VOID');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CASH');

-- CreateTable
CREATE TABLE "public"."DuesType" (
    "id" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "frequency" "public"."DuesFrequencey" NOT NULL DEFAULT 'MONTHLY',
    "defaultAmount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DuesType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DuesInvoice" (
    "id" TEXT NOT NULL,
    "rtId" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "duesTypeId" TEXT NOT NULL,
    "period" TIMESTAMP(3),
    "amount" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DuesInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DuesPayment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "payerUserId" TEXT,
    "paidAmount" INTEGER NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "proofUrl" TEXT,
    "note" TEXT,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DuesPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DuesType_rtId_idx" ON "public"."DuesType"("rtId");

-- CreateIndex
CREATE INDEX "DuesInvoice_rtId_duesTypeId_idx" ON "public"."DuesInvoice"("rtId", "duesTypeId");

-- CreateIndex
CREATE INDEX "DuesInvoice_householdId_status_idx" ON "public"."DuesInvoice"("householdId", "status");

-- CreateIndex
CREATE INDEX "DuesInvoice_period_idx" ON "public"."DuesInvoice"("period");

-- CreateIndex
CREATE UNIQUE INDEX "DuesInvoice_householdId_duesTypeId_period_key" ON "public"."DuesInvoice"("householdId", "duesTypeId", "period");

-- CreateIndex
CREATE INDEX "DuesPayment_invoiceId_status_idx" ON "public"."DuesPayment"("invoiceId", "status");

-- CreateIndex
CREATE INDEX "DuesPayment_status_paidAt_idx" ON "public"."DuesPayment"("status", "paidAt");

-- AddForeignKey
ALTER TABLE "public"."DuesInvoice" ADD CONSTRAINT "DuesInvoice_duesTypeId_fkey" FOREIGN KEY ("duesTypeId") REFERENCES "public"."DuesType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DuesInvoice" ADD CONSTRAINT "DuesInvoice_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "public"."households"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DuesInvoice" ADD CONSTRAINT "DuesInvoice_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DuesPayment" ADD CONSTRAINT "DuesPayment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."DuesInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DuesPayment" ADD CONSTRAINT "DuesPayment_payerUserId_fkey" FOREIGN KEY ("payerUserId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DuesPayment" ADD CONSTRAINT "DuesPayment_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
