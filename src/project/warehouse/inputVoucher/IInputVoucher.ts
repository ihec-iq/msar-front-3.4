import type { IItem } from "@/project/item/IItem";
import type { ISection } from "@/project/section/ISection";
import type { IStock } from "../settingVoucher/stock/IStock";
import type { IInputVoucherState } from "../settingVoucher/inputVoucherState/IInputVoucherState";
import type { IDocument } from "@/project/archive/IArchive";

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
  requestedBy: string;
  itemsCount?: number;
  documnetsCount?: number;
  FilesDocument?: Array<IDocument>;
}
export interface IInputVoucherItem {
  id?: number;
  inputVoucherId?: number;
  Item: IItem;
  count: number;
  countIn?: number;
  countOut?: number;
  countReIn?: number;
  countReOut?: number;
  description: string;
  ItemDescription?: string;
  price: number;
  value: number;
  notes?: string;
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
export interface IInputVoucherFilter {
  id?: number;
  name: string;
  limit: number;
  description?: string;
}
