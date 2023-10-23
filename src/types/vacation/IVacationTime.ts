import type { IEmployee } from "../IEmployee";

export interface IVacationTime {
  id: number;
  date: string;
  dayFrom: string;
  dayTo: string;
  record: number;
  Employee: IEmployee;
}
export interface IVacationType {
  id: number;
  name: string;
}

export interface IVacationTimeFilter {
  limit: number;
  issueDateFrom?: string;
  issueDateTo?: string;
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
