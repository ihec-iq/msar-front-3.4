import { t } from "@/utilities/I18nPlugin";

export interface IValidator {
  regexp: RegExp | String | Function;
  message: String;
  typeRule?: string | "RegExp";
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
  function sameAs( field2 :string,
    options: { message: string } = { message: t("ValidationErrors.FieldRequired") }
  ): IValidator {
    
    return validator;
  }
  function email(options: { message: string } = { message: t("ValidationErrors.FieldMustBeEmail") }) {
    const validator: IValidator = {
      regexp: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
      message: options.message
    };
    return validator;
  }

  function required(
    options: { message: string } = { message: t("ValidationErrors.FieldRequired") }
  ): IValidator {
    const validator: IValidator = {
      regexp: /^(?!undefined$|^$).{1,}$/,
      message: options.message
    };
    return validator;
  }

  function foreignKey(
    options: { message: string } = { message: t("ValidationErrors.ForeignKey") }
  ): IValidator {
    const validator: IValidator = {
      regexp: /^(?!null$|undefined$|0$|$)/,
      message: options.message
    };
    return validator;
  }

  function number(options: { message: string } = { message: t("ValidationErrors.FieldMustBeNumber") }): IValidator {
    const validator: IValidator = {
      regexp: /^-?\d*\.?\d+$/,
      message: options.message
    };
    return validator;
  }

  function integer(options: { message: string } = { message: t("ValidationErrors.FieldMustBeInteger") }): IValidator {
    const validator: IValidator = {
      regexp: /^-?\d+$/,
      message: options.message
    };
    return validator;
  }

  function float(options: { message: string } = { message: t("ValidationErrors.FieldMustBeFloat") }): IValidator {
    const validator: IValidator = {
      regexp: /^-?\d+(\.\d+)?$/,
      message: options.message
    };
    return validator;
  }

  function min(
    value: Number,
    options: { message: string } = { message: t("ValidationErrors.FiledLengthIsTooShort") }
  ): IValidator {
    options.message = options.message.replace(":val", value.toString());
    const validator: IValidator = {
      regexp: new RegExp(`^.{${value},}$`),
      message: options.message,
    };
    return validator;
  }

  function max(
    value: Number,
    options: { message: string } = { message: t("ValidationErrors.FiledLengthIsTooLong") }
  ): IValidator {
    options.message = options.message.replace(":val", value.toString());
    const validator: IValidator = {
      regexp: new RegExp(`^.{0,${value}}$`),
      message: options.message,
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
          // for RegExp Rule
          if (rule.typeRule == undefined) { 
            let regex = new RegExp(rule.regexp as RegExp);
            if (!regex.test(keyValue)) {
              success = false;
              let errorMessage = `${rule.message}`;
              error.messages.push(errorMessage);
            }
          }else{

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
    min,
    max,
  };
}
