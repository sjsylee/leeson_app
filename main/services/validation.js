"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePositiveInteger = exports.sanitizeRequiredText = exports.sanitizeSearchQuery = void 0;
const sanitizeSearchQuery = (query) => {
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
exports.sanitizeSearchQuery = sanitizeSearchQuery;
const sanitizeRequiredText = (value, fieldName, maxLength = 255) => {
    const normalized = String(value ?? "").trim();
    if (normalized.length === 0) {
        throw new Error(`${fieldName} is required.`);
    }
    if (normalized.length > maxLength) {
        throw new Error(`${fieldName} is too long.`);
    }
    return normalized;
};
exports.sanitizeRequiredText = sanitizeRequiredText;
const sanitizePositiveInteger = (value, fieldName) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`${fieldName} must be a positive integer.`);
    }
    return parsed;
};
exports.sanitizePositiveInteger = sanitizePositiveInteger;
