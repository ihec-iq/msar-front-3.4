import type { IEmployee } from "../IEmployee";
import type { IVacation } from "./IVacation";

export interface IVacationDaily {
  id: number;
  dayFrom: string;
  dayTo: string;
  record: number;
  Vacation: IVacation;
  employeeAlter: IEmployee;
  reason: IVacationReason;
}
export interface IVacationType {
  id: number;
  name: string;
}
export interface IVacationReason {
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
