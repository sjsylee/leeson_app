export interface CustomsValidationParams {
  recipientName: string;
  ordererName: string;
  customsCode: string;
  recipientPhone: string;
  postalCode: string;
}

export interface UnipassValidationDetail {
  name: string;
  ntceInfo: string;
  isValid: boolean;
}

export type CustomsValidationOutcome =
  | "receiver_valid"
  | "orderer_valid_instead"
  | "invalid";

export interface CustomsValidationResult {
  outcome: CustomsValidationOutcome;
  summary: string;
  receiver: UnipassValidationDetail;
  orderer: UnipassValidationDetail;
}
