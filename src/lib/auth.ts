import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import prisma from "../../prisma/client";
import { sendOtpToService } from "../services/auth.service";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }, request) => {
        console.log("sendOTP", phoneNumber, code);
        try {
          // await sendOtpToService(phoneNumber, code);
          return Promise.resolve();
        } catch (error) {
          console.error("Error sending OTP to service:", error);
          return Promise.reject(error);
        }
      },
    }),
  ],
});
