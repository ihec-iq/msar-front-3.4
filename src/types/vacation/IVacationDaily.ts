import type { IVacation } from "./IVacation";

export interface IVacationDaily {
  id: number;
  dayFrom: string;
  dayTo: string;
  record: number;
  Vacation: IVacation;
}
export interface IVacationType {
  id: number;
  name: string;
}

export interface IVacationDailyFilter {
  limit: number;
  employeeId?: number;
  issueDateFrom?: string;
  issueDateTo?: string;
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
