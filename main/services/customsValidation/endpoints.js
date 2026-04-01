"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUnipassValidationXml = void 0;
const UNIPASS_VALIDATION_ENDPOINT = "https://unipass.customs.go.kr:38010/ext/rest/persEcmQry/retrievePersEcm";
const REQUEST_TIMEOUT_MS = 10000;
const getRequestUrl = (unipassKey, customsCode, name, phone, postalCode) => {
    const params = new URLSearchParams();
    params.set("crkyCn", unipassKey);
    params.set("persEcm", customsCode);
    params.set("pltxNm", name);
    params.set("cralTelno", phone);
    params.set("custPsno", postalCode);
    return `${UNIPASS_VALIDATION_ENDPOINT}?${params.toString()}`;
};
const fetchUnipassValidationXml = async (params, unipassKey, targetName) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, REQUEST_TIMEOUT_MS);
    try {
        const response = await fetch(getRequestUrl(unipassKey, params.customsCode, targetName, params.recipientPhone, params.postalCode), {
            method: "GET",
            signal: controller.signal,
        });
        if (!response.ok) {
            throw new Error(`Unipass request failed with status ${response.status}.`);
        }
        return response.text();
    }
    catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error("Unipass request timed out.");
        }
        throw error;
    }
    finally {
        clearTimeout(timeout);
    }
};
exports.fetchUnipassValidationXml = fetchUnipassValidationXml;
