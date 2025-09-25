import prisma from "../db";
import { logger } from "../logger";
import { bannerCreateSchema, updateBannerSchema } from "../schemas/banner.schema";

export const getAllBanners = async (rawQuery: unknown) => {
  try {
    const response = await prisma.banner.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to get all banners");
    throw error;
  }
};

export const getBannerById = async (id: string) => {
  try {
    const response = await prisma.banner.findFirst({
      where: {
        id: id,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to get banner by id");
    throw error;
  }
};

export const createBanner = async (rawQuery: unknown) => {
  try {
    const query = bannerCreateSchema.parse(rawQuery);

    const response = await prisma.banner.create({
      data: {
        ...query,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to create banner");
    throw error;
  }
};

export const updateBanner = async (rawQuery: unknown, bannerId: string) => {
  try {
    const query = updateBannerSchema.parse(rawQuery);

    const response = await prisma.banner.update({
      where: {
        id: bannerId,
      },
      data: {
        ...query,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to update banner");
    throw error;
  }
};

export const deleteBanner = async (bannerId: string) => {
  try {
    const response = await prisma.banner.delete({
      where: {
        id: bannerId,
      },
    });

    return response;
  } catch (error) {
    logger.error({ error }, "Failed to delete banner");
    throw error;
  }
};

export const softDeleteBanner = async (bannerId: string, userId: string) => {
  try {
    const row = await prisma.banner.update({
      where: {
        id: bannerId,
      },
      data: {
        deletedAt: new Date(),
        deletedById: userId,
        isActive: false,
      },
      select: {
        id: true,
        deletedAt: true,
        deletedById: true,
      },
    });

    return row;
  } catch (error) {
    logger.error({ error }, "Failed to delete banner");
    throw error;
  }
};
