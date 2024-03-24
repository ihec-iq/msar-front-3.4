export interface IArchive {
  id: number;
  title: string;
  way: string;
  issueDate: string;
  number: string;
  description: string;
  files: Array<IDocument>;
  isIn: number;
  isInWord?: string;
  archiveTypeId: number;
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
  archive_id: string;
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
