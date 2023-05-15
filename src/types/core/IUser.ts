import type IPermission from "@/types/role/role";
export default interface IUser {
  name: string;
  email: string;
  last_login: string;
  password: string;
  password_confirmation?: string;
  any_device: number;
  active: number;
  roles: Array<IPermission>;
  permissions: Array<string>;
  // roles: {
  //   id: number;
  //   name: string;
  // };
  id: number;
}
