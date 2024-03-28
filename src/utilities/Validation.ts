import { t } from "@/utilities/I18nPlugin";

export interface fieldValidation {
  name: string;
  roles: Array<RegExp>;
}

export interface IValidator {
  regexp: RegExp;
  message: String;
}

export interface IValidationResult {
  success: Boolean;
  errors: Array<IValidatorError>;
}

export interface IFieldValidation {
  field: string;
  caption?: string;
  rules: Array<IValidator>;

}

export interface IValidatorError {
  fieldName: String;
  messages: Array<String>;
}
export function useValidation() {
  class validators {
    validatorsList: Array<IValidator> = [];

    constructor() {
      this.validatorsList = [];
    }

    required() {
      const validator: IValidator = {
        regexp: /^(?!undefined$|^$).{1,}$/,
        message: t("ValidationErrors.FieldRequired"),
      };

      this.validatorsList.push(validator);
      return this;
    }

    email() {
      const validator: IValidator = {
        regexp: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
        message: t("ValidationErrors.FieldMustBeEmail"),
      };

      this.validatorsList.push(validator);
      return this;
    }

    number() {
      const validator: IValidator = {
        regexp: /^-?\d*\.?\d+$/,
        message: t("ValidationErrors.FieldMustBeNumber"),
      };

      this.validatorsList.push(validator);
      return this;
    }

    integer() {
      const validator: IValidator = {
        regexp: /^-?\d+$/,
        message: t("ValidationErrors.FieldMustBeInteger"),
      };

      this.validatorsList.push(validator);
      return this;
    }

    float() {
      const validator: IValidator = {
        regexp: /^-?\d+(\.\d+)?$/,
        message: t("ValidationErrors.FieldMustBeFloat"),
      };

      this.validatorsList.push(validator);
      return this;
    }

    min(value: Number) {
      const validator: IValidator = {
        regexp: new RegExp(`^.{${value},}$`),
        message: t("ValidationErrors.FiledLengthIsTooShort"),
      };

      this.validatorsList.push(validator);
      return this;
    }

    max(value: Number) {
      const validator: IValidator = {
        regexp: new RegExp(`^.{0,${value}}$`),
        message: t("ValidationErrors.FiledLengthIsTooLong"),
      };

      this.validatorsList.push(validator);
      return this;
    }

    toList() {
      return this.validatorsList;
    }
  }
  function validate(
    object: any,
    validators: Array<IFieldValidation>
  ): IValidationResult {
    let result: IValidationResult = {
      success: false,
      errors: [],
    };

    if (!object) return result;

    let objectKeys = Object.keys(object);

    if (objectKeys.length == 0) return result;

    if (validators.length == 0) return result;

    try {
      let success = true;
      let errors: Array<IValidatorError> = [];

      validators.forEach((validator) => {
        let keyValue = object[validator.field];

        let error: IValidatorError = {
          fieldName: validator.caption ? validator.caption : validator.field,
          messages: [],
        };

        validator.rules.forEach((rule) => {
          let regex = new RegExp(rule.regexp);

          if (!regex.test(keyValue)) {
            success = false;
            let errorMessage = `${rule.message}`;
            error.messages.push(errorMessage);
          }
        });

        if (error.messages.length > 0) errors.push(error);
      });

      result.success = success;
      result.errors = errors;
    } catch (error) {
      console.log("validate function in Validation composable:", error);
    }

    return result;
  }

  return { validate, validators };
}

export function useSimpleValidation() {
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

  return { roles, isValid };
}
