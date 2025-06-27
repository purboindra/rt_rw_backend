import prisma from "../prisma/client";

interface CreateUserInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export const getAllUsers = () => {
  return prisma.user.findMany();
};

export const findUserByWhatsAppNumber = (whatsAppNumber: string) => {
  return prisma.user.findUnique({
    where: {
      phone: whatsAppNumber,
    },
  });
};

export const createUser = async (data: CreateUserInput) => {
  return await prisma.user.create({ data });
};
