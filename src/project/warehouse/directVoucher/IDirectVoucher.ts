import type { IItem } from "@/project/item/IItem";

export interface IDirectVoucher {
  id: number;
  number: string;
  date: string;
  notes: string;
  Items: Array<IDirectVoucherItem>;
  signaturePerson: string;
  Employee: IDirectVoucherEmployee;
  itemsCount?: number;
}
export interface IDirectVoucherItem {
  id?: number;
  directVoucherId?: number;
  Item?: IItem;
  description: string;
  count: number;
  price: number;
  value: number;
  notes: string;
}

export interface IDirectVoucherEmployee {
  id: number;
  name: string;
}
export interface IDirectVoucherState {
  id: number;
  name: string;
}
export interface IDirectVoucherFilter {
  id?: number;
  name: string;
  limit: number;
  description?: string;
}
