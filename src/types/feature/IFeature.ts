export default interface IFeature {
  id: number;
  title: string;
  content: string;
  creator_id: number;
  creator?: {
    id?: number;
    name?: string;
  };
  version_id: number;
  version?: {
    id?: number;
    name?: string;
  };
  state_id: number;
  state?: {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: string;
  };
  vote: number;
  date: string;
  date_finish: string;
}
