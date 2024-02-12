const truncateString = (text: string, maxLength: number): string => {
  if (text == null || text == undefined) return;
  if (text.length <= maxLength) {
    return text;
  } else {
    const truncated = text.substring(0, maxLength - 4);
    const extension = text.substring(text.length - 4);
    return truncated + "..." + extension;
  }
};
const formatFileSize = (fileSize: number): string => {
  if (fileSize < 1024) {
    return `${fileSize} B`;
  } else if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(2)} KB`;
  } else if (fileSize < 1024 * 1024 * 1024) {
    return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};
export { truncateString, formatFileSize };
