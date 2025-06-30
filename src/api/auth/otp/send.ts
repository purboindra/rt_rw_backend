import { Request, Response } from "express";
import { auth } from "../../../lib/auth";

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ message: "phone number is required", data: null });
      return;
    }

    const response = await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber: phone,
      },
    });

    res.status(202).json({
      message: "Success send otp",
      data: response,
    });
  } catch (error) {
    console.error("Error send otp", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
