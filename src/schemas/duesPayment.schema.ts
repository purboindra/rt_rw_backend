import z from "zod";
import { PaymentMethodEnum, PaymentStatusEnum } from "../utils/enums";
import { baseQuery, houseHoldIdQuery } from "./general.schema";

export const createPaymentSchema = z.object({
  invoiceId: z.guid().min(1, "Invoice id tidak valid"),
  paidAmount: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().int().nonnegative().min(1, "Jumlah tagihan diperlukan"),
  ),
  paidAt: z.iso.datetime().min(1, "Tanggal pembayaran tidak valid"),
  method: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    PaymentMethodEnum.default("BANK_TRANSFER"),
  ),
  proofUrl: z.url().optional(),
  note: z.string().optional(),
  status: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
    PaymentStatusEnum.default("PENDING"),
  ),
  verifiedById: z.guid().optional(),
  verifiedAt: z.iso.datetime().optional(),
  rejectReason: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

const getPaymentQuery = z.object({
  status: PaymentStatusEnum.optional(),
  period: z.int().optional(),
  householdId: z.guid().optional(),
  invoiceNo: z.string().optional(),
});

export const getDuesPaymentQuery = baseQuery.merge(houseHoldIdQuery).merge(getPaymentQuery);

export const rejectPaymentSchema = z.object({
  rejectReason: z.string().min(1, "Alasan reject diperlukan"),
});
