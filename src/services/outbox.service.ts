import prisma from "../db";

export const enqueueOutbox = async (type: string, payload: unknown) => {
  try {
    await prisma.outbox.create({
      data: {
        payload: payload as any,
        type: type,
      },
    });
  } catch (error) {
    throw error;
  }
};
