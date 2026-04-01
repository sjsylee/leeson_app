import { sanitizeRequiredText } from "../validation";
import type { CustomsValidationRequest } from "../../types/settings";
import type { CustomsValidationParams } from "./types";

const normalizePhoneNumber = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};

const normalizePostalCode = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};

export const sanitizeCustomsValidationParams = (
  payload: CustomsValidationRequest
): CustomsValidationParams => {
  const recipientName = sanitizeRequiredText(payload.recipientName, "recipientName", 80);
  const ordererName = sanitizeRequiredText(payload.ordererName, "ordererName", 80);
  const customsCode = sanitizeRequiredText(payload.customsCode, "customsCode", 30).toUpperCase();
  const recipientPhone = normalizePhoneNumber(
    sanitizeRequiredText(payload.recipientPhone, "recipientPhone", 40)
  );
  const postalCode = normalizePostalCode(
    sanitizeRequiredText(payload.postalCode, "postalCode", 20)
  );

  if (recipientPhone.length < 8 || recipientPhone.length > 20) {
    throw new Error("recipientPhone is invalid.");
  }

  if (postalCode.length < 3 || postalCode.length > 10) {
    throw new Error("postalCode is invalid.");
  }

  return {
    recipientName,
    ordererName,
    customsCode,
    recipientPhone,
    postalCode,
  };
};
