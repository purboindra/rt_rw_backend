import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rtId = "cbf89fb0-b1ee-4c3e-b155-60138d0ea59a";

  await prisma.rt.upsert({
    where: {
      id: rtId,
    },
    update: {
      id: rtId,
    },
    create: {
      id: rtId,
      name: "RT 009",
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
      phone: "08888123456",
    },
    update: {},
    create: {
      name: "Jane Doe",
      role: "WARGA",
      phone: "08888123456",
      rtId: rtId,
      isVerified: true,
      email: "janedoe@gmail.com",
      address: "",
    },
  });

  await prisma.user.upsert({
    where: {
      phone: "089876543210",
    },
    update: {},
    create: {
      name: "John Doe",
      role: "BENDAHARA",
      phone: "089876543210",
      rtId: rtId,
      isVerified: true,
      email: "johndoe@gmail.com",
      address: "",
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
