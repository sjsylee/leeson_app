"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeCustomsValidationParams = void 0;
const validation_1 = require("../validation");
const normalizePhoneNumber = (value) => {
    return value.replace(/[^0-9]/g, "");
};
const normalizePostalCode = (value) => {
    return value.replace(/[^0-9]/g, "");
};
const sanitizeCustomsValidationParams = (payload) => {
    const recipientName = (0, validation_1.sanitizeRequiredText)(payload.recipientName, "recipientName", 80);
    const ordererName = (0, validation_1.sanitizeRequiredText)(payload.ordererName, "ordererName", 80);
    const customsCode = (0, validation_1.sanitizeRequiredText)(payload.customsCode, "customsCode", 30).toUpperCase();
    const recipientPhone = normalizePhoneNumber((0, validation_1.sanitizeRequiredText)(payload.recipientPhone, "recipientPhone", 40));
    const postalCode = normalizePostalCode((0, validation_1.sanitizeRequiredText)(payload.postalCode, "postalCode", 20));
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
exports.sanitizeCustomsValidationParams = sanitizeCustomsValidationParams;
