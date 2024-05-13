import { t } from "@/utilities/I18nPlugin";
export const getError = (error: {
  response: {
    data: { errors: { [s: string]: unknown } | ArrayLike<unknown> };
    status: any;
    headers: any;
  };
  config: { url: any };
}) => {
  const errorMessage = t("Server is down, please try again.");

  if (!error.response) {
    console.error(`API ${error.config.url} not found`);
    return errorMessage;
  }
  if (process.env.NODE_ENV === "development") {
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
  }
  if (error.response.data && error.response.data.errors) {
    return Object.values(error.response.data.errors).flat().join();
  }

  return errorMessage;
};
