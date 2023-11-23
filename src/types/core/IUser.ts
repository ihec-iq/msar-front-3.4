import type IRole from "@/types/role/IRole";
import type { IVacationDaily } from "../vacation/IVacationDaily";
import type { IVacationTime } from "../vacation/IVacationTime";
import type { IVacationSick } from "../vacation/IVacationSick";
import type { ISection } from "../ISection";
export interface IUser {
  name: string;
  email: string;
  last_login: string;
  password: string;
  password_confirmation?: string;
  any_device: number;
  active: number;
  roles: Array<IRole>;
  profile?: IUserProfile;
  permissions: Array<string>;
  id: number;
}
export interface IUserProfile {
  id: number;
  name: string;
  section: ISection;
  vacationDaily?: Array<IVacationDaily>;
  vacationSick?: Array<IVacationSick>;
  vacationTime?: Array<IVacationTime>;
}
