import type { IEmployee } from "../IEmployee";

export interface IVacation {
  id: number;
  Employee: IEmployee;
  record: number;
  oldRecord: number;
  newRecord: number;
  sumDaily: number;
  sumTime: number;
  oldRecordSick: number;
  newRecordSick: number;
  recordSick: number;
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
