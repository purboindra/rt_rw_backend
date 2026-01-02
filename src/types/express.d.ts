import { JwtPayload } from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    user_id: string;
    name: string;
    rt_id: string;
    household_id: string;
    role: string;
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
      access_token?: string;
    }
  }
}
