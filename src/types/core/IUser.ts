import type IRole from "@/types/role/IRole";
import type { IEmployee } from "../IEmployee";
export interface IUser {
  name: string;
  email: string;
  last_login: string;
  password: string;
  password_confirmation?: string;
  any_device: number;
  active: number;
  roles: Array<IRole>;
  Employee?: IEmployee;
  permissions: Array<string>;
  id: number;
}
export interface IUserProfile {}
