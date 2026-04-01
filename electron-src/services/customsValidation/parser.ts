import { DOMParser } from "@xmldom/xmldom";
import type { UnipassValidationDetail } from "./types";

const getFirstTagText = (xml: string, tagName: string): string | null => {
  const document = new DOMParser().parseFromString(xml, "text/xml");
  const nodes = document.getElementsByTagName(tagName);
  const firstNode = nodes.item(0);
  const textContent = firstNode?.textContent?.trim();

  return textContent ? textContent : null;
};

export const parseUnipassValidation = (
  xml: string,
  name: string
): UnipassValidationDetail => {
  const ntceInfo = getFirstTagText(xml, "ntceInfo");

  return {
    name,
    ntceInfo: ntceInfo ?? "정상 응답",
    isValid: ntceInfo === null,
  };
};
