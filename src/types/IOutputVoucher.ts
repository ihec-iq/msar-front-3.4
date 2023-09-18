import type { IInputVoucherItem } from "./IInputVoucher";
import type { IItem } from "./IItem";
import type { IStock } from "./IStock";

export interface IOutputVoucher {
  id: number;
  number: string;
  date: string;
  notes: string;
  items: Array<IOutputVoucherItem>;
  signaturePerson: string;
  Employee: IOutputVoucherEmployee;
  itemsCount?: number;
}
export interface IOutputVoucherItem {
  id?: number;
  outputVoucherId?: number;
  Item?: IItem;
  inputVoucherItemId: number;
  inputVoucherItem?: IInputVoucherItem;
  Employee: IOutputVoucherEmployee;
  Stock: IStock;
  serialNumber: string;
  count: number;
  countWord?: string;
  price: number;
  value: number;
  notes: string;
}
// export interface IOutputVoucherItem {
//   id?: number;
//   outputVoucherId?: number;
//   inputVoucherItemId: number;
//   count: number;
//   countWord?: string;
//   price: number;
//   value: number;
//   notes: string;
// }
export interface IOutputVoucherEmployee {
  id: number;
  name: string;
}
export interface IOutputVoucherState {
  id: number;
  name: string;
}
export interface IOutputVoucherFilter {
  id?: number;
  name: string;
  limit: number;
  description?: string;
}
