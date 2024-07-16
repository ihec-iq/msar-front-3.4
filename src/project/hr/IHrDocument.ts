import type { IUser } from "../user/IUser";
import type { IEmployee } from "../employee/IEmployee";

export interface IHrDocument {
  id: number;
  title: string;
  dateIssue: string;
  Employee: IEmployee;
  Type: IHrHocumentType;
  addDays?: number;
  UserCreate?: IUser;
  UserUpdate?: IUser;
}

export interface IHrHocumentType {
  id: number;
  name: string;
  addDays?: number;
}
export interface IHrDocumentFilter {
  title: string;
  limit: number;
  checked?: boolean;
  employeeId?: number;
  employeeName?: string;
}