import { getStoredCredentials } from "../../config/secrets";
import type { CustomsValidationRequest } from "../../types/settings";
import { fetchUnipassValidationXml } from "./endpoints";
import { sanitizeCustomsValidationParams } from "./params";
import { parseUnipassValidation } from "./parser";
import type { CustomsValidationResult } from "./types";

const deriveSummary = (result: CustomsValidationResult): string => {
  if (result.outcome === "receiver_valid") {
    return "수취인 정보 기준으로 통관 검증이 정상 확인되었습니다.";
  }

  if (result.outcome === "orderer_valid_instead") {
    return "수취인은 실패했고 주문자는 성공했습니다. 주문자가 본인 통관부호를 입력했을 가능성이 높아 수취인 기준으로 수정이 필요합니다.";
  }

  return "수취인/주문자 모두 통관 검증에 실패했습니다. 입력 정보와 통관고유부호를 다시 확인해주세요.";
};

export const validateCustoms = async (
  payload: CustomsValidationRequest
): Promise<CustomsValidationResult> => {
  const params = sanitizeCustomsValidationParams(payload);
  const credentials = await getStoredCredentials();
  const unipassKey = credentials.unipassKey?.trim();

  if (!unipassKey) {
    throw new Error("Unipass Key가 저장되어 있지 않습니다. 설정 페이지에서 먼저 저장해주세요.");
  }

  const [receiverXml, ordererXml] = await Promise.all([
    fetchUnipassValidationXml(params, unipassKey, params.recipientName),
    fetchUnipassValidationXml(params, unipassKey, params.ordererName),
  ]);

  const receiver = parseUnipassValidation(receiverXml, params.recipientName);
  const orderer = parseUnipassValidation(ordererXml, params.ordererName);

  const outcome = receiver.isValid
    ? "receiver_valid"
    : orderer.isValid
      ? "orderer_valid_instead"
      : "invalid";

  const result: CustomsValidationResult = {
    outcome,
    summary: "",
    receiver,
    orderer,
  };

  result.summary = deriveSummary(result);

  return result;
};
