export interface IArchive {
  id: number;
  title: string;
  way: string;
  issueDate: string;
  number: string;
  description: string;
  Files: Array<IDocument>;
  isIn: number;
  isInWord?: string;
  archiveTypeId: number;
  archiveTypeName: string;
  archiveType?: IArchiveType;
}
export interface IArchiveType {
  id: number;
  name: string;
  description?: string;
  archives?: number;
}
export interface IDocument {
  id: number;
  title: string;
  name: string;
  path: string;
  extension: string;
  size: string;
  linkId: string;
}
export interface IArchiveFilter {
  limit: number;
  title: string;
  way?: string;
  hasDate?: boolean;
  issueDateFrom?: string;
  issueDateTo?: string;
  number?: string;
  description?: string;
  isIn?: number;
  archiveTypeId?: number;
}
