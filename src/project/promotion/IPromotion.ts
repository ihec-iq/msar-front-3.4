import type { IUser } from "../user/IUser";
import type {  IEmployeeLitePromotion } from "../employee/IEmployee";
import type { IDocument } from "../archive/IArchive";
import type { IDegreeStage } from "../bonus/IBonus";

export interface IPromotion {
  id: number;
  issueDate: string;
  number: string;
  Employee: IEmployeeLitePromotion; 
  DegreeStage: IDegreeStage;
  Files?: Array<IDocument>;
  UserCreate?: IUser;
  UserUpdate?: IUser;
  notes: string;
}

 
export interface IPromotionFilter {
  title: string;
  limit: number;
  checked?: boolean;
  employeeId?: number;
  employeeName?: string;
  name?: string;
  isBound?:boolean;
  bound?: number;

}