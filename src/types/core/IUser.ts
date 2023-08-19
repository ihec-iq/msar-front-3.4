import type IRole from "@/types/role/IRole";
export default interface IUser {
  name: string;
  email: string;
  last_login: string;
  password: string;
  password_confirmation?: string;
  any_device: number;
  active: number;
  roles: Array<IRole>;
  permissions: Array<string>;
  id: number;
}
