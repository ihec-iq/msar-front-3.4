import type { IItem } from "./IItem";
import type { ISection } from "./ISection";
import type { IStock } from "./IStock";

export interface IInputVoucher {
  id: number;
  number: string;
  date: String;
  notes: string;
  state: IInputVoucherState;
  items: Array<IInputVoucherItem>;
  signaturePerson: String;
  employeeRequestId: number;
  employeeRequest: IInputVoucherEmployee;
  inputVoucherStateId: number;
  itemsCount?: number;
}
export interface IInputVoucherItem {
  id?: number;
  inputVoucherId?: number;
  employeeRequest: IInputVoucherEmployee;
  item: IItem;
  itemId?: number;
  stock: IStock;
  stockId?: number;
  serialNumber: String;
  count: number;
  price: number;
  value: number;
  notes?: String;
  inValue?: number;
  outValue?: number;
}
export interface IInputVoucherItemVSelect {
  id?: number;
  itemName: string;
  stockName?: string;
  serialNumber?: String;
  code?: string;
  itemCategory?: string;
  inValue: number;
  outValue: number;
  price?: number;
  notes?: String;
}
export interface IInputVoucherEmployee {
  id: number;
  name: string;
  section?: ISection;
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
