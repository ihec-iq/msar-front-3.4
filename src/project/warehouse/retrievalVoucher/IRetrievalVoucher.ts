import type { IItem } from "@/project/item/IItem";
import type { IInputVoucherItem } from "../inputVoucher/IInputVoucher";
import type { IStock } from "../IStock";

export interface IRetrievalVoucher {
  id: number;
  number: string;
  date: string;
  notes: string;
  Items: Array<IRetrievalVoucherItem>;
  signaturePerson: string;
  Employee: IRetrievalVoucherEmployee;
  itemsCount?: number;
}
export interface IRetrievalVoucherItem {
  id?: number;
  retrievalVoucherId: number;
  Item?: IItem;
  inputVoucherItemId: number;
  inputVoucherItem: IInputVoucherItem;
  Employee: IRetrievalVoucherEmployee;
  Stock: IStock;
  serialNumber: string;
  count: number;
  countWord?: string;
  price: number;
  value: number;
  notes: string;
}
// export interface IRetrievalVoucherItem {
//   id?: number;
//   outputVoucherId?: number;
//   outputVoucherItemId: number;
//   count: number;
//   countWord?: string;
//   price: number;
//   value: number;
//   notes: string;
// }
export interface IRetrievalVoucherEmployee {
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
