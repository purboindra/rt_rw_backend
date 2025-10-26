import { Prisma } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import prisma from "../db";
import { logger } from "../logger";
import { CreateReportInput, getReportQuery } from "../schemas/report.schema";

const TZ = "Asia/Jakarta";

function todayKey(date = new Date()): string {
  return formatInTimeZone(date, TZ, "yyyyMMdd");
}

function buildReportId(seq: number, dateKey: string): string {
  return `REP/${String(seq).padStart(6, "0")}-${dateKey}`;
}

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
