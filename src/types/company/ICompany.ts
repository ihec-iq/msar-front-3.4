import type IComputer from "../computer/IComputer";

export default interface ICompany {
  id: number;
  name: string;
  owner: string;
  address: string;
  phones: string;
  facebook: string;
  package: number;
  telegram: string;
  last_login_at: string;
  active_at: string;
  computers: Array<IComputer>;
}
