"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeCoupangCategoryPredictParams = void 0;
const validation_1 = require("../validation");
const sanitizeOptionalText = (value, maxLength) => {
    const normalized = String(value ?? "").trim();
    if (normalized.length > maxLength) {
        throw new Error("Input text is too long.");
    }
    return normalized;
};
const sanitizeCoupangCategoryPredictParams = (payload) => {
    const productName = (0, validation_1.sanitizeRequiredText)(payload.productName, "productName", 200);
    const productDescription = sanitizeOptionalText(payload.productDescription, 2000);
    const brand = sanitizeOptionalText(payload.brand, 200);
    return {
        productName,
        productDescription,
        brand,
    };
};
exports.sanitizeCoupangCategoryPredictParams = sanitizeCoupangCategoryPredictParams;
