import type { IItem } from "@/project/item/IItem";

export interface IRetrievalVoucher {
  id: number;
  number: string;
  date: string;
  notes: string;
  items: Array<IRetrievalVoucherItem>;
  signaturePerson: string;
  employeeRequest: IRetrievalVoucherEmployee;
  itemsCount?: number;
}
export interface IRetrievalVoucherItem {
  id?: number;
  outputVoucherId?: number;
  item: IItem;
  employeeRequest: IRetrievalVoucherEmployee;
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
