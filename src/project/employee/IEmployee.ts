import type { IItem } from "../item/IItem";
import type { ISection } from "@/project/section/ISection";
import type { IStock } from "../warehouse/IStock";
import type { IUser } from "../user/IUser";
import type { IVacationDaily } from "../vacation/vacationDaily/IVacationDaily";
import type { IVacationSick } from "../vacation/vacationSick/IVacationSick";
import type { IVacationTime } from "../vacation/vacationTime/IVacationTime";
import type { IBonusDegreeStage, IBonusJobTitle, IBonusStudy } from "../bonus/IBonus";
import type { IDocument } from "../archive/IArchive";

export interface IEmployee {
  id: number;
  name: string;
  Section: ISection;
  MoveSection: ISection;
  isMoveSection : number;
  isPerson: number;
  dateWork: string;
  number: string;
  idCard: string;
  telegram?: string;
  EmployeePosition: IEmployeePosition;
  EmployeeType: IEmployeeType;
  EmployeeCenter: IEmployeeCenter;
  initVacation: number;
  takeVacation: number;
  initVacationSick: number;
  takeVacationSick: number;
  User?:IUser;
  vacationDaily?: Array<IVacationDaily>;
  vacationSick?: Array<IVacationSick>;
  vacationTime?: Array<IVacationTime>;
  issueDate?:string;
  BonusJobTitle?: IBonusJobTitle;
  BonusStudy?: IBonusStudy;
  BonusDegreeStage?: IBonusDegreeStage;
  Files?: Array<IDocument>;
  numberLastBonus?: string;
  dateLastBonus?: string;
  dateNextBonus?: string;
  isChecked?: boolean;
}
export interface IEmployeeBonus {
  id: number;
  name: string;
  employeePosition: string;
  employeeType: string;
  employeeCenter: string;
  bonusJobTitle: string;
  bonusStudy: string;
  bonusDegreeStage: string;
  numberLastBonus: string;
  dateLastBonus: string;
  difNextDate:string;
  dateNextBonus: string;
}
export interface IEmployeeLite {
  id: number;
  name: string;
}
export interface IEmployeeLiteBonus {
  id: number;
  name: string;
  dateLastBonus: string;
  dateNextBonus: string;
  numberLastBonus: string;
  BonusDegreeStage: IBonusDegreeStage;
  BonusJobTitle: IBonusJobTitle;
  BonusStudy: IBonusStudy;
}

export interface IEmployeeHistory {
  id: number;
  type: string;
  inputVoucherItemId: number;
  voucherItemHistoriableId: number;
  voucherItemHistoriableType: string;
  price: number;
  count: number;
  notes: string;
  Employee: IEmployee;
  Voucher: {
    idVoucher: number;
    date: string;
    Item: IItem;
    Stock: IStock;
    description: string;
  };
}
export interface IEmployeeFilter {
  name: string;
  sectionId?: number;
  isPerson?: number;
  limit: number;
  checked?: boolean;
  employeeId?: number;
}
export interface IEmployeeType {
  id: number; 
  name: string; 
}
export interface IEmployeeCenter {
  id: number; 
  name: string; 
  code: string; 
}
export interface IEmployeePosition {
  id: number; 
  name: string; 
  level: string; 
  code: string; 
}