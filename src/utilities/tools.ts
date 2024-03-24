const truncateFileName = (text?: string, maxLength?: number): string => {
  if (text == null || text == undefined) return "";
  if (maxLength == null || maxLength == undefined) return "";
  if (text.length <= maxLength) {
    return text;
  } else {
    const truncated = text.substring(0, maxLength - 4);
    const extension = text.substring(text.length - 4);
    return truncated + "..." + extension;
  }
};
const truncateString = (text?: string, maxLength?: number): string => {
  if (text == null || text == undefined) return "";
  if (maxLength == null || maxLength == undefined) return "";
  if (text.length <= maxLength) {
    return text;
  } else { 
    return text.substring(0, maxLength);
  }
};
const formatFileSize = (fileSize?: number): string => {
  if (fileSize == null || fileSize == undefined) return "";

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
const makeRandom = (length?: number): string => {
  if (length == null || length == undefined) return "";

  return Math.floor(Math.random() * 10)
    .toString()
    .repeat(length);
};
function isNumber(value?: string | number): boolean
{
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}
const CNumber = (val: any = 0): number => {
  if (!isNumber(val)) return 0;
  return Number(val);
};

export { truncateString, truncateFileName, formatFileSize, makeRandom, isNumber, CNumber };
