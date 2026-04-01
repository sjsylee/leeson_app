export const sanitizeSearchQuery = (query: string): string => {
  const normalized = String(query ?? "").trim();

  if (normalized.length === 0) {
    return "";
  }

  if (normalized.length > 100) {
    throw new Error("Search query is too long.");
  }

  if (/^[%_]+$/.test(normalized)) {
    throw new Error("Search query is invalid.");
  }

  return normalized;
};

export const sanitizeRequiredText = (
  value: string,
  fieldName: string,
  maxLength = 255
): string => {
  const normalized = String(value ?? "").trim();

  if (normalized.length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} is too long.`);
  }

  return normalized;
};

export const sanitizePositiveInteger = (
  value: number | string,
  fieldName: string
): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }

  return parsed;
};
