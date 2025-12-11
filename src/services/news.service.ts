import { Prisma } from "@prisma/client";
import prisma from "../db";
import { logger } from "../logger";
import { CreateNewsInput, getNewsQuery, updateNewsSchema } from "../schemas/news.schema";
import { AppError } from "../utils/errors";
import { pruneUndefined } from "../utils/helper";

export const createNews = async (params: CreateNewsInput) => {
  try {
    await prisma.news.create({
      data: {
        title: params.title,
        description: params.description,
        body: params.body,
        authorId: params.authorId,
        rtId: params.rtId,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error creating news:");
    throw error;
  }
};

export const getAllnews = async (rawQuery: unknown) => {
  try {
    const query = getNewsQuery.parse(rawQuery);

    const where: Prisma.NewsWhereInput = {
      ...{ deletedAt: null },
      ...(query?.rtId && { rtId: query.rtId }),
      ...(query?.q && {
        OR: [{ title: { contains: query.q, mode: "insensitive" } }],
      }),
    };

    const response = await prisma.news.findMany({
      take: query?.limit,
      where,
      orderBy: [{ createdAt: query?.order }, { id: query?.order }],
      include: {
        rt: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Error fetching news:");
    throw error;
  }
};

export const findNewsById = async (newsId: string) => {
  try {
    const response = await prisma.news.findFirst({
      where: {
        id: newsId,
        deletedAt: null,
      },
      include: {
        rt: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    if (!response) {
      throw new AppError("News not found", 404);
    }

    return response;
  } catch (error) {
    logger.error({ error }, "Error fetching news by id:");
    throw error;
  }
};

export const deleteNewsById = async (newsId: string, userId: string) => {
  try {
    await prisma.news.update({
      where: {
        id: newsId,
      },
      data: {
        deletedAt: new Date(),
        deletedById: userId,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error deleting news by id:");
    throw error;
  }
};

export const updateNews = async (id: string, raw: unknown) => {
  try {
    const news = await findNewsById(id);

    if (!news) {
      throw new AppError("News not found", 404);
    }

    const input = updateNewsSchema.parse(raw);

    const data: Prisma.NewsUpdateInput = pruneUndefined({
      body: input.body,
      description: input.description,
      title: input.title,
    });

    const response = await prisma.news.update({
      where: {
        id: id,
      },
      data,
    });

    return response;
  } catch (error) {
    throw error;
  }
};
