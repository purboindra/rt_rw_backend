import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "",
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter }).$extends(
  withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY || "" })
);

export default prisma;
