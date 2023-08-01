import type { IItem } from "./IItem";
import type { IStock } from "./IStock";

export interface IOutputVoucher {
  id: number;
  number: string;
  date: String;
  notes: string;
  state: IOutputVoucherState;
  items: Array<IOutputVoucherItem>;
  signaturePerson: String;
  employeeRequestId: number;
  employeeRequest: IOutputVoucherEmployee;
  outputVoucherStateId: number;
  itemsCount?: number;
}
export interface IOutputVoucherItem {
  id?: number;
  output_voucher_id?: number;
  item: IItem;
  itemId?: number;
  stock: IStock;
  stockId?: number;
  serialNumber: String;
  count: number;
  price: number;
  value: number;
  notes?: String;
}
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
