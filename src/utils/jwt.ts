import { sign, verify } from "jsonwebtoken";
import { IUser } from "../models/user.interface";

export const generateAccessToken = (user: IUser): string => {
  const token = sign(
    {
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      address: user.address,
    },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "15m" }
  );

  return token;
};

export const generateRefreshToken = (userId: string): string => {
  const token = sign(
    {
      user_id: userId,
    },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "7d" }
  );

  return token;
};

export const verifyJwt = (token: string) => {
  return verify(token, process.env.JWT_SECRET_KEY as string);
};
