import type { IEmployee } from "../employee/IEmployee";

export interface IVacation {
  id: number;
  Employee: IEmployee;
  deservedRecord: number;
  totalTaken: number;
  remaining: number;
  currentYearVacations: number;
  currentYearTimeVacations: number;
  currentYearDailyVacations: number;
  deservedSickRecord: number;
  takenSick: number;
  remainingSick: number;
  currentYearSickVacations: number;
  record: number;
  recordSick: number;
}

export interface IVacationFilter {
  limit: number;
  employeeName: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  hasDate? : boolean,
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
export interface IVacationType {
  id: number;
  name: string;
}
export interface IVacationReason {
  id: number;
  name: string;
}
