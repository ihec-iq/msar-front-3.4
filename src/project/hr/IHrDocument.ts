import type { IUser } from "../user/IUser";
import type { IEmployee, IEmployeeLite } from "../employee/IEmployee";
import type { IDocument } from "../archive/IArchive";

export interface IHrDocument {
  id: number;
  title: string;
  issueDate: string;
  Employee: IEmployeeLite;
  Type: IHrDocumentType;
  Files?: Array<IDocument>;
  addDays: number;
  addMonths: number;
  UserCreate?: IUser;
  UserUpdate?: IUser;
  isActive:boolean
}

export interface IHrDocumentType {
  id: number;
  name: string;
  addDays?: number;
  addMonths?: number;
}
export interface IHrDocumentFilter {
  title: string;
  limit: number;
  checked?: boolean;
  employeeId?: number;
  employeeName?: string;
}