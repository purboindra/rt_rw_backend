import { JwtPayload } from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    user_id: string;
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
