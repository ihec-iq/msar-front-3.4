import type { IEmployee } from "@/project/employee/IEmployee";
import type { IVacation, IVacationReason } from "../IVacation";

export interface IVacationDaily {
  id: number;
  dayFrom: string;
  dayTo: string;
  record: number;
  Vacation: IVacation;
  EmployeeAlter: IEmployee;
  Reason: IVacationReason;
  createdAt?:string
}

export interface IVacationDailyFilter {
  limit: number;
  employeeId?: number;
  employeeName?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  dayFrom?: string;
  dayTo?: string;
  record?: number;
}
