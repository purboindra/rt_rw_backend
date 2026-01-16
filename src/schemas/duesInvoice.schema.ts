import z from "zod";
import { InvoiceStatusEnum } from "../utils/enums";
import { baseQuery, houseHoldIdQuery, rtIdQuery } from "./general.schema";

export const generateInvoiceSchema = z.object({
  rtId: z.guid().min(1, "RT id diperlukan"),
  householdId: z.guid().min(1, "Household id diperlukan"),
  duesTypeId: z.guid().min(1, "Dues type diperlukan"),
  period: z.number().min(1, "Periode diperlukan"),

  dueDate: z.iso.datetime().optional(),
  //   status: z.preprocess(
  //     (val) => (typeof val === "string" ? val.trim().toUpperCase() : val),
  //     InvoiceStatusEnum.default("UNPAID"),
  //   ),
});

export type GenerateInvoiceInput = z.infer<typeof generateInvoiceSchema>;

export const updateStatusInvoiceSchema = z.object({
  status: z.literal("VOID"),
});

export type UpdateStatusInvoiceInput = z.infer<typeof updateStatusInvoiceSchema>;

export const updateDueDateInvoiceSchema = z.object({
  dueDate: z.iso.datetime().min(1, "Tanggal jatuh tempo tidak valid"),
});

export type UpdateDueDateInvoiceInput = z.infer<typeof updateDueDateInvoiceSchema>;

const getInvoiceQuery = z.object({
  status: InvoiceStatusEnum.optional(),
  period: z.int().optional(),
  householdId: z.guid().optional(),
  invoiceNo: z.string().optional(),
});

export const getDuesInvoice = baseQuery.merge(rtIdQuery).merge(houseHoldIdQuery).merge(getInvoiceQuery);
