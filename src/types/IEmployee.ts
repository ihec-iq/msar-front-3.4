import type { IItem } from "./IItem";
import type { ISection } from "./ISection";
import type { IStock } from "./IStock";
import type { IUser } from "./core/IUser";
import type { IVacationDaily } from "./vacation/IVacationDaily";
import type { IVacationSick } from "./vacation/IVacationSick";
import type { IVacationTime } from "./vacation/IVacationTime";

export interface IEmployee {
  id: number;
  name: string;
  Section: ISection;
  isPerson: number;
  dateWork: string;
  number: string;
  idCard: string;
  Postion: IEmployeePostion;
  Type: IEmployeeType;
  initVacation: number;
  takeVacation: number;
  initVacationSick: number;
  takeVacationSick: number;
  User?:IUser;
  vacationDaily?: Array<IVacationDaily>;
  vacationSick?: Array<IVacationSick>;
  vacationTime?: Array<IVacationTime>;
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
    serialNumber: string;
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
export interface IEmployeePostion {
  id: number; 
  name: string; 
  level: string; 
  code: string; 
}