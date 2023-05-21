import type { IFile } from "./file-list";

export async function uploadFile(file: IFile, url: string) {
  // set up the request data
  const formData = new FormData();
  formData.append("file", file.file);

  // track status and upload file
  file.status = "loading";
  const response = await fetch(url, { method: "POST", body: formData });

  // change status to indicate the success of the upload request
  file.status = response.ok;

  return response;
}

export function uploadFiles(files: any[], url: any) {
  return Promise.all(files.map((file) => uploadFile(file, url)));
}

export default function createUploader(url: string) {
  return {
    uploadFile: function (file: IFile) {
      return uploadFile(file, url);
    },
    uploadFiles: function (files: IFile[]) {
      return uploadFiles(files, url);
    },
  };
}
