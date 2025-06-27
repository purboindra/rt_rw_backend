import { IRt } from "./rt.interface";

export interface IActivity {
  id: string;
  title: string;
  description?: string;
  type: string;
  rt: IRt;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
