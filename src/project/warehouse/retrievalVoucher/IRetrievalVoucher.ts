import type { IItem } from "@/project/item/IItem";
import type { IInputVoucherItem } from "../inputVoucher/IInputVoucher";
import type { IStock } from "../IStock";

export interface IRetrievalVoucher {
  id: number;
  number: string;
  date: string;
  notes: string;
  Items: Array<IRetrievalVoucherItem>;
  Type: IRetrievalVoucherItemType;
  TypeId: number;
  signaturePerson: string;
  Employee: IRetrievalVoucherEmployee;
  itemsCount?: number;
  Stock: IStock;

}
export interface IRetrievalVoucherItem {
  id?: number;
  Item?: IItem;
  retrievalVoucherId: number;
  inputVoucherItemId: number;
  InputVoucherItem: IInputVoucherItem;
  Employee: IRetrievalVoucherEmployee;
  Type: IRetrievalVoucherItemType;
  TypeId: number;
  employeeRequestId: number;
  description: string;
  count: number;
  price: number;
  value: number;
  notes: string;
}

export interface IRetrievalVoucherEmployee {
  id: number;
  name: string;
}
export interface IRetrievalVoucherItemType {
  id: number;
  name: string;
}
export interface IRetrievalVoucherState {
  id: number;
  name: string;
}
export interface IRetrievalVoucherFilter {
  id?: number;
  name: string;
  limit: number;
  description?: string;
}
