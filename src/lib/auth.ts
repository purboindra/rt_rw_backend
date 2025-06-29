import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import prisma from "../../prisma/client";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, request) => {
        console.log("sendOTP", phoneNumber, code);
        return Promise.resolve();
      },
    }),
  ],
});
