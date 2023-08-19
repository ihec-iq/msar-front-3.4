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
  itemId: number;
  itemName: string;
  stockName: String;
  serialNumber: string;
  price?: number;
  billType: string;
  count: number;
}
export interface IStoreFilter {
  stock?: string;
  item?: string;
  serialNumber?: string;
  limit: number;
  summation?: boolean;
}
export interface IStoreItemFilter {
  stock?: string;
  itemId?: string;
  serialNumber?: string;
  limit: number;
  summation?: boolean;
}
