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
  outputVoucherId?: number;
  item?: string;
  Employee: IDirectVoucherEmployee;
  serialNumber: string;
  count: number;
  countWord?: string;
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
