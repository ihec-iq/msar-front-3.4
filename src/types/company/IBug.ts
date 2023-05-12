export default interface IBug {
  id: number;
  bug_message: string;
  device_id: number;
  version?: string;
  helium_user: string;
  helium_event_user: string;
  database: string;
  server: string;
  company_id: number;
  reply?: string;
  state?: string;
}
