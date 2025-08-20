import type { IInputVoucherItem } from "../inputVoucher/IInputVoucher";
import type { IItem } from "@/project/item/IItem";
import type { IStock } from "../settingVoucher/stock/IStock";
import type { IDocument } from "@/project/archive/IArchive";
import type { IUserFilter, IUserLite } from "@/project/user/IUser";

 
export interface IOutputVoucher {
  id: number;
  number: string;
  date: string;
  dateBill: string;
  numberBill: string;
  notes: string;
  Items: Array<IOutputVoucherItem>;
  Stock: IStock;
  Employee: IOutputVoucherEmployee;
  itemsCount?: number;
  FilesDocument?: Array<IDocument>;
  UserCreated?:IUserLite 
}
export interface IOutputVoucherItem {
  id?: number;
  outputVoucherId: number;
  Item?: IItem;
  inputVoucherItemId: number;
  InputVoucherItem: IInputVoucherItem; 
  description: string;
  count: number; 
  price: number;
  value: number;
  notes: string;
}
// export interface IOutputVoucherItem {
//   id?: number;
//   outputVoucherId?: number;
//   inputVoucherItemId: number;
//   count: number;
//   countWord?: string;
//   price: number;
//   value: number;
//   notes: string;
// }
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
  description?: string;
}
