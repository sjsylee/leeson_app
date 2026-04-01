import type { CoupangCategoryPredictRequest } from "../../types/settings";
import { sanitizeRequiredText } from "../validation";
import type { CoupangCategoryPredictParams } from "./types";

const sanitizeOptionalText = (value: string, maxLength: number): string => {
  const normalized = String(value ?? "").trim();

  if (normalized.length > maxLength) {
    throw new Error("Input text is too long.");
  }

  return normalized;
};

export const sanitizeCoupangCategoryPredictParams = (
  payload: CoupangCategoryPredictRequest
): CoupangCategoryPredictParams => {
  const productName = sanitizeRequiredText(payload.productName, "productName", 200);
  const productDescription = sanitizeOptionalText(payload.productDescription, 2000);
  const brand = sanitizeOptionalText(payload.brand, 200);

  return {
    productName,
    productDescription,
    brand,
  };
};
