import { sign, verify } from "jsonwebtoken";

const _JWT_SECRET = process.env.JWT_SECRET_KEY!;

export const generateAccessToken = (payload: {
  id: string;
  name: string;
  phone: string;
  role: string;
  address?: string;
  rtId: string;
  rtName?: string;
  rtAddress?: string;
  email?: string;
  isEmailVerified?: boolean;
}): string => {
  try {
    const token = sign(
      {
        user_id: payload.id,
        name: payload.name,
        role: payload.role,
        address: payload.address,
        rt_id: payload.rtId,
        rt_name: payload.rtName,
        rt_address: payload.rtAddress,
        email: payload.email,
        is_email_verified: payload.isEmailVerified,
      },
      _JWT_SECRET as string,
      { expiresIn: "15m" },
    );

    return token;
  } catch (error) {
    throw error;
  }
};

export const generateRefreshToken = (userId: string, rtId: string): string => {
  const token = sign(
    {
      user_id: userId,
      rt_id: rtId,
    },
    _JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  return token;
};

export const verifyJwt = (token: string) => {
  try {
    return verify(token, _JWT_SECRET as string);
  } catch (error) {
    throw error;
  }
};
