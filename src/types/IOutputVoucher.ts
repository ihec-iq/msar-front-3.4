import type { IInputVoucherItem } from "./IInputVoucher";
import type { IStock } from "./IStock";

export interface IOutputVoucher {
  id: number;
  number: string;
  date: String;
  notes: string;
  items: Array<IOutputVoucherItem>;
  signaturePerson: String;
  employeeRequestId: number;
  employeeRequest: IOutputVoucherEmployee;
  itemsCount?: number;
}
export interface IOutputVoucherItem {
  id?: number;
  output_voucher_id?: number;
  input_voucher_item_id: number;
  input_voucher_item: IInputVoucherItem;
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
