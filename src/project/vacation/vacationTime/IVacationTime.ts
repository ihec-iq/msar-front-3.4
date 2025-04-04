import type { IVacation, IVacationReason } from "../IVacation";
 
export interface IVacationTime {
  id: number;
  date: string;
  timeFrom: string;
  timeTo: string;
  record: number;
  Vacation: IVacation;
  Reason: IVacationReason;
  createdAt?: string
}

export interface IVacationTimeFilter {
  limit: number;
  employeeId?: number;
  employeeName?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
