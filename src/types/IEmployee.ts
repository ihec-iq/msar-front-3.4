import type { ISection } from "./ISection";

export interface IEmployee {
  id: number;
  name: string;
  section: ISection;
  isPerson: number;
}
const xx = {
  voucherItemHistoriable: {
    id: 4,
    inputVoucherId: 2,
    itemId: 1,
    item: {
      id: 1,
      name: "ميز خشب",
      code: "A2152AA0001",
      description: "loren loren",
      itemCategory: {
        id: 1,
        name: "اجهزة كهربائية",
        description: "تختص بالاجهزة الكهربائية والالكترونية",
      },
      itemCategoryId: 1,
      measuringUnit: "Item",
    },
  },
};

export interface IEmployeeHistory {
  id: number;
  type: string;
  inputVoucherItemId: number;
  voucherItemHistoriableId: number;
  voucherItemHistoriableType: string;
  price: number;
  count: number;
  notes: string;
  employee: IEmployee;
  voucher: {
    idVoucher: number;
    date: string;
    itemName: string;
    stockName: string;
    serialNumber: string;
  };
}
export interface IEmployeeFilter {
  name: string;
  sectionId?: number;
  isPerson?: number;
  limit: number;
  checked?: boolean;
  employeeId?: number;
}
