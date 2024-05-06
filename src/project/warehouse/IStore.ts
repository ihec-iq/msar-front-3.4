import type { IEmployee } from "../employee/IEmployee";

export interface IStore {
  itemId: number;
  itemName: string;
  code: string;
  description: string;
  stockName: string;
  categoryName: string;
  price?: number;
  count: number;
  in?: number;
  out?: number;
  reIn?: number;
  reOut?: number;
}
export interface IStoreItemHistory {
  voucherId: number;
  itemId: number;
  itemName: string;
  stockName: string;
  description: string;
  Employee: IEmployee;
  price?: number;
  billType: string;
  count: number;
}
export interface IStoreFilter {
  stock?: string;
  item?: string;
  description?: string;
  employeeName?: string;
  limit: number;
  summation?: boolean;
}
export interface IStoreItemFilter {
  stock?: string;
  itemId?: string;
  description?: string;
  limit: number;
  summation?: boolean;
  isEmployee: boolean;
  employeeId?: number;
}
