"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUnipassValidation = void 0;
const xmldom_1 = require("@xmldom/xmldom");
const getFirstTagText = (xml, tagName) => {
    const document = new xmldom_1.DOMParser().parseFromString(xml, "text/xml");
    const nodes = document.getElementsByTagName(tagName);
    const firstNode = nodes.item(0);
    const textContent = firstNode?.textContent?.trim();
    return textContent ? textContent : null;
};
const parseUnipassValidation = (xml, name) => {
    const ntceInfo = getFirstTagText(xml, "ntceInfo");
    return {
        name,
        ntceInfo: ntceInfo ?? "정상 응답",
        isValid: ntceInfo === null,
    };
};
exports.parseUnipassValidation = parseUnipassValidation;
