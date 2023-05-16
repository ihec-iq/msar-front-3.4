export interface IArchive {
  id: number;
  title: string;
  way: string;
  issueDate: string;
  number: string;
  description: string;
  files?: Array<File>;
  isIn: number;
  isInWord?: string;
  archiveTypeId: number;
  archiveType?: number;
  sectionId: number;
  section?: number;
}
export interface IArchiveFilter {
  limit: number;
  title: string;
  way?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  number?: string;
  description?: string;
  isIn?: number;
  archiveTypeId?: number;
  sectionId?: number;
}
