import type { IVacation } from "./IVacation";
import type { IVacationReason } from "./IVacationDaily";

export interface IVacationTime {
  id: number;
  date: string;
  timeFrom: string;
  timeTo: string;
  record: number;
  Vacation: IVacation;
  reason: IVacationReason;
}

export interface IVacationTimeFilter {
  limit: number;
  employeeId?: number;
  issueDateFrom?: string;
  issueDateTo?: string;
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
