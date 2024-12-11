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
  checked: boolean;
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
  employeeSection: string;
  employeeDepartment: string;
  employeeType: string;
  bonusJobTitle: string;
  study: string;
  certificate: string;
  degreeStage: string;
  stage: string;
  degree: string;
  salary: string;
  degreeStageNext: string;
  stageNext: string;
  degreeNext: string;
  salaryNext: string;
  notes: string;
  notesNext: string;
  lastBonus: IBonusChecker;
}
export interface IBonusChecker {
  id: number;
  issueDate: string;
  number: string;
  employee: string;
  DegreeStage: IDegreeStage;
  UserCreate?: IUser;
  UserUpdate?: IUser;
  notes: string;
}
export interface IBonusJobTitle {
  id: number;
  name: string;
  description: string;
}
export interface IStudy {
  id: number;
  name: string;
}
export interface ICertificate {
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
  salary: number;
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