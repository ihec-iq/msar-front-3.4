import type { IEmployee } from "./IEmployee";

export interface IStore {
  itemId: number;
  itemName: string;
  stockName: String;
  serialNumber: string;
  price?: number;
  count: number;
  in?: number;
  out?: number;
}
export interface IStoreItemHistory {
  voucherId: number;
  itemId: number;
  itemName: string;
  stockName: String;
  serialNumber: string;
  Employee: IEmployee;
  price?: number;
  billType: string;
  count: number;
}
export interface IStoreFilter {
  stock?: string;
  item?: string;
  serialNumber?: string;
  employeeName?: string;
  limit: number;
  summation?: boolean;
}
export interface IStoreItemFilter {
  stock?: string;
  itemId?: string;
  serialNumber?: string;
  limit: number;
  summation?: boolean;
  isEmployee: boolean;
  employeeId?: number;
}
