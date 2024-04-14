export const truncateFileName = (text?: string, maxLength?: number): string => {
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
export const truncateString = (text?: string, maxLength?: number): string => {
  if (text == null || text == undefined) return "";
  if (maxLength == null || maxLength == undefined) return "";
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substring(0, maxLength);
  }
};
export const formatFileSize = (fileSize?: number): string => {
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
export const makeRandom = (length?: number): string => {
  if (length == null || length == undefined) return "";

  return Math.floor(Math.random() * 10)
    .toString()
    .repeat(length);
};
export function isNumber(value?: string | number): boolean {
  return ((value != null) &&
    (value !== '') &&
    !isNaN(Number(value.toString())));
}
export const CNumber = (val: any = 0): number => {
  if (!isNumber(val)) return 0;
  return Number(val);
};
export const dateWithoutTime = function (date: string) {
  return date ? date.split("T")[0] : ""
}
export const timeWithoutDate = function (date: string) {
  return date ? date.split("T")[0] : ""
}
export const ConvertToMoneyFormat = function (number: string) {
  return (number).toLocaleString().replace(/,/g, ",",)
}

export const makeFormDataFromObject = (object: any, keys: Array<string> = []) =>
  Object.keys(object).reduce((formData, key) => {
    if (keys.length>0){
      if (keys.includes(key)) {
        let value = object[key];
        if (typeof value === "object" && value !== null)
          value = JSON.stringify(value);
        formData.append(key, value);
      }
    }else{
      let value = object[key];
      if (typeof value === "object" && value !== null)
        value = JSON.stringify(value);
      formData.append(key, value);
    }
    
    return formData;
  }, new FormData());
