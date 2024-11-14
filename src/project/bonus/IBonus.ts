import type { IUser } from "../user/IUser";
import type {  IEmployeeLiteBonus } from "../employee/IEmployee";
import type { IDocument } from "../archive/IArchive";


export interface IBonus {
  id: number;
  issueDate: string;
  number: string;
  Employee: IEmployeeLiteBonus; 
  DegreeStage: IDegreeStage;
  Files?: Array<IDocument>;
  UserCreate?: IUser;
  UserUpdate?: IUser;
  notes: string;
}
export interface IBonusEmployeeChecker {
  id: number;
  name: string;
  numberLastBonus: string;
  dateLastBonus: string;
  dateNextBonus: string;
  difNextBonusDate: number;
  numberLastPromotion: string;
  dateLastPromotion: string;
  dateNextPromotion: string;
  difNextPromotionDate: number;
  employeePosition: string;
  employeeCenter: string;
  employeeType: string;
  bonusJobTitle: string;
  bonusStudy: string;
  degreeStage: string;
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
export interface IDegreeStage {
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