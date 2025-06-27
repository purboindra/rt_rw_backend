import { IActivity } from "./activity.interface";
import { IUser } from "./user.interface";

export interface IRt {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt?: Date;
  totalFunds: number;
  users: IUser[] | [];
  activities: IActivity[] | [];
}
