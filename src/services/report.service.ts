import { formatInTimeZone } from "date-fns-tz";
import prisma from "../db";
import { logger } from "../logger";
import { CreateReportInput } from "../schemas/report.schema";

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
    const rows = await prisma.reportIncident.findMany({
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows;
  } catch (error) {
    logger.error({ error }, "Failed to get all reports");
    throw error;
  }
};
