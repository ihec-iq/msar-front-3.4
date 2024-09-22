import type { IUser } from "../user/IUser";
import type { IEmployee, IEmployeeLite } from "../employee/IEmployee";
import type { IDocument } from "../archive/IArchive";

export interface IBonuses {
  id: number;
  title: string;
  issueDate: string;
  Employee: IEmployeeLite;
  Type: IBonusesType;
  Files?: Array<IDocument>;
  addDays?: number;
  UserCreate?: IUser;
  UserUpdate?: IUser;
}

export interface IBonusesType {
  id: number;
  name: string;
  addDays?: number;
}
export interface IBonusesFilter {
  title: string;
  limit: number;
  checked?: boolean;
  employeeId?: number;
  employeeName?: string;
}