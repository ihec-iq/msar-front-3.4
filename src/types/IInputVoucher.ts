import type { IItem } from "./IItem";
import type { IStock } from "./IStock";

export interface IInputVoucher {
  id: number;
  number: string;
  date: String;
  notes: string;
  state: IInputVoucherState;
  items?: Array<IInputVoucherItem>;
  signaturePerson: String;
  employeeRequestId: number;
  employeeRequest: IInputVoucherEmployee;
  inputVoucherStateId: number;
  itemsCount?: number;
}
export interface IInputVoucherItem {
  id?: number;
  input_voucher_id?: number;
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
export interface IInputVoucherEmployee {
  id: number;
  name: string;
}
export interface IInputVoucherState {
  id: number;
  name: string;
}
export interface IInputVoucherFilter {
  id?: number;
  name: string;
  limit: number;
  description?: String;
}
