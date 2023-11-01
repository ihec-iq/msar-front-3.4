import type { IEmployee } from "../IEmployee";

export interface IVacation {
  id: number;
  record: number;
  oldRecord: number;
  newRecord: number;
  Employee: IEmployee;
  sumDaily: number;
  sumTime: number;
  sumSick: number;
}

export interface IVacationFilter {
  limit: number;
  employeeName: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
