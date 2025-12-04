import { Prisma } from "@prisma/client";
import prisma from "../db";
import { logger } from "../logger";
import { CreateReportInput, getReportQuery, updateReportSchema } from "../schemas/report.schema";
import * as outboxService from "../services/outbox.service";
import { AppError } from "../utils/errors";
import { buildReportId, pruneUndefined, todayKey } from "../utils/helper";

export const createReport = async (params: CreateReportInput) => {
  try {
    const yyyymmdd = todayKey();

    const [{ last_no }] = await prisma.$queryRaw<
      Array<{ last_no: number }>
    >`INSERT INTO reportcounter (rt_id, yyyymmdd, last_no)
     VALUES (${params.rtId}, ${yyyymmdd}, 1)
     ON CONFLICT (rt_id, yyyymmdd)
     DO UPDATE SET last_no = reportcounter.last_no + 1
     RETURNING last_no`;

    const reportId = buildReportId(last_no, yyyymmdd);

    const response = await prisma.reportIncident.create({
      data: {
        description: params.description,
        imageUrl: params.imageUrl,
        rtId: params.rtId,
        userId: params.userId,
        status: params.status,
        reportId: reportId,
        title: params.title,
      },
    });

    await outboxService.enqueueOutbox("report.created", {
      reportDbId: response.id,
      reportId: reportId,
      rtId: response.rtId,
      title: response.title,
      userId: response.userId,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllReports = async (rawQuery: unknown) => {
  try {
    const query = getReportQuery.parse(rawQuery);

    const where: Prisma.ReportIncidentWhereInput = {
      ...{ deletedAt: null },
      ...(query?.rtId && { rtId: query.rtId }),
      ...(query?.status && { status: query.status }),
      ...(query?.q && {
        OR: [{ title: { contains: query.q, mode: "insensitive" } }],
      }),
    };

    const rows = await prisma.reportIncident.findMany({
      where,
      take: query?.limit,
      orderBy: [{ createdAt: query?.order }, { id: query?.order }],
      select: {
        id: true,
        title: true,
        createdAt: true,
        rtId: true,
        imageUrl: true,
        description: true,
        status: true,
        userId: true,
        reportId: true,
        deletedAt: true,
        deletedById: true,
        resolvedAt: true,
        resolvedById: true,
        updatedAt: true,
        user: true,
      },
    });

    return rows;
  } catch (error) {
    logger.error({ error }, "Failed to get all reports");
    throw error;
  }
};

export const findReportById = async (id: string) => {
  try {
    const report = await prisma.reportIncident.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
      },
    });

    if (!report) throw new AppError("Report not found", 404);

    return report;
  } catch (error) {
    logger.error({ error }, "Error find report by id");
    throw error;
  }
};

export const deleteReport = async (id: string, userId: string) => {
  try {
    await prisma.reportIncident.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
        deletedById: userId,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateReport = async (id: string, raw: unknown) => {
  try {
    const report = await findReportById(id);

    if (!report) {
      throw new AppError("Report not found", 404);
    }

    const input = updateReportSchema.parse(raw);

    const data: Prisma.ReportIncidentUpdateInput = pruneUndefined({
      description: input.description,
      status: input.status,
      title: input.title,
      imageUrl: input.imageUrl,
    });

    const response = await prisma.reportIncident.update({
      where: {
        id: id,
      },
      data,
      select: { id: true, description: true, title: true, status: true },
    });

    return response;
  } catch (error) {
    throw error;
  }
};
