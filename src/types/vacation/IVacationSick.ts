import type { IEmployee } from "../IEmployee";

export interface IVacationSick {
  id: number;
  dayFrom: string;
  dayTo: string;
  record: number;
  Employee: IEmployee;
}
export interface IVacationType {
  id: number;
  name: string;
}

export interface IVacationSickFilter {
  limit: number;
  issueDateFrom?: string;
  issueDateTo?: string;
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
