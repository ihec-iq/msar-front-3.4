export interface IStore {
  id: number;
  item: string;
  stock: String;
  serialNumber: string;
  price?: number;
  count: number;
}
export interface IStoreFilter {
  stock?: string;
  item?: string;
  serialNumber?: string;
  limit: number;
}
