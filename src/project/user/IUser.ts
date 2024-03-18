import type IRole from "@/project/role/IRole";
import type { IEmployee } from "../employee/IEmployee";
export interface IUser {
  id: number;
  name: string;
  user_name: string;
  email: string;
  phone: string;
  code: string;
  created: string;
  expire_date: string;
  password?: string;
  password_confirmation?: string;
  active?: number;
  any_device?: number;
  roles: Array<IRole>;
  permissions: Array<string>;
  Employee?: IEmployee;
}
export interface IUserFilter {
  limit: number;
  name: string;
  email?: string;
}
export interface IUserProfile {}
