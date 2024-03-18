import type { IItem } from "../project/item/IItem";
import type { ISection } from "./ISection";
import type { IStock } from "./IStock";

export interface IInputVoucher {
  id: number;
  number: string;
  date: string;
  notes: string;
  State: IInputVoucherState;
  Items: Array<IInputVoucherItem>;
  signaturePerson: string;
  requestedBy: string;
  itemsCount?: number;
}
export interface IInputVoucherItem {
  id?: number;
  inputVoucherId?: number;
  Item: IItem;
  Stock: IStock;
  serialNumber: string;
  count: number;
  price: number;
  value: number;
  notes?: string;
  inValue?: number;
  outValue?: number;
}
export interface IInputVoucherItemVSelect {
  id?: number;
  itemName: string;
  stockName?: string;
  serialNumber?: string;
  code?: string;
  itemCategory?: string;
  inValue: number;
  outValue: number;
  price?: number;
  notes?: string;
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
  description?: string;
}
