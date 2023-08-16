import type { IInputVoucherItem } from "./IInputVoucher";

export interface IOutputVoucher {
  id: number;
  number: string;
  date: String;
  notes: string;
  items: Array<IOutputVoucherItem>;
  signaturePerson: String;
  employeeRequest: IOutputVoucherEmployee;
  itemsCount?: number;
}
export interface IOutputVoucherItem {
  id?: number;
  outputVoucherId?: number;
  inputVoucherItem: IInputVoucherItem;
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
  description?: String;
}
