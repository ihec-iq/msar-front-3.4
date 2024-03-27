import { t } from "./I18nPlugin";
import type { IValidator } from "./Validation";

//#region Rols
export function email(options: { message: string } = { message: "" }) {
    const validator: IValidator = {
        regexp: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
        message: options.message != "" ? options.message : t("ValidationErrors.FieldMustBeEmail"),
    };
    return validator;
}
export function required(options: { message: string } = { message: "" }): IValidator {
    const validator: IValidator = {
        regexp: /^(?!undefined$|^$).{1,}$/,
        message: options.message != "" ? options.message : t("ValidationErrors.FieldRequired"),
    }
    return validator;
};

export function number(options: { message: string } = { message: "" }): IValidator {
    const validator: IValidator = {
        regexp: /^-?\d*\.?\d+$/,
        message: options.message != "" ? options.message : t("ValidationErrors.FieldMustBeNumber"),
    }
    return validator;
};
export function integer(options: { message: string } = { message: "" }): IValidator {
    const validator: IValidator = {
        regexp: /^-?\d+$/,
        message: options.message != "" ? options.message : t("ValidationErrors.FieldMustBeInteger"),
    }
    return validator;
};
export function float(options: { message: string } = { message: "" }): IValidator {
    const validator: IValidator = {
        regexp: /^-?\d+(\.\d+)?$/,
        message: options.message != "" ? options.message : t("ValidationErrors.FieldMustBeFloat"),
    }
    return validator;
};

export function min(value: Number, options: { message: string } = { message: "" }): IValidator {
    let message = t("ValidationErrors.FiledLengthIsTooShort");
    if (options.message != "") {
        message = options.message.replace(":val", value.toString())
    }
    const validator: IValidator = {
        regexp: new RegExp(`^.{${value},}$`),
        message: message,
    };
    return validator;
}

export function max(value: Number, options: { message: string } = { message: "" }): IValidator {
    let message = t("ValidationErrors.FiledLengthIsTooLong");
    if (options.message != "") {
        message = options.message.replace(":val", value.toString())
    }
    const validator: IValidator = {
        regexp: new RegExp(`^.{0,${value}}$`),
        message: message,
    };
    return validator;
}
//#endregion
