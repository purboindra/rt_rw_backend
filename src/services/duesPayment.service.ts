import { Prisma } from "@prisma/client";
import prisma from "../db";
import { CreatePaymentInput, getDuesPaymentQuery } from "../schemas/duesPayment.schema";
import { AppError } from "../utils/errors";
import { getInvoiceByIdAsResident, paidInvoiceAsAdmin } from "./duesInvoice.service";

export const createPaymentAsResident = async (
  viewerHouseholdId: string,
  viewerUserId: string,
  params: CreatePaymentInput,
) => {
  try {
    const invoice = await getInvoiceByIdAsResident(params.invoiceId, viewerHouseholdId);

    if (!invoice) {
      throw new AppError("Tagihan untuk nomor invoice ini tidak ada", 404);
    }

    const insvoiceStatus = invoice.status;

    if (["PAID", "VOID"].includes(insvoiceStatus)) {
      throw new AppError("Tagihan untuk nomor invoice ini sudah dibayarkan/dicancel", 409);
    }

    if (!invoice.duesType.isActive) {
      throw new AppError("Jenis tagihan ini sudah tidak aktif", 409);
    }

    const existingPending = await prisma.duesPayment.findFirst({
      where: {
        invoiceId: invoice.id,
        status: "PENDING",
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (existingPending) {
      throw new AppError("Kamu sudah memiliki pembayaran yang masih tertunda untuk invoice ini", 409);
    }

    const existingVerified = await prisma.duesPayment.findFirst({
      where: {
        invoiceId: invoice.id,
        status: "VERIFIED",
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (existingVerified) {
      throw new AppError("Pembayaran/invoice ini sudah diverifikasi. Kamu tidak bisa melakukan pembayaran ulang.", 409);
    }

    /// UNSUPPORT PARTIAL PAID
    if (params.paidAmount < invoice.amount) {
      throw new AppError(
        "Jumlah yang kamu bayarkan tidak sesuai dengan jumlah tagihan. Periksa kembali tagihan kamu.",
        409,
      );
    }

    return await prisma.duesPayment.create({
      data: {
        invoiceId: invoice.id,
        payerUserId: viewerUserId,
        paidAmount: params.paidAmount,
        paidAt: new Date(params.paidAt),
        method: params.method,
        proofUrl: params.proofUrl ?? null,
        note: params.note ?? null,
        status: "PENDING",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getAllPaymentsAsResident = async (viewerHouseholdId: string, rawQuery: unknown) => {
  try {
    const query = getDuesPaymentQuery.parse(rawQuery);

    const q = query.q?.trim();

    const where: Prisma.DuesPaymentWhereInput = {
      deletedAt: null,
      invoice: {
        householdId: viewerHouseholdId,
      },
      ...(query.status
        ? {
            status: query.status,
          }
        : {}),
      ...(q
        ? {
            OR: [
              { rejectReason: { contains: q, mode: "insensitive" } },
              {
                invoice: {
                  invoiceNo: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    };

    const response = await prisma.duesPayment.findMany({
      where,
      include: {
        invoice: {
          select: {
            invoiceNo: true,
            createdAt: true,
            household: {
              select: {
                users: {
                  select: {
                    email: true,
                    name: true,
                    phone: true,
                    address: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getPaymentsByIdAsResident = async (viewerHouseholdId: string, id: string) => {
  try {
    const response = await prisma.duesPayment.findMany({
      where: {
        id: id,
        invoice: {
          householdId: viewerHouseholdId,
        },
      },
      include: {
        invoice: true,
        payer: true,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllPaymentsAsAdmin = async (rawQuery: unknown) => {
  try {
    const query = getDuesPaymentQuery.parse(rawQuery);

    const q = query.q?.trim();

    const where: Prisma.DuesPaymentWhereInput = {
      deletedAt: null,
      ...(query.status
        ? {
            status: query.status,
          }
        : {}),
      ...(q
        ? {
            OR: [
              { rejectReason: { contains: q, mode: "insensitive" } },
              {
                invoice: {
                  invoiceNo: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    };

    const response = await prisma.duesPayment.findMany({
      where,
      include: {
        invoice: {
          select: {
            invoiceNo: true,
            createdAt: true,
            household: {
              select: {
                users: {
                  select: {
                    email: true,
                    name: true,
                    phone: true,
                    address: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getPaymentsByIdAsAdmin = async (id: string) => {
  try {
    const response = await prisma.duesPayment.findFirst({
      where: {
        id: id,
      },
      include: {
        invoice: true,
        payer: true,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyPaymentAsAdmin = async (id: string) => {
  try {
    const payment = await getPaymentsByIdAsAdmin(id);

    if (!payment) {
      throw new AppError("Pembayaran tidak ketemu", 404);
    }

    const paymentStatus = payment.status;

    if (paymentStatus !== "PENDING") {
      throw new AppError("Pembayaran ini sudah ditolak/diverifikasi", 409);
    }

    const response = await prisma.duesPayment.update({
      where: {
        id,
      },
      data: {
        status: "VERIFIED",
      },
    });

    await paidInvoiceAsAdmin(payment.invoiceId);

    return response;
  } catch (error) {
    throw error;
  }
};

export const rejectPaymentAsAdmin = async (id: string, rejectReason: string) => {
  try {
    const payment = await getPaymentsByIdAsAdmin(id);

    if (!payment) {
      throw new AppError("Pembayaran tidak ketemu", 404);
    }

    const paymentStatus = payment.status;

    if (paymentStatus !== "PENDING") {
      throw new AppError("Pembayaran ini sudah ditolak/diverifikasi", 409);
    }

    const response = await prisma.duesPayment.update({
      where: {
        id,
      },
      data: {
        status: "REJECTED",
        rejectReason,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};
