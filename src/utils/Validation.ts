import { t } from "./I18nPlugin";

export interface fieldValidation {
  name: string;
  roles: Array<RegExp>;
}

export function useValidation() {
  const roles2 = {
    required: {
      regex: /^(?!undefined$|^$).{1,}$/,
      message: t(""),
    },
    email: {
      regex: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
      message: t(""),
    },
    number: {
      regex: /^-?\d*\.?\d+$/,
      message: t(""),
    },
    min: (value: Number) => {
      return {
        regex: new RegExp(`^.{${value},}$`),
        message: t(""),
      };
    },
    max: (value: Number) => {
      return {
        regex: new RegExp(`^.{0,${value}}$`),
        message: t(""),
      };
    },
  };

  const roles = {
    required: /^(?!undefined$|^$).{1,}$/,
    email: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
    number: /^-?\d*\.?\d+$/,
    min: (value: Number) => {
      return new RegExp(`^.{${value},}$`);
    },
    max: (value: Number) => {
      return new RegExp(`^.{0,${value}}$`);
    },
  };

  function isValid(obj: any, fields: Array<fieldValidation>) {
    try {
      let isValid = true;
      if (!obj) return false;
      let keys = Object.keys(obj);
      if (keys.length == 0) return false;

      for (let i = 0; i < keys.length; i++) {
        let field = fields.find((item) => item.name == keys[i]);

        if (field == undefined) continue;

        field.roles.forEach((role: RegExp) => {
          let regex = new RegExp(role);
          if (!regex.test(obj[keys[i]])) isValid = false;
        });
      }

      return isValid;
    } catch (error) {
      console.log("isValid function in Validation composable:", error);
    }
  }

  function isValid2(obj: any, fields: Array<any>) {
    try {
      let isValidList: Array<String> = [];

      /* if (!obj) return false; */
      let keys = Object.keys(obj);
      /* if (keys.length == 0) return false; */

      for (let i = 0; i < keys.length; i++) {
        let field = fields.find((item) => item.name == keys[i]);

        if (field == undefined) continue;

        field.roles.forEach((role: any) => {
          let regex = new RegExp(role.regex);
          if (!regex.test(obj[keys[i]])) {
            isValidList.push(role.message + ": " + field.name);
          }
        });
      }

      return isValidList;
    } catch (error) {
      console.log("isValid function in Validation composable:", error);
    }
  }

  return { roles, roles2, isValid2, isValid };
}
