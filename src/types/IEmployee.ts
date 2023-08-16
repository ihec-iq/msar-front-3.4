import type { ISection } from "./ISection";

export interface IEmployee {
  id: number;
  name: string;
  section: ISection;
  isPerson: number;
}
export interface IEmployeeFilter {
  name: string;
  sectionId?: number;
  limit: number;
}
