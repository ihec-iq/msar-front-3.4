export interface IStore {
  itemName: string;
  stockName: String;
  serialNumber: string;
  price?: number;
  count: number;
}
export interface IStoreFilter {
  stock?: string;
  item?: string;
  serialNumber?: string;
  limit: number;
  summation?: boolean;
}
