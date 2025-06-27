import prisma from "../../prisma/client";

interface CreateRtInput {
  name: string;
  address: string;
  totalFunds?: number;
  users?: string[];
  activities?: string[];
  news?: string[];
}

export const createRt = async (data: CreateRtInput) => {
  return await prisma.rt.create({
    data: {
      name: data.name,
      address: data.address,
      totalFunds: data.totalFunds || 0,
      users: { connect: data.users?.map((id) => ({ id })) },
      activities: { connect: data.activities?.map((id) => ({ id })) },
      news: { connect: data.news?.map((id) => ({ id })) },
    },
  });
};
