import { Prisma } from "@prisma/client";
import prisma from "../db";
import { logger } from "../logger";
import { CreateNewsInput, updateNewsSchema } from "../schemas/news.schema";
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

export const getAllnews = async () => {
  try {
    const response = await prisma.news.findMany({
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
    const response = await prisma.news.findUnique({
      where: {
        id: newsId,
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

export const deleteNewsById = async (newsId: string) => {
  try {
    await prisma.news.delete({
      where: {
        id: newsId,
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
