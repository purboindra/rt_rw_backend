import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient().$extends(withAccelerate());

export default prisma;
