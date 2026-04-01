import type { CustomsValidationParams } from "./types";

const UNIPASS_VALIDATION_ENDPOINT =
  "https://unipass.customs.go.kr:38010/ext/rest/persEcmQry/retrievePersEcm";

const REQUEST_TIMEOUT_MS = 10000;

const getRequestUrl = (
  unipassKey: string,
  customsCode: string,
  name: string,
  phone: string,
  postalCode: string
): string => {
  const params = new URLSearchParams();

  params.set("crkyCn", unipassKey);
  params.set("persEcm", customsCode);
  params.set("pltxNm", name);
  params.set("cralTelno", phone);
  params.set("custPsno", postalCode);

  return `${UNIPASS_VALIDATION_ENDPOINT}?${params.toString()}`;
};

export const fetchUnipassValidationXml = async (
  params: CustomsValidationParams,
  unipassKey: string,
  targetName: string
): Promise<string> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      getRequestUrl(
        unipassKey,
        params.customsCode,
        targetName,
        params.recipientPhone,
        params.postalCode
      ),
      {
        method: "GET",
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Unipass request failed with status ${response.status}.`);
    }

    return response.text();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Unipass request timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
