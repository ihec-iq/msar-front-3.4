import type { IVacation } from "./IVacation";

export interface IVacationTime {
  id: number;
  date: string;
  timeFrom: string;
  timeTo: string;
  record: number;
  Vacation: IVacation;
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
