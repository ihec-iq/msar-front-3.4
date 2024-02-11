import type { IVacation } from "./IVacation";
import type { IVacationReason } from "./IVacationDaily";

export interface IVacationSick {
  id: number;
  dayFrom: string;
  dayTo: string;
  record: number;
  Vacation: IVacation;
  Reason: IVacationReason;
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
