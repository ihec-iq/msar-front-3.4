import type IComputer from "@/types/computer/IComputer";
export default interface IActivation extends IComputer {
  title: string;
  device_id: number;
  company_id: number;
  id: number;
}
