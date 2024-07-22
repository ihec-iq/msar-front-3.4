import type { IItem } from "../item/IItem";
import type { ISection } from "@/project/section/ISection";
import type { IStock } from "../warehouse/IStock";
import type { IUser } from "../user/IUser";
import type { IVacationDaily } from "../vacation/vacationDaily/IVacationDaily";
import type { IVacationSick } from "../vacation/vacationSick/IVacationSick";
import type { IVacationTime } from "../vacation/vacationTime/IVacationTime";

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
  Position: IEmployeePosition;
  Type: IEmployeeType;
  Center: IEmployeeCenter;
  initVacation: number;
  takeVacation: number;
  initVacationSick: number;
  takeVacationSick: number;
  User?:IUser;
  vacationDaily?: Array<IVacationDaily>;
  vacationSick?: Array<IVacationSick>;
  vacationTime?: Array<IVacationTime>;
}
export interface IEmployeeLite {
  id: number;
  name: string;
}
const xx = {
  voucherItemHistoriable: {
    id: 4,
    inputVoucherId: 2,
    itemId: 1,
    item: {
      id: 1,
      name: "ميز خشب",
      code: "A2152AA0001",
      description: "loren loren",
      itemCategory: {
        id: 1,
        name: "اجهزة كهربائية",
        description: "تختص بالاجهزة الكهربائية والالكترونية",
      },
      itemCategoryId: 1,
      measuringUnit: "Item",
    },
  },
};

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