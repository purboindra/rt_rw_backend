import { sign, verify } from "jsonwebtoken";

export const generateAccessToken = (payload: {
  id: string;
  name: string;
  phone: string;
  role: string;
  address?: string;
  rtId: string;
  rtName?: string;
  rtAddress?: string;
}): string => {
  try {
    const token = sign(
      {
        user_id: payload.id,
        name: payload.name,
        phone: payload.phone,
        role: payload.role,
        address: payload.address,
        rt_id: payload.rtId,
        rt_name: payload.rtName,
        rt_address: payload.rtAddress,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "15m" }
    );

    return token;
  } catch (error) {
    throw error;
  }
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
  try {
    return verify(token, process.env.JWT_SECRET_KEY as string);
  } catch (error) {
    throw error;
  }
};
