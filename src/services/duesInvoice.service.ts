import { Prisma } from "@prisma/client";
import prisma from "../db";
import { GenerateInvoiceInput, getDuesInvoice, UpdateDueDateInvoiceInput } from "../schemas/duesInvoice.schema";
import { AppError } from "../utils/errors";

export const generateInvoice = async (params: GenerateInvoiceInput) => {
  try {
    const response = await prisma.duesInvoice.create({
      data: {
        rtId: params.rtId,
        householdId: params.householdId,
        duesTypeId: params.duesTypeId,
        period: params.period,
        amount: params.amount,
        dueDate: params.dueDate ? new Date(params.dueDate) : null,
        status: "UNPAID",
      },
    });

    return response;
  } catch (error: any) {
    if (error?.code === "P2002") {
      throw new AppError("Invoice untuk periode tersebut sudah dibuat", 400);
    }
    throw error;
  }
};

export const updateStatusInvoice = async (id: string) => {
  try {
    await prisma.duesInvoice.update({
      where: {
        id: id,
      },
      data: { status: "VOID" },
    });
  } catch (error) {
    throw error;
  }
};

export const updateDueDateInvoice = async (id: string, params: UpdateDueDateInvoiceInput) => {
  try {
    await prisma.duesInvoice.update({
      where: {
        id: id,
      },
      data: { dueDate: new Date(params.dueDate) },
    });
  } catch (error) {
    throw error;
  }
};

export const getMyInvoices = async (viewerHouseholdId: string, rawQuery: unknown) => {
  try {
    const query = getDuesInvoice.parse(rawQuery);

    const q = query?.q?.trim();

    const where: Prisma.DuesInvoiceWhereInput = {
      deletedAt: null,
      householdId: viewerHouseholdId,
      ...(query.rtId ? { rtId: query.rtId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.period ? { period: query.period } : {}),
      ...(query.householdId ? { householdId: query.householdId } : {}),
      ...(q
        ? {
            OR: [
              ...(Number.isFinite(Number(q)) ? [{ period: Number(q) }] : []),
              { householdId: q },
              { duesTypeId: q },
              {
                household: {
                  address: { contains: q, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    };

    const response = await prisma.duesInvoice.findMany({
      where,
      select: {
        id: true,
        rtId: true,
        household: {
          select: {
            id: true,
            address: true,
            users: {
              select: {
                email: true,
                phone: true,
                id: true,
                address: true,
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

export const getAdminInvoices = async (viewerRtId: string, rawQuery: unknown) => {
  try {
    const query = getDuesInvoice.parse(rawQuery);

    const q = query?.q?.trim();

    const where: Prisma.DuesInvoiceWhereInput = {
      deletedAt: null,
      rtId: viewerRtId,
      ...(query.rtId ? { rtId: query.rtId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.period ? { period: query.period } : {}),
      ...(query.householdId ? { householdId: query.householdId } : {}),
      ...(q
        ? {
            OR: [
              ...(Number.isFinite(Number(q)) ? [{ period: Number(q) }] : []),
              { householdId: q },
              { duesTypeId: q },
              {
                household: {
                  address: { contains: q, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    };

    const response = await prisma.duesInvoice.findMany({
      where,
      select: {
        id: true,
        rtId: true,
        household: {
          select: {
            id: true,
            address: true,
            users: {
              select: {
                email: true,
                phone: true,
                id: true,
                address: true,
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

export const getMyInvoiceById = async (invoiceId: string, viewerHouseholdId: string) => {
  return prisma.duesInvoice.findFirst({
    where: {
      id: invoiceId,
      householdId: viewerHouseholdId,
      deletedAt: null,
    },
    include: {
      duesType: true,
      payments: true,
    },
  });
};

export const getAdminInvoiceById = async (invoiceId: string, viewerRtId: string) => {
  return prisma.duesInvoice.findFirst({
    where: {
      id: invoiceId,
      rtId: viewerRtId,
      deletedAt: null,
    },
    include: {
      duesType: true,
      household: { include: { users: true } },
      payments: true,
    },
  });
};
