import type { IVacation, IVacationReason } from "../IVacation";

export interface IVacationSick {
  id: number;
  dayFrom: string;
  dayTo: string;
  record: number;
  Vacation: IVacation;
  Reason: IVacationReason;
  createdAt?: string
}

export interface IVacationSickFilter {
  limit: number;
  employeeId?: number;
  employeeName?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
