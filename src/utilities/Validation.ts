import { t } from "@/utilities/I18nPlugin";

export interface IValidator {
  name: string
  regexp: RegExp | string | undefined;
  message: string;
  check: Function
  field2?: string
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
  function sameAs(field2: { field: string, caption: string } = { field: "", caption: "" },
    options: { message: string } = {
      message: t("ValidationErrors.FieldNotSame") + " " +
        (field2.caption != "" ? t(field2.caption) : t(field2.field))
    }
  ): IValidator {
    const validator: IValidator = {
      name: 'sameAs',
      message: options.message,
      regexp: undefined,
      field2: field2.field,
      check: (field1: string, field2: string) => {
        return field1 == field2 ? true : false
      }
    };

    return validator;
  }
  function isObject(options: { key: string, message: string } = {
    key: "",
    message: t("ValidationErrors.isObject")
  }
  ): IValidator {
    if (options.message == "") options.message = t("ValidationErrors.isObject")
    const validator: IValidator = {
      name: 'isObject',
      message: options.message,
      regexp: undefined,
      check: (field1: any) => {
        if (options.key == "") {
          return (typeof field1 === "object" && field1 !== null && field1 !== undefined) ? true : false
        } else {
          if (typeof field1 === "object" && field1 !== null && field1.hasOwnProperty(options.key) && options.key != "") {
            if (Number(field1[options.key]) > 0) return true;
          }
          return false;
        }
      }
    };

    return validator;
  }
  function isArray(options: { message: string } = {
    message: t("ValidationErrors.isArray")
  }
  ): IValidator {
    if (options.message == "") options.message = t("ValidationErrors.isArray")
    const validator: IValidator = {
      name: 'isArray',
      message: options.message,
      regexp: undefined,
      check: (field1: any) => {
        return (typeof field1 === "object" && field1 !== null && field1 !== undefined && field1.length > 0) ? true : false
      }
    };

    return validator;
  }
  function email(options: { message: string } = { message: t("ValidationErrors.FieldMustBeEmail") }) {
    const validator: IValidator = {
      name: 'email',
      regexp: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
      message: options.message,
      check: () => { }
    };
    return validator;
  }
  function string(options: { message: string } = { message: t("ValidationErrors.FieldMustBeString") }): IValidator {
    const validator: IValidator = {
      name: 'string',
      regexp: /^[\u0600-\u06FFa-zA-Z\s]+$/,
      message: options.message,
      check: (field1: any) => {
        return typeof field1 === "string" ? true : false
      }
    };
    return validator;
  }

  function required(
    options: { message: string } = { message: t("ValidationErrors.FieldRequired") }
  ): IValidator {
    const validator: IValidator = {
      name: 'required',
      regexp: /^(?!undefined$|^$).{1,}$/,
      message: options.message,
      check: () => { }
    };
    return validator;
  }

  function foreignKey(
    options: { message: string } = { message: t("ValidationErrors.ForeignKey") }
  ): IValidator {
    const validator: IValidator = {
      name: 'foreignKey',
      regexp: /^(?!null$|undefined$|0$|$)/,
      message: options.message,
      check: () => { }
    };
    return validator;
  }

  function number(options: { message: string } = { message: t("ValidationErrors.FieldMustBeNumber") }): IValidator {
    const validator: IValidator = {
      name: 'number',
      regexp: /^-?\d*\.?\d+$/,
      message: options.message,
      check: () => { }
    };
    return validator;
  }

  function integer(options: { message: string } = { message: t("ValidationErrors.FieldMustBeInteger") }): IValidator {
    const validator: IValidator = {
      name: 'integer',
      regexp: /^-?\d+$/,
      message: options.message,
      check: () => { }
    };
    return validator;
  }

  function float(options: { message: string } = { message: t("ValidationErrors.FieldMustBeFloat") }): IValidator {
    const validator: IValidator = {
      name: 'float',
      regexp: /^-?\d+(\.\d+)?$/,
      message: options.message,
      check: () => { }
    };
    return validator;
  }

  function min(
    value: Number,
    options: { message: string } = { message: t("ValidationErrors.FiledLengthIsTooShort") }
  ): IValidator {
    options.message = options.message.replace(":val", value.toString());
    const validator: IValidator = {
      name: 'min',
      regexp: new RegExp(`^.{${value},}$`),
      message: options.message,
      check: () => { }
    };
    return validator;
  }

  function max(
    value: Number,
    options: { message: string } = { message: t("ValidationErrors.FiledLengthIsTooLong") }
  ): IValidator {
    options.message = options.message.replace(":val", value.toString());
    const validator: IValidator = {
      name: 'max',
      regexp: new RegExp(`^.{0,${value}}$`),
      message: options.message,
      check: () => { }
    };
    return validator;
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

    if (objectKeys.length == 0 || validators.length == 0) return result;


    try {
      let success = true;
      let errors: Array<IValidatorError> = [];

      validators.forEach((validator) => {
        let keyValue = object[validator.field];

        let error: IValidatorError = {
          fieldName: validator.caption ? validator.caption : validator.field,
          messages: [],
        };
        //console.log(validator.rules)
        validator.rules.forEach((rule) => {
          // for RegExp Rule
          if (rule.regexp != undefined) {
            let regex = new RegExp(rule.regexp as RegExp);
            if (!regex.test(keyValue)) {
              success = false;
              let errorMessage = `${rule.message}`;
              error.messages.push(errorMessage);
            }
          } else {
            if (rule.name == 'sameAs') {
              let field2 = object[String(rule.field2)]
              if (!rule.check(keyValue, field2)) {
                success = false;
                let errorMessage = `${rule.message}`;
                error.messages.push(errorMessage);
              }
            } else if (rule.name == 'isObject') {
              if (!rule.check(keyValue)) {
                success = false;
                let errorMessage = `${rule.message}`;
                error.messages.push(errorMessage);
              }
            } else {
              if (!rule.check(keyValue)) {
                success = false;
                let errorMessage = `${rule.message}`;
                error.messages.push(errorMessage);
              }
            }
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

  return {
    validate,
    email,
    required,
    foreignKey,
    number,
    integer,
    float,
    string,
    min,
    max,
    sameAs,
    isObject,
    isArray
  };
}
