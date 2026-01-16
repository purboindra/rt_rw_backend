import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rtId = "cbf89fb0-b1ee-4c3e-b155-60138d0ea59a";
  const iplID = "e447cb71-c943-41cd-8f37-ae9ec609fc5e";
  const infaqId = "fc9d29eb-06bb-46c2-af72-4e6dc33f16cd";
  const securityId = "61c3f259-c8db-4709-bb9b-4d95e631fe93";

  await prisma.rt.upsert({
    where: {
      id: rtId,
    },
    update: {
      id: rtId,
    },
    create: {
      id: rtId,
      name: "RT 15",
      address: "Jl. Flamboyan XVII",
    },
  });

  await prisma.user.upsert({
    where: { phone: "080000000001" },
    update: {},
    create: {
      name: "Admin RT",
      phone: "080000000001",
      address: "",
      role: "ADMIN",
      rtId: rtId,
      isVerified: true,
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: {
      phone: "080000000002",
    },
    update: {},
    create: {
      name: "John Doe",
      role: "BENDAHARA",
      phone: "080000000002",
      rtId: rtId,
      isVerified: true,
      email: "johndoe@gmail.com",
      address: "",
    },
  });

  await prisma.user.upsert({
    where: {
      phone: "080000000003",
    },
    update: {},
    create: {
      name: "Jane Doe",
      role: "WARGA",
      phone: "080000000003",
      rtId: rtId,
      isVerified: true,
      email: "janedoe@gmail.com",
      address: "",
    },
  });

  await prisma.duesType.upsert({
    where: {
      id: iplID,
    },
    update: {},
    create: {
      name: "IPL",
      rtId: rtId,
      defaultAmount: 200000,
      code: "DT01",
    },
  });

  await prisma.duesType.upsert({
    where: {
      id: infaqId,
    },
    update: {},
    create: {
      name: "Infaq Mushola",
      rtId: rtId,
      defaultAmount: 0,
      code: "DT02",
    },
  });

  await prisma.duesType.upsert({
    where: {
      id: securityId,
    },
    update: {},
    create: {
      name: "Keamanan dan Kebersihan",
      rtId: rtId,
      defaultAmount: 0,
      code: "DT03",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
