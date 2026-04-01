import React, { useMemo, useState } from "react";
import { Row, Col, Typography, Divider, Input, Button, message } from "antd";
import {
  AuditOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import {
  ToneField,
  ToneGroup,
  TonePageHeading,
  ToneSectionCard,
  ToneStatTile,
  ToneStatusChip,
  pageToneStyles,
} from "../components/PageTone/PageTone";
import {
  customsValidationApi,
  settingsApi,
  type AppProfileStatus,
  type CustomsValidationOutcome,
  type CustomsValidationResult,
} from "../lib/electron";

const { Text } = Typography;

type CustomsValidationDraft = {
  recipientName: string;
  ordererName: string;
  customsCode: string;
  recipientPhone: string;
  postalCode: string;
};

const initialDraft: CustomsValidationDraft = {
  recipientName: "",
  ordererName: "",
  customsCode: "",
  recipientPhone: "",
  postalCode: "",
};

const getOutcomeMeta = (
  outcome: CustomsValidationOutcome
): {
  tagColor: "success" | "warning" | "error";
  tileAccent: "success" | "warning" | "default";
  title: string;
} => {
  if (outcome === "receiver_valid") {
    return {
      tagColor: "success",
      tileAccent: "success",
      title: "수취인 기준 검증 성공",
    };
  }

  if (outcome === "orderer_valid_instead") {
    return {
      tagColor: "warning",
      tileAccent: "warning",
      title: "주문자 정보만 검증 성공",
    };
  }

  return {
    tagColor: "error",
    tileAccent: "default",
    title: "검증 실패",
  };
};

export default function CustomsValidationPage() {
  const [draft, setDraft] = useState<CustomsValidationDraft>(initialDraft);
  const [result, setResult] = useState<CustomsValidationResult | null>(null);
  const [lastSubmittedDraft, setLastSubmittedDraft] = useState<CustomsValidationDraft | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<AppProfileStatus | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const isFormReady = Object.values(draft).every((value) => value.trim());
  const hasUnipassKey = status?.credentialsStored.unipassKey ?? false;
  const outcomeMeta = useMemo(
    () => (result ? getOutcomeMeta(result.outcome) : null),
    [result]
  );

  React.useEffect(() => {
    settingsApi
      .getStatus()
      .then((nextStatus) => {
        setStatus(nextStatus);
      })
      .catch(() => {
        setStatus(null);
      });
  }, []);

  const handleValidate = async () => {
    if (isValidating || !isFormReady || !hasUnipassKey) {
      return;
    }

    setIsValidating(true);

    try {
      const validationResult = await customsValidationApi.validate(draft);
      setResult(validationResult);
      setLastSubmittedDraft(draft);

      messageApi.success({
        content: "통관 검증이 완료되었습니다.",
        style: { color: "#EEE" },
      });
    } catch (error) {
      setResult(null);
      messageApi.error({
        content: error instanceof Error ? error.message : "통관 검증 중 오류가 발생했습니다.",
        style: { color: "#EEE" },
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handlePressEnter = () => {
    void handleValidate();
  };

  return (
    <>
      {contextHolder}
      <div>
        <TonePageHeading
          icon={<AuditOutlined style={{ fontSize: "20px", color: "#EEE" }} />}
          title="통관 검증"
        />
        <Divider />

        <Row gutter={[0, 16]} style={{ marginTop: 8 }}>
          <Col span={24}>
            <ToneSectionCard
              icon={<SafetyCertificateOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="검증 요청"
              extra={
                <Row gutter={[8, 8]} justify="end">
                  <Col>
                    <ToneStatusChip tone={isFormReady ? "success" : "default"}>
                      {isFormReady ? "검증 요청 가능" : "입력값 확인 필요"}
                    </ToneStatusChip>
                  </Col>
                  <Col>
                    <ToneStatusChip tone={hasUnipassKey ? "success" : "warning"}>
                      {hasUnipassKey ? "Unipass Key 준비됨" : "Unipass Key 필요"}
                    </ToneStatusChip>
                  </Col>
                  <Col>
                    <ToneStatusChip tone={result ? (outcomeMeta?.tagColor ?? "default") : "processing"}>
                      {result ? outcomeMeta?.title : "검증 대기"}
                    </ToneStatusChip>
                  </Col>
                </Row>
              }
            >
              <ToneGroup
                icon={<SearchOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title="기본 정보 입력"
                description="수취인 기준으로 먼저 검증하고, 주문자가 본인 통관고유부호를 잘못 입력한 경우를 구분하기 위해 주문자명도 함께 확인합니다."
                tag={
                  <ToneStatusChip tone={lastSubmittedDraft ? "success" : "processing"}>
                    {lastSubmittedDraft ? "최신 요청 반영됨" : "입력 대기"}
                  </ToneStatusChip>
                }
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={12} lg={8}>
                      <ToneField label="수취인명">
                        <Input
                          size="large"
                          placeholder="수취인명을 입력해주세요."
                          prefix={<UserOutlined />}
                          value={draft.recipientName}
                          onChange={(event) => {
                            setDraft((prev) => ({ ...prev, recipientName: event.target.value }));
                          }}
                          onPressEnter={handlePressEnter}
                        />
                      </ToneField>
                    </Col>
                  <Col xs={24} sm={12} lg={8}>
                      <ToneField label="주문자명">
                        <Input
                          size="large"
                          placeholder="주문자명을 입력해주세요."
                          prefix={<UserOutlined />}
                          value={draft.ordererName}
                          onChange={(event) => {
                            setDraft((prev) => ({ ...prev, ordererName: event.target.value }));
                          }}
                          onPressEnter={handlePressEnter}
                        />
                      </ToneField>
                    </Col>
                  <Col xs={24} sm={12} lg={8}>
                      <ToneField label="통관고유부호">
                        <Input
                          size="large"
                          placeholder="통관고유부호를 입력해주세요."
                          prefix={<SafetyCertificateOutlined />}
                          value={draft.customsCode}
                          onChange={(event) => {
                            setDraft((prev) => ({ ...prev, customsCode: event.target.value }));
                          }}
                          onPressEnter={handlePressEnter}
                        />
                      </ToneField>
                    </Col>
                  <Col xs={24} sm={12} lg={8}>
                      <ToneField label="수취인 전화번호">
                        <Input
                          size="large"
                          placeholder="전화번호를 입력해주세요."
                          prefix={<PhoneOutlined />}
                          value={draft.recipientPhone}
                          onChange={(event) => {
                            setDraft((prev) => ({ ...prev, recipientPhone: event.target.value }));
                          }}
                          onPressEnter={handlePressEnter}
                        />
                      </ToneField>
                    </Col>
                  <Col xs={24} sm={12} lg={8}>
                      <ToneField label="우편번호">
                        <Input
                          size="large"
                          placeholder="우편번호를 입력해주세요."
                          prefix={<EnvironmentOutlined />}
                          value={draft.postalCode}
                          onChange={(event) => {
                            setDraft((prev) => ({ ...prev, postalCode: event.target.value }));
                          }}
                          onPressEnter={handlePressEnter}
                        />
                      </ToneField>
                    </Col>
                  <Col span={24}>
                    <div style={{ ...pageToneStyles.actionStrip, marginTop: 4 }}>
                      <Row gutter={[12, 12]} align="middle" justify="space-between">
                        <Col flex="auto">
                          <Text style={{ ...pageToneStyles.fieldLabel, marginBottom: 0, display: "block" }}>
                            검증 액션
                          </Text>
                          <Text style={{ ...pageToneStyles.helperText, marginTop: 4 }}>
                            모든 필드를 입력하고 Unipass Key가 준비되면 바로 검증할 수 있습니다.
                          </Text>
                        </Col>
                        <Col xs={24} sm={12} md={7} lg={6} xl={5}>
                          <Button
                            block
                            size="large"
                            type="primary"
                            icon={<SearchOutlined />}
                            style={{ color: "#000" }}
                            disabled={!isFormReady || !hasUnipassKey}
                            loading={isValidating}
                            onClick={() => void handleValidate()}
                          >
                            통관 검증 실행
                          </Button>
                        </Col>
                        <Col xs={24} sm={12} md={5} lg={4} xl={4}>
                          <Button
                            block
                            size="large"
                            icon={<RedoOutlined />}
                            onClick={() => {
                              setDraft(initialDraft);
                              setResult(null);
                              setLastSubmittedDraft(null);
                            }}
                          >
                            초기화
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </ToneGroup>
            </ToneSectionCard>
          </Col>

          <Col span={24}>
            <ToneSectionCard
              icon={<AuditOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="검증 결과 패널"
            >
              <ToneGroup
                title="현재 결과 상태"
                tag={
                  <ToneStatusChip tone={result ? outcomeMeta?.tagColor : "default"}>
                    {result ? outcomeMeta?.title : "제출 전"}
                  </ToneStatusChip>
                }
              >
                {result && lastSubmittedDraft ? (
                  <>
                    <Row gutter={[12, 12]}>
                      <Col xs={24} md={12} xl={6}>
                        <ToneStatTile
                          label="결과 구분"
                          value={outcomeMeta?.title}
                          helper="수취인/주문자 비교 기준"
                          accent={outcomeMeta?.tileAccent}
                        />
                      </Col>
                      <Col xs={24} md={12} xl={6}>
                        <ToneStatTile
                          label="수취인 검증"
                          value={result.receiver.isValid ? "성공" : "실패"}
                          helper={result.receiver.name}
                          accent={result.receiver.isValid ? "success" : "warning"}
                        />
                      </Col>
                      <Col xs={24} md={12} xl={6}>
                        <ToneStatTile
                          label="주문자 검증"
                          value={result.orderer.isValid ? "성공" : "실패"}
                          helper={result.orderer.name}
                          accent={result.orderer.isValid ? "success" : "warning"}
                        />
                      </Col>
                      <Col xs={24} md={12} xl={6}>
                        <ToneStatTile
                          label="통관고유부호"
                          value={lastSubmittedDraft.customsCode}
                          helper="마지막 검증 요청 기준"
                          accent="default"
                        />
                      </Col>
                    </Row>
                    <div style={{ ...pageToneStyles.actionStrip, marginTop: 16 }}>
                      <Text style={pageToneStyles.infoValue}>{result.summary}</Text>
                      <Text style={pageToneStyles.helperText}>
                        수취인 응답: {result.receiver.ntceInfo}
                      </Text>
                      <Text style={pageToneStyles.helperText}>
                        주문자 응답: {result.orderer.ntceInfo}
                      </Text>
                    </div>
                  </>
                ) : (
                  <div style={pageToneStyles.infoPanel}>
                    <Text style={pageToneStyles.infoValue}>아직 검증 결과가 없습니다.</Text>
                    <Text style={pageToneStyles.helperText}>
                      {hasUnipassKey
                        ? "수취인명, 주문자명, 통관고유부호, 전화번호, 우편번호 입력 후 통관 검증 실행을 눌러주세요."
                        : "설정 페이지에서 Unipass Key를 먼저 저장한 뒤 통관 검증을 실행해주세요."}
                    </Text>
                  </div>
                )}
              </ToneGroup>
            </ToneSectionCard>
          </Col>
        </Row>
      </div>
    </>
  );
}
