export default interface IArchive {
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
  sectionId: number;
}
