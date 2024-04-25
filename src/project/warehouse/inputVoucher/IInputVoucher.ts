import type { IItem } from "@/project/item/IItem";
import type { ISection } from "@/project/section/ISection"; 
import type { IStock } from "../IStock";

export interface IInputVoucher {
  id: number;
  number: string;
  numberBill: string;
  date: string;
  dateBill: string;
  dateReceive: string;
  notes: string;
  Stock: IStock;
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
  description: string;
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
  description?: string;
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
