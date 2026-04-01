import { createCoupangAuthorizationHeader } from "./auth";
import type { CoupangCategoryPredictParams } from "./types";

const COUPANG_API_BASE_URL = "https://api-gateway.coupang.com";
const COUPANG_PREDICT_PATH = "/v2/providers/openapi/apis/api/v1/categorization/predict";
const REQUEST_TIMEOUT_MS = 10000;

export const requestCoupangCategoryPrediction = async (
  params: CoupangCategoryPredictParams,
  accessKey: string,
  secretKey: string
): Promise<unknown> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const authorization = createCoupangAuthorizationHeader({
      accessKey,
      secretKey,
      method: "POST",
      path: COUPANG_PREDICT_PATH,
      query: "",
    });

    const response = await fetch(`${COUPANG_API_BASE_URL}${COUPANG_PREDICT_PATH}`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        productName: params.productName,
        productDescription: params.productDescription,
        brand: params.brand,
      }),
    });

    if (!response.ok) {
      let responseText = "";

      try {
        responseText = await response.text();
      } catch {
        responseText = "";
      }

      const suffix = responseText ? ` ${responseText}` : "";
      throw new Error(`카테고리 예측 요청에 실패했습니다. (HTTP ${response.status})${suffix}`);
    }

    try {
      return await response.json();
    } catch {
      throw new Error("카테고리 예측 응답을 해석하지 못했습니다.");
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("카테고리 예측 요청이 시간 초과되었습니다. 잠시 후 다시 시도해주세요.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
