function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}

export function ImageResizer(
  file: File,
  maxSize: number
): Promise<Blob | File> {
  if (!file.type.match(/image.*/)) {
    return Promise.resolve(file);
  }

  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement("canvas");

  const resize = () => {
    let width = image.width;
    let height = image.height;

    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }

    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    const fileExtension = file.name.split(".").pop();
    const fileName = file.name.replace(`.${fileExtension}`, "");
    const newFile = new File(
      [dataURItoBlob(dataUrl)],
      `${fileName}.${fileExtension}`
    );
    return newFile;
  };

  return new Promise((resolve, reject) => {
    reader.onload = (readerEvent) => {
      image.onload = () => resolve(resize());
      image.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
