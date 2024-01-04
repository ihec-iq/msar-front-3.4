import type { IVacation } from "./IVacation";

export interface IVacationSick {
  id: number;
  dayFrom: string;
  dayTo: string;
  record: number;
  Vacation: IVacation;
}

export interface IVacationSickFilter {
  limit: number;
  employeeName?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
