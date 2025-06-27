import { Request, Response } from "express";
import * as userService from "../services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      message: "success",
      data: users,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone) {
      res.status(400).json({ message: "name and phone are required" });
      return;
    }

    const existing = await userService.findUserByWhatsAppNumber(phone);
    if (existing) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const user = await userService.createUser({
      name,
      phone,
      email,
      address,
      rtId: "1",
      role: "WARGA",
    });

    res.status(201).json({
      message: "Success create user",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
