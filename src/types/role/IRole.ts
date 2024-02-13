import type IPermission from "./IPermission";

export default interface IRole {
  name: string;
  permissions: Array<IPermission>;
  checkedPermission?: Array<string>;
  id: number;
}
