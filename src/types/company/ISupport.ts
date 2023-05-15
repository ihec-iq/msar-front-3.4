export default interface ISupport {
  id: number;
  title: string;
  details: string;
  last_login_at: string;
  company_id: number;
  company?: {
    id: number;
    name: string;
  };
  helium_user: string;
  device_id: number;
  device?: {
    id: number;
    name: string;
  };
}
