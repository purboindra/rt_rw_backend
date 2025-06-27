import { INews } from "./news.interface";
import { IRt } from "./rt.interface";

export interface IUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  rt: IRt;
  news: INews[];
}
