import type { IEmployee } from "../employee/IEmployee";

export interface IStore {
  itemId: number;
  itemName: string;
  code: string;
  description: string;
  descriptionItem: string;
  stockName: string;
  categoryName: string;
  price?: number;
  count: number;
  countIn?: number;
  countOut?: number;
  countReIn?: number;
  countReOut?: number; 
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
  id?: number;
}
export interface IInventoryFilter {
  itemName?: string; 
  itemId?: string; 
  limit: number;
}
export interface IInverntoryHistoryFilter {
  stockId?: string;
  itemId?: string;
  from?: string;
  to?: string;
  movementType?: string;
  limit: number; 
  employeeId?: number;
}
export interface IStoreItemFilter {
  stock?: string;
  itemId?: string;
  description?: string;
  limit: number;
  summation?: boolean;
  sectionId?: number;
  isSection: boolean;
  isEmployee: boolean;
  employeeId?: number;
}
