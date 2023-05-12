import type IBug from "../company/IBug";
import type ISupport from "../company/ISupport";

export default interface IComputer {
  name: string;
  motherboard: string;
  ip: string;
  note: string;
  title: string;
  license: string;
  version: string;
  active_at: string;
  expire_at: string;
  last_login_at: string;
  active_request_at: string;
  active_code: string;
  is_block: number;
  mac: string;
  server_id: number;
  server?: {
    id?: number;
    name?: string;
  };
  database_id: number;
  database?: {
    id?: number;
    name?: string;
  };
  helium_user_id: number;
  helium_user?: {
    id?: number;
    name?: string;
  };
  company_id: number;
  company?: {
    id?: number;
    name?: string;
  };
  login_id: number;
  login?: {
    id?: number;
    name?: string;
  };
  id: number;
  support: Array<ISupport> | undefined;
  bug: Array<IBug> | undefined;
}
