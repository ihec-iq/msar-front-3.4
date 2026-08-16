import { t } from "@/utilities/I18nPlugin";

// --- Interfaces ---
export interface IValidator {
  name: string;
  message: string;
  check: (value: any, object?: any) => boolean;
  field2?: string;
}

export interface IValidatorError {
  fieldName: string;
  messages: string[];
}

export interface IValidationResult {
  success: boolean;
  errors: IValidatorError[];
}

export interface IFieldValidation {
  field: string;
  caption?: string;
  rules: IValidator[];
}

/**
 * useValidation composable - Provides validation functions and a validate() method for objects
 */
export function useValidation() {
  /**
   * Checks if a field has a non-empty value
   * @example
   * required()
   */
  function required(options: { message?: string } = {}): IValidator {
    return {
      name: "required",
      message: options.message ?? t("ValidationErrors.FieldRequired"),
      check: (val) => val !== null && val !== undefined && val !== "",
    };
  }

  /**
   * Validates if a value is a string
   * @example
   * string()
   */
  function string(options: { message?: string } = {}): IValidator {
    return {
      name: "string",
      message: options.message ?? t("ValidationErrors.FieldMustBeString"),
      check: (val) => typeof val === "string",
    };
  }

  /**
   * Validates if a value is numeric
   * @example
   * number()
   */
  function number(options: { message?: string } = {}): IValidator {
    return {
      name: "number",
      message: options.message ?? t("ValidationErrors.FieldMustBeNumber"),
      check: (val) => !isNaN(Number(val)),
    };
  }

  /**
   * Validates if a value is an integer
   * @example
   * integer()
   */
  function integer(options: { message?: string } = {}): IValidator {
    return {
      name: "integer",
      message: options.message ?? t("ValidationErrors.FieldMustBeInteger"),
      check: (val) => Number.isInteger(Number(val)),
    };
  }

  /**
   * Validates if a value is a float number
   * @example
   * float()
   */
  function float(options: { message?: string } = {}): IValidator {
    return {
      name: "float",
      message: options.message ?? t("ValidationErrors.FieldMustBeFloat"),
      check: (val) => /^-?\d+(\.\d+)?$/.test(val),
    };
  }

  /**
   * Validates if a value is a valid email
   * @example
   * email()
   */
  function email(options: { message?: string } = {}): IValidator {
    return {
      name: "email",
      message: options.message ?? t("ValidationErrors.FieldMustBeEmail"),
      check: (val) =>
        /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(val),
    };
  }

  /**
   * Checks if a field is equal to another field in the object
   * @example
   * sameAs({ field: 'password', caption: 'Password' })
   */
  function sameAs(
    field2: { field: string; caption?: string },
    options: { message?: string } = {}
  ): IValidator {
    return {
      name: "sameAs",
      message:
        options.message ??
        `${t("ValidationErrors.FieldNotSame")} ${field2.caption ?? field2.field}`,
      field2: field2.field,
      check: (val, obj) => val === obj?.[field2.field],
    };
  }

  /**
   * Validates that value is a non-null object, optionally checks for key with numeric value
   * @example
   * isObject({ key: 'id' })
   */
  function isObject(
    options: { key?: string; message?: string } = {}
  ): IValidator {
    return {
      name: "isObject",
      message: options.message ?? t("ValidationErrors.isObject"),
      check: (val) => {
        if (!val || typeof val !== "object") return false;
        if (options.key)
          return (
            val.hasOwnProperty(options.key) && Number(val[options.key]) > 0
          );
        return true;
      },
    };
  }

  /**
   * Checks if a field is a non-empty array
   * @example
   * isArray()
   */
  function isArray(options: { message?: string } = {}): IValidator {
    return {
      name: "isArray",
      message: options.message ?? t("ValidationErrors.isArray"),
      check: (val) => Array.isArray(val) && val.length > 0,
    };
  }

  /**
   * Checks if the value is a valid foreign key (not 0/null/undefined)
   * @example
   * foreignKey()
   */
  function foreignKey(options: { message?: string } = {}): IValidator {
    return {
      name: "foreignKey",
      message: options.message ?? t("ValidationErrors.ForeignKey"),
      check: (val) => val !== null && val !== undefined && val !== 0,
    };
  }

  /**
   * Checks that value is >= min
   * @example
   * min(3)
   */
  function min(value: number, options: { message?: string } = {}): IValidator {
    return {
      name: "min",
      message:
        options.message ??
        t("ValidationErrors.FiledLengthIsTooShort").replace(
          ":val",
          value.toString()
        ),
      check: (val) =>
        typeof val === "string" ? val.length >= value : Number(val) >= value,
    };
  }

  /**
   * Checks that value is <= max
   * @example
   * max(10)
   */
  function max(value: number, options: { message?: string } = {}): IValidator {
    return {
      name: "max",
      message:
        options.message ??
        t("ValidationErrors.FiledLengthIsTooLong").replace(
          ":val",
          value.toString()
        ),
      check: (val) =>
        typeof val === "string" ? val.length <= value : Number(val) <= value,
    };
  }

  /**
   * Checks if value or length is between min and max
   * @example
   * between(3, 10)
   */
  function between(
    minVal: number,
    maxVal: number,
    options: { message?: string } = {}
  ): IValidator {
    return {
      name: "between",
      message:
        options.message ??
        t("ValidationErrors.FieldMustBeBetween")
          .replace(":min", minVal.toString())
          .replace(":max", maxVal.toString()),
      check: (val) => {
        const num = typeof val === "string" ? val.length : Number(val);
        return num >= minVal && num <= maxVal;
      },
    };
  }

  /**
   * Checks if value is included in a list
   * @example
   * inList(['admin', 'user'])
   */
  function inList(list: any[], options: { message?: string } = {}): IValidator {
    return {
      name: "inList",
      message: options.message ?? t("ValidationErrors.ValueNotAllowed"),
      check: (val) => list.includes(val),
    };
  }

  /**
   * Validates if value is a valid URL
   * @example
   * url()
   */
  function url(options: { message?: string } = {}): IValidator {
    return {
      name: "url",
      message: options.message ?? t("ValidationErrors.FieldMustBeUrl"),
      check: (val) =>
        typeof val === "string" &&
        /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w\-._~:/?#\[\]@!$&'()*+,;=]*)?$/.test(
          val
        ),
    };
  }

  /**
   * Validates if value contains only alphabetic characters
   * @example
   * alphaOnly()
   */
  function alphaOnly(options: { message?: string } = {}): IValidator {
    return {
      name: "alphaOnly",
      message: options.message ?? t("ValidationErrors.OnlyLetters"),
      check: (val) =>
        typeof val === "string" && /^[a-zA-Z\u0600-\u06FF\s]+$/.test(val),
    };
  }

  /**
   * Validates if value contains only letters and numbers
   * @example
   * alphanumeric()
   */
  function alphanumeric(options: { message?: string } = {}): IValidator {
    return {
      name: "alphanumeric",
      message: options.message ?? t("ValidationErrors.OnlyLettersAndNumbers"),
      check: (val) =>
        typeof val === "string" && /^[a-zA-Z0-9\u0600-\u06FF\s]+$/.test(val),
    };
  }

  /**
   * Validates if value contains no whitespace
   * @example
   * noWhitespace()
   */
  function noWhitespace(options: { message?: string } = {}): IValidator {
    return {
      name: "noWhitespace",
      message: options.message ?? t("ValidationErrors.NoWhitespaceAllowed"),
      check: (val) => typeof val === "string" && !/\s/.test(val),
    };
  }

  /**
   * Validates using a custom regex pattern
   * @example
   * regex(/^[A-Z]+$/)
   */
  function regex(
    pattern: RegExp,
    options: { message?: string } = {}
  ): IValidator {
    return {
      name: "regex",
      message: options.message ?? t("ValidationErrors.InvalidFormat"),
      check: (val) => pattern.test(val),
    };
  }

  /**
   * Validates if value is a valid date string
   * @example
   * date()
   */
  function date(options: { message?: string } = {}): IValidator {
    return {
      name: "date",
      message: options.message ?? t("ValidationErrors.InvalidDate"),
      check: (val) => !isNaN(Date.parse(val)),
    };
  }

  /**
   * Validates if date is after a given minimum date
   * @example
   * afterDate("2020-01-01")
   */
  function afterDate(
    minDate: string,
    options: { message?: string } = {}
  ): IValidator {
    return {
      name: "afterDate",
      message:
        options.message ??
        t("ValidationErrors.DateMustBeAfter").replace(":date", minDate),
      check: (val) => new Date(val) > new Date(minDate),
    };
  }

  /**
   * Custom validator using a user-defined function
   * @example
   * custom((val) => val > 0, { message: "Must be greater than 0" })
   */
  function custom(
    fn: (val: any, object?: any) => boolean,
    options: { name?: string; message: string }
  ): IValidator {
    return {
      name: options.name ?? "custom",
      message: options.message,
      check: fn,
    };
  }

  /**
   * Validates an object against a list of field rules
   * @example
   * const result = validate(user, [{ field: "email", rules: [required(), email()] }]);
   */
  function validate(
    object: any,
    validators: IFieldValidation[]
  ): IValidationResult {
    const result: IValidationResult = { success: true, errors: [] };

    if (!object || validators.length === 0) return result;

    for (const ruleSet of validators) {
      const fieldVal = object[ruleSet.field];
      const error: IValidatorError = {
        fieldName: ruleSet.caption ?? ruleSet.field,
        messages: [],
      };

      for (const rule of ruleSet.rules) {
        const isValid = rule.check(fieldVal, object);
        if (!isValid) {
          error.messages.push(rule.message);
          result.success = false;
        }
      }

      if (error.messages.length > 0) result.errors.push(error);
    }

    return result;
  }

  return {
    validate,
    required,
    string,
    number,
    integer,
    float,
    email,
    sameAs,
    isObject,
    isArray,
    foreignKey,
    min,
    max,
    between,
    inList,
    url,
    alphaOnly,
    alphanumeric,
    noWhitespace,
    regex,
    date,
    afterDate,
    custom,
  };
}
