import type { IOutputVoucherItem } from "./IOutputVoucher";

export interface ICorruptedVoucher {
  id: number;
  number: string;
  date: String;
  notes: string;
  items: Array<ICorruptedVoucherItem>;
  signaturePerson: String;
  employeeRequest: ICorruptedVoucherEmployee;
  itemsCount?: number;
}
export interface ICorruptedVoucherItem {
  id?: number;
  outputVoucherId?: number;
  outputVoucherItem: IOutputVoucherItem;
  employeeRequest: ICorruptedVoucherEmployee;
  count: number;
  countWord?: string;
  price: number;
  value: number;
  notes: string;
}
// export interface ICorruptedVoucherItem {
//   id?: number;
//   outputVoucherId?: number;
//   outputVoucherItemId: number;
//   count: number;
//   countWord?: string;
//   price: number;
//   value: number;
//   notes: string;
// }
export interface ICorruptedVoucherEmployee {
  id: number;
  name: string;
}
export interface ICorruptedVoucherState {
  id: number;
  name: string;
}
export interface ICorruptedVoucherFilter {
  id?: number;
  name: string;
  limit: number;
  description?: String;
}
