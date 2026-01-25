import { Prisma } from "@prisma/client";
import prisma from "../db";
import { logger } from "../logger";
import { GenerateInvoiceInput, getDuesInvoice, UpdateDueDateInvoiceInput } from "../schemas/duesInvoice.schema";
import { AppError } from "../utils/errors";

export const generateInvoiceAsAdmin = async (params: GenerateInvoiceInput) => {
  try {
    await prisma.$transaction(async (tx) => {
      const counter = await tx.invoiceCounter.upsert({
        where: {
          rtId_duesTypeId_period: {
            rtId: params.rtId,
            duesTypeId: params.duesTypeId,
            period: params.period,
          },
        },
        create: {
          rtId: params.rtId,
          duesTypeId: params.duesTypeId,
          period: params.period,
          lastNo: 1,
        },
        update: {
          lastNo: {
            increment: 1,
          },
        },
      });

      const [rt, duesType] = await Promise.all([
        tx.rt.findUnique({ where: { id: params.rtId }, select: { code: true, id: true, name: true } }),
        tx.duesType.findUnique({ where: { id: params.duesTypeId }, select: { code: true, defaultAmount: true } }),
      ]);

      if (!rt?.code) throw new AppError("RT tidak ditemukan", 404);
      if (!duesType?.code) throw new AppError("Tipe tagihan tidak ditemukan", 404);

      const invoiceNo = `INV/${rt.code}/${params.period}/${duesType.code}/${String(counter.lastNo).padStart(6, "0")}`;

      return tx.duesInvoice.create({
        data: {
          rtId: params.rtId,
          householdId: params.householdId,
          duesTypeId: params.duesTypeId,
          period: params.period,
          amount: duesType.defaultAmount,
          dueDate: params.dueDate ? new Date(params.dueDate) : null,
          invoiceNo,
        },
      });
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      throw new AppError("Invoice untuk periode tersebut sudah dibuat", 400);
    }
    throw error;
  }
};

export const voidInvoiceAsAdmin = async (id: string) => {
  try {
    return await prisma.duesInvoice.update({
      where: {
        id: id,
      },
      data: { status: "VOID" },
    });
  } catch (error) {
    throw error;
  }
};

export const paidInvoiceAsAdmin = async (id: string) => {
  try {
    return await prisma.duesInvoice.update({
      where: {
        id: id,
      },
      data: { status: "PAID" },
    });
  } catch (error) {
    throw error;
  }
};

export const updateInvoiceDueDateAsAdmin = async (id: string, params: UpdateDueDateInvoiceInput) => {
  try {
    return await prisma.duesInvoice.update({
      where: {
        id: id,
      },
      data: { dueDate: new Date(params.dueDate) },
    });
  } catch (error) {
    throw error;
  }
};

export const getInvoicesAsResident = async (viewerHouseholdId: string, rawQuery: unknown) => {
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
      ...(query.invoiceNo
        ? {
            invoiceNo: {
              contains: query?.invoiceNo,
              mode: "insensitive",
            },
          }
        : {}),
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

    logger.info({ where, invoiceNo: query.invoiceNo });

    const response = await prisma.duesInvoice.findMany({
      where,
      select: {
        id: true,
        invoiceNo: true,
        status: true,
        // rtId: true,
        duesType: {
          select: {
            defaultAmount: true,
            name: true,
            code: true,
          },
        },
        // household: {
        //   select: {
        //     id: true,
        //     address: true,
        //     users: {
        //       select: {
        //         email: true,
        //         phone: true,
        //         id: true,
        //         address: true,
        //       },
        //     },
        //   },
        // },
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getInvoicesAsAdmin = async (viewerRtId: string, rawQuery: unknown) => {
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

export const getInvoiceByIdAsResident = async (invoiceId: string, viewerHouseholdId: string) => {
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

export const getInvoiceByIdAsAdmin = async (invoiceId: string, viewerRtId: string) => {
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
