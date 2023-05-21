import { ref } from "vue";
export default function () {
  const files = ref<IFile[]>([]);

  const addFiles = (newFiles: IFile[]) => {
    console.log(newFiles);
    const newUploadableFiles = [...newFiles]
      .map((file) => new UploadableFile(file))
      .filter((file) => !fileExists(file.id));
    files.value = files.value.concat(newUploadableFiles);
  };

  const fileExists = (otherId: string) => {
    return files.value.some(({ id }) => id === otherId);
  };

  const removeFile = (file: IFile) => {
    const index = files.value.indexOf(file);

    if (index > -1) files.value.splice(index, 1);
  };

  return { files, addFiles, removeFile };
}

class UploadableFile implements IFile {
  constructor(file: any) {
    //console.log(file);
    this.file = file.File;
    this.name = `${file.name}`;
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.lastModified = `${file.lastModified}`;
    this.url = URL.createObjectURL(file);
    this.status = null;
    this.size = file.size;
    this.type = file.type;
    this.fileName = "";
    console.log(this.url);
  }
  name: string;
  file: MediaSource | Blob;
  id: string;
  url: string;
  status: Boolean | null | string;
  size: string;
  type: string;
  fileName: string;
  lastModified: string;
}
export interface IFile {
  file: MediaSource | Blob;
  id: string;
  url: string;
  status: Boolean | null | string;
  size: string;
  type: string;
  name: string;
  fileName: string;
  lastModified: string;
}
