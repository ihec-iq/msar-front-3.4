import type { IUser } from "../user/IUser";
import type { IEmployeeLite } from "../employee/IEmployee";
import type { IDocument } from "../archive/IArchive";

export interface IBonus {
  id: number;
  issueDate: string;
  Employee: IEmployeeLite;
  BonusJobTitle: IBonusJobTitle;
  BonusStudy: IBonusStudy;
  BonusDegreeStage: IBonusDegreeStage;
  Files?: Array<IDocument>;
  numberBonus: string;
  dateWorth: string;
  UserCreate?: IUser;
  UserUpdate?: IUser;
  notes: string;
}

export interface IBonusJobTitle {
  id: number;
  name: string;
  description: string;
}
export interface IBonusStudy {
  id: number;
  name: string;
}
export interface IBonusDegree {
  id: number;
  name: string;
}
export interface IBonusStage {
  id: number;
  name: string;
}
export interface IBonusDegreeStage {
  id: number;
  title: string;
  Degree: IBonusDegree;
  Stage: IBonusStage;
  salery: number;
  yearlyBonus: number;
  yearlyService: number;
}
export interface IBonusFilter {
  title: string;
  limit: number;
  checked?: boolean;
  employeeId?: number;
  employeeName?: string;
  name?: string;
  isBound?:boolean;
  bound?: number;

}