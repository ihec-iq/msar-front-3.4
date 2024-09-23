import type { IUser } from "../user/IUser";
import type { IEmployeeLite } from "../employee/IEmployee";
import type { IDocument } from "../archive/IArchive";

export interface IBonuses {
  id: number;
  title: string;
  issueDate: string;
  Employee: IEmployeeLite;
  BonusJobTitle: IBonusesBonusJobTitle;
  BonusStudy: IBonusesBonusStudy;
  BonusDigreeStage: IBonusesDigreeStage;
  Files?: Array<IDocument>;
  numberLastBounues: number;
  dateLastBounues: string;
  dateLastWorth: string;
  dateNextWorth: string;
  UserCreate?: IUser;
  UserUpdate?: IUser;
  notes: string;
}

export interface IBonusesBonusJobTitle {
  id: number;
  name: string;
}
export interface IBonusesBonusStudy {
  id: number;
  name: string;
}
export interface IBonusesDigreeStage {
  id: number;
  name: string;
}
export interface IBonusesFilter {
  title: string;
  limit: number;
  checked?: boolean;
  employeeId?: number;
  employeeName?: string;
}