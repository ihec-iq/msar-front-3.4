import type { IItem } from "../item/IItem";
import type { ISection } from "@/project/section/ISection";
import type { IStock } from "../warehouse/settingVoucher/stock/IStock";
import type { IUser } from "../user/IUser";
import type { IVacationDaily } from "../vacation/vacationDaily/IVacationDaily";
import type { IVacationSick } from "../vacation/vacationSick/IVacationSick";
import type { IVacationTime } from "../vacation/vacationTime/IVacationTime";
import type { IDegreeStage, IBonusJobTitle, IStudy, ICertificate } from "../bonus/IBonus";
import type { IDocument } from "../archive/IArchive";
import type { IEmployeeType } from "./setting/employeeType/IEmployeeType";
import type { IEmployeeCenter } from "./setting/employeeCenter/IEmployeeCenter";
import type { IEmployeePosition } from "./setting/employeePosition/IEmployeePosition";

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
  telegramId?: string;
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
  Study?: IStudy;
  Certificate?: ICertificate;
  DegreeStage?: IDegreeStage;
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
  Study: string;
  DegreeStage: string;
  numberLastBonus: string;
  dateLastBonus: string;
  difNextBonusDate:string;
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
  DegreeStage: IDegreeStage;
  BonusJobTitle: IBonusJobTitle;
  Study: IStudy;
}
export interface IEmployeeLitePromotion {
  id: number;
  name: string;
  dateLastPromotion: string;
  dateNextPromotion: string;
  numberLastPromotion: string;
  DegreeStage: IDegreeStage;
  BonusJobTitle: IBonusJobTitle;
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
 
  