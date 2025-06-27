import { IRt } from "./rt.interface";

export interface INews {
  id: string;
  title: string;
  description?: string;
  body: string;
  authorId: string;
  rt: IRt;
  createdAt: Date;
  updatedAt: Date;
}
