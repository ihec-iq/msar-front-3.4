/**
 * Converts FormData to a plain JavaScript object
 * @param formData The FormData instance to convert
 * @returns A plain object with the form data entries
 */
export const formDataToObject = (formData: FormData): Record<string, any> => {
  const object: Record<string, any> = {};
  formData.forEach((value, key) => {
    // Handle case where key already exists (for multiple values)
    if (object.hasOwnProperty(key)) {
      if (!Array.isArray(object[key])) {
        object[key] = [object[key]];
      }
      object[key].push(value);
    } else {
      object[key] = value;
    }
  });
  return object;
};
