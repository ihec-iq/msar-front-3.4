import type { IItem } from "./IItem";

export interface IInputVoucher {
  id: number;
  number: string;
  date: String;
  notes: string;
  state: IInputVoucherState;
  items?: Array<IItem>;
  signaturePerson: String;
  employeeRequestId: number;
  employeeRequest: IInputVoucherEmployee;
  inputVoucherStateId: number;
  itemsCount?: number;
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
