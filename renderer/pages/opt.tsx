import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  Divider,
  InputNumber,
  Button,
  Input,
  Card,
} from "antd";
import {
  ColumnHeightOutlined,
  SettingOutlined,
  ExclamationCircleFilled,
  ToolOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { type AppProfile, type AppProfileStatus, settingsApi } from "../lib/electron";
import { ToneField, TonePageHeading, ToneStatusChip } from "../components/PageTone/PageTone";

const { Text } = Typography;

const emptyStatus: AppProfileStatus = {
  isConfigured: false,
  missingFields: [],
  credentialsStored: {
    dbUser: false,
    dbPassword: false,
    coupangAccessKey: false,
    coupangSecretKey: false,
    unipassKey: false,
  },
};

const SETTINGS_STATUS_CHANGED_EVENT = "settings-status-changed";

export default function NextPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selHeight, setSelHeight] = useState<number>();
  const [profile, setProfile] = useState<AppProfile>({
    HOST: null,
    PORT: null,
  });
  const [status, setStatus] = useState<AppProfileStatus>(emptyStatus);
  const [userValue, setUserValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [accessKeyValue, setAccessKeyValue] = useState("");
  const [secretKeyValue, setSecretKeyValue] = useState("");
  const [unipassKeyValue, setUnipassKeyValue] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingDbCredential, setIsSavingDbCredential] = useState(false);
  const [isClearingDbCredential, setIsClearingDbCredential] = useState(false);
  const [isSavingCoupangCredential, setIsSavingCoupangCredential] = useState(false);
  const [isClearingCoupangCredential, setIsClearingCoupangCredential] = useState(false);
  const [isSavingUnipassKey, setIsSavingUnipassKey] = useState(false);
  const [isClearingUnipassKey, setIsClearingUnipassKey] = useState(false);

  const loadSettings = async () => {
    const [profileResponse, statusResponse] = await Promise.all([
      settingsApi.getProfile(),
      settingsApi.getStatus(),
    ]);

    setProfile(profileResponse);
    setStatus(statusResponse);
  };

  const notifySettingsStatusChange = () => {
    window.dispatchEvent(new Event(SETTINGS_STATUS_CHANGED_EVENT));
  };

  useEffect(() => {
    const sh = localStorage.getItem("selHeight");
    setSelHeight(Number(sh) || 100);

    void loadSettings();
  }, []);

  const saveProfile = async () => {
    setIsSavingProfile(true);

    try {
      await settingsApi.saveProfile(profile);
      await loadSettings();
      notifySettingsStatusChange();
      messageApi.success({
        content: "연결 설정 저장 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : "연결 설정 저장 실패",
        style: { color: "#EEE" },
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const saveDbCredentials = async () => {
    if (!userValue || !passwordValue) {
      messageApi.error({
        content: "USER와 PASSWORD를 모두 입력해주세요!",
        style: { color: "#EEE" },
      });
      return;
    }

    setIsSavingDbCredential(true);

    try {
        const nextStatus = await settingsApi.saveDbCredentials({
          user: userValue,
          password: passwordValue,
        });

        setStatus(nextStatus);
      setUserValue("");
      setPasswordValue("");
      notifySettingsStatusChange();
      messageApi.success({
        content: "DB credential 저장 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : "DB credential 저장 실패",
        style: { color: "#EEE" },
      });
    } finally {
      setIsSavingDbCredential(false);
    }
  };

  const clearDbCredentials = async () => {
    setIsClearingDbCredential(true);

    try {
      const nextStatus = await settingsApi.clearDbCredentials();
      setStatus(nextStatus);
      setUserValue("");
      setPasswordValue("");
      notifySettingsStatusChange();
      messageApi.success({
        content: "DB credential 제거 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : "DB credential 제거 실패",
        style: { color: "#EEE" },
      });
    } finally {
      setIsClearingDbCredential(false);
    }
  };

  const saveCoupangCredentials = async () => {
    if (!accessKeyValue || !secretKeyValue) {
      messageApi.error({
        content: "Access Key와 Secret Key를 모두 입력해주세요!",
        style: { color: "#EEE" },
      });
      return;
    }

    setIsSavingCoupangCredential(true);

    try {
        const nextStatus = await settingsApi.saveCoupangCredentials({
          accessKey: accessKeyValue,
          secretKey: secretKeyValue,
        });

        setStatus(nextStatus);
      setAccessKeyValue("");
      setSecretKeyValue("");
      notifySettingsStatusChange();
      messageApi.success({
        content: "Coupang Open API key 저장 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : "Coupang Open API key 저장 실패",
        style: { color: "#EEE" },
      });
    } finally {
      setIsSavingCoupangCredential(false);
    }
  };

  const clearCoupangCredentials = async () => {
    setIsClearingCoupangCredential(true);

    try {
      const nextStatus = await settingsApi.clearCoupangCredentials();
      setStatus(nextStatus);
      setAccessKeyValue("");
      setSecretKeyValue("");
      notifySettingsStatusChange();
      messageApi.success({
        content: "Coupang Open API key 제거 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : "Coupang Open API key 제거 실패",
        style: { color: "#EEE" },
      });
    } finally {
      setIsClearingCoupangCredential(false);
    }
  };

  const saveUnipassKey = async () => {
    if (!unipassKeyValue) {
      messageApi.error({
        content: "Unipass Key를 입력해주세요!",
        style: { color: "#EEE" },
      });
      return;
    }

    setIsSavingUnipassKey(true);

    try {
      const nextStatus = await settingsApi.saveUnipassKey({
        unipassKey: unipassKeyValue,
      });

      setStatus(nextStatus);
      setUnipassKeyValue("");
      notifySettingsStatusChange();
      messageApi.success({
        content: "Unipass Key 저장 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : "Unipass Key 저장 실패",
        style: { color: "#EEE" },
      });
    } finally {
      setIsSavingUnipassKey(false);
    }
  };

  const clearUnipassKey = async () => {
    setIsClearingUnipassKey(true);

    try {
      const nextStatus = await settingsApi.clearUnipassKey();

      setStatus(nextStatus);
      setUnipassKeyValue("");
      notifySettingsStatusChange();
      messageApi.success({
        content: "Unipass Key 제거 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : "Unipass Key 제거 실패",
        style: { color: "#EEE" },
      });
    } finally {
      setIsClearingUnipassKey(false);
    }
  };

  const hasMissingConfig = !status.isConfigured;
  const isProfileConfigured = Boolean(profile.HOST && profile.PORT);
  const isDbCredentialConfigured =
    status.credentialsStored.dbUser && status.credentialsStored.dbPassword;
  const isCoupangCredentialConfigured =
    status.credentialsStored.coupangAccessKey && status.credentialsStored.coupangSecretKey;
  const isUnipassKeyConfigured = status.credentialsStored.unipassKey;
  const areAllSecretsConfigured =
    isDbCredentialConfigured && isCoupangCredentialConfigured;
  const missingFieldsLabel =
    status.missingFields.length > 0
      ? `누락 항목: ${status.missingFields.join(", ")}`
      : "모든 필수 설정이 준비되었습니다.";

  const overviewCardStyle: React.CSSProperties = {
    marginTop: 24,
    background: "linear-gradient(135deg, rgba(11, 22, 37, 0.58), rgba(21, 94, 149, 0.34))",
    border: "1px solid rgba(238, 238, 238, 0.12)",
    borderRadius: 20,
    boxShadow: "0px 18px 36px rgba(0, 0, 0, 0.18)",
  };

  const sectionCardStyle: React.CSSProperties = {
    background: "rgba(8, 19, 33, 0.34)",
    border: "1px solid rgba(238, 238, 238, 0.12)",
    borderRadius: 20,
    boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.16)",
  };

  const groupStyle: React.CSSProperties = {
    marginTop: 16,
    padding: 16,
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "LINESeedKR-Bd",
    fontSize: 20,
    color: "#EEE",
  };

  const groupTitleStyle: React.CSSProperties = {
    display: "block",
    color: "#EEE",
    fontFamily: "LINESeedKR-Bd",
    fontSize: 15,
  };

  return (
    <>
      {contextHolder}
      <div>
        <TonePageHeading
          icon={<SettingOutlined style={{ fontSize: "20px", color: "#EEE" }} />}
          title="설정"
        />
        <Divider />
        <Card bordered={false} style={overviewCardStyle}>
          <Row gutter={[16, 16]} justify="space-between" align="middle">
            <Col flex="auto">
              <Row gutter={[0, 6]}>
                <Col span={24}>
                  <Row align="middle" gutter={8}>
                    <Col>
                      {hasMissingConfig ? (
                        <ExclamationCircleFilled style={{ fontSize: 18, color: "#FFF6B3" }} />
                      ) : (
                        <SafetyCertificateOutlined style={{ fontSize: 18, color: "#CDFADB" }} />
                      )}
                    </Col>
                    <Col>
                      <Text style={{ fontFamily: "LINESeedKR-Bd", fontSize: 16, color: "#EEE" }}>
                        현재 설정 상태
                      </Text>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Text style={{ color: "#DCE4F0", fontSize: 13, lineHeight: 1.7 }}>
                    {hasMissingConfig
                      ? missingFieldsLabel
                      : "DB 연결 정보와 보안 키가 모두 준비되었습니다."}
                  </Text>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={[8, 8]} justify="end">
                <Col>
                  <ToneStatusChip tone={hasMissingConfig ? "error" : "success"}>
                    {hasMissingConfig ? "연결 설정 필요" : "연결 설정 완료"}
                  </ToneStatusChip>
                </Col>
                <Col>
                  <ToneStatusChip tone={areAllSecretsConfigured ? "success" : "warning"}>
                    {areAllSecretsConfigured ? "보안 키 저장 완료" : "보안 키 추가 필요"}
                  </ToneStatusChip>
                </Col>
                <Col>
                  <ToneStatusChip tone={isUnipassKeyConfigured ? "processing" : "default"}>
                    {isUnipassKeyConfigured ? "Unipass Key 저장됨" : "Unipass Key 선택 항목"}
                  </ToneStatusChip>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Row gutter={[0, 16]} style={{ marginTop: 20 }}>
          <Col span={24}>
            <Card bordered={false} style={sectionCardStyle}>
              <Row gutter={[0, 0]}>
                <Col span={24}>
                  <Row align="middle" gutter={8}>
                    <Col>
                      <ToolOutlined style={{ fontSize: 18, color: "#EEE" }} />
                    </Col>
                    <Col>
                      <Text style={sectionTitleStyle}>DB connection</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <div style={groupStyle}>
                <Row gutter={[12, 12]} justify="space-between" align="middle">
                  <Col flex="auto">
                    <Text style={groupTitleStyle}>연결 프로필</Text>
                  </Col>
                  <Col>
                    <ToneStatusChip tone={isProfileConfigured ? "success" : "warning"}>
                      {isProfileConfigured ? "프로필 입력 완료" : "프로필 입력 필요"}
                    </ToneStatusChip>
                  </Col>
                </Row>
                <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                  <Col xs={24} md={8}>
                    <ToneField label="HOST">
                      <Input
                        size="large"
                        placeholder="HOST"
                        value={profile.HOST ?? ""}
                        onChange={(event) =>
                          setProfile((prev) => ({ ...prev, HOST: event.target.value || null }))
                        }
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={8}>
                    <ToneField label="PORT">
                      <InputNumber
                        size="large"
                        style={{ width: "100%" }}
                        placeholder="PORT"
                        value={profile.PORT ?? undefined}
                        onChange={(value) =>
                          setProfile((prev) => ({
                            ...prev,
                            PORT: typeof value === "number" ? value : null,
                          }))
                        }
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={8}>
                    <ToneField label="연결 프로필 저장">
                      <Button
                        block
                        size="large"
                        type="primary"
                        style={{ color: "#000" }}
                        loading={isSavingProfile}
                        onClick={() => void saveProfile()}
                      >
                        연결 프로필 저장
                      </Button>
                    </ToneField>
                  </Col>
                </Row>
              </div>

              <div style={groupStyle}>
                <Row gutter={[12, 12]} justify="space-between" align="middle">
                  <Col flex="auto">
                    <Row align="middle" gutter={8}>
                      <Col>
                        <SafetyCertificateOutlined style={{ fontSize: 16, color: "#EEE" }} />
                      </Col>
                      <Col>
                        <Text style={groupTitleStyle}>DB Credential</Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <ToneStatusChip tone={isDbCredentialConfigured ? "success" : "warning"}>
                      {isDbCredentialConfigured ? "Keychain 저장 완료" : "Keychain 미설정"}
                    </ToneStatusChip>
                  </Col>
                </Row>
                <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                  <Col xs={24} md={12}>
                    <ToneField label="USER">
                      <Input
                        size="large"
                        placeholder="USER"
                        value={userValue}
                        onChange={(event) => setUserValue(event.target.value)}
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={12}>
                    <ToneField label="PASSWORD">
                      <Input.Password
                        size="large"
                        placeholder="PASSWORD"
                        value={passwordValue}
                        onChange={(event) => setPasswordValue(event.target.value)}
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={12}>
                    <ToneField label="DB Credential 저장">
                      <Button
                        block
                        size="large"
                        type="primary"
                        style={{ color: "#000" }}
                        loading={isSavingDbCredential}
                        onClick={() => void saveDbCredentials()}
                      >
                        DB Credential 저장
                      </Button>
                    </ToneField>
                  </Col>
                  <Col xs={24} md={12}>
                    <ToneField label="DB Credential 제거">
                      <Button
                        block
                        size="large"
                        danger
                        icon={<DeleteOutlined />}
                        loading={isClearingDbCredential}
                        onClick={() => void clearDbCredentials()}
                      >
                        DB Credential 제거
                      </Button>
                    </ToneField>
                  </Col>
                </Row>
              </div>

              <div style={groupStyle}>
                <Row gutter={[12, 12]} justify="space-between" align="middle">
                  <Col flex="auto">
                    <Row align="middle" gutter={8}>
                      <Col>
                        <KeyOutlined style={{ fontSize: 16, color: "#EEE" }} />
                      </Col>
                      <Col>
                        <Text style={groupTitleStyle}>Unipass Key</Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <ToneStatusChip tone={isUnipassKeyConfigured ? "success" : "default"}>
                      {isUnipassKeyConfigured ? "Keychain 저장 완료" : "선택 입력"}
                    </ToneStatusChip>
                  </Col>
                </Row>
                <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                  <Col xs={24} md={12}>
                    <ToneField label="Unipass Key">
                      <Input.Password
                        size="large"
                        placeholder="Unipass Key"
                        value={unipassKeyValue}
                        onChange={(event) => setUnipassKeyValue(event.target.value)}
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={6}>
                    <ToneField label="Unipass Key 저장">
                      <Button
                        block
                        size="large"
                        type="primary"
                        style={{ color: "#000" }}
                        loading={isSavingUnipassKey}
                        onClick={() => void saveUnipassKey()}
                      >
                        Unipass Key 저장
                      </Button>
                    </ToneField>
                  </Col>
                  <Col xs={24} md={6}>
                    <ToneField label="Unipass Key 제거">
                      <Button
                        block
                        size="large"
                        danger
                        icon={<DeleteOutlined />}
                        loading={isClearingUnipassKey}
                        onClick={() => void clearUnipassKey()}
                      >
                        Unipass Key 제거
                      </Button>
                    </ToneField>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card bordered={false} style={sectionCardStyle}>
              <Row gutter={[0, 0]}>
                <Col span={24}>
                  <Row align="middle" gutter={8}>
                    <Col>
                      <KeyOutlined style={{ fontSize: 18, color: "#EEE" }} />
                    </Col>
                    <Col>
                      <Text style={sectionTitleStyle}>Coupang Open API</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <div style={groupStyle}>
                <Row gutter={[12, 12]} justify="space-between" align="middle">
                  <Col flex="auto">
                    <Text style={groupTitleStyle}>Open API Key</Text>
                  </Col>
                  <Col>
                    <ToneStatusChip tone={isCoupangCredentialConfigured ? "success" : "warning"}>
                      {isCoupangCredentialConfigured ? "Keychain 저장 완료" : "Keychain 미설정"}
                    </ToneStatusChip>
                  </Col>
                </Row>
                <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                  <Col xs={24} md={12}>
                    <ToneField label="Access Key">
                      <Input
                        size="large"
                        placeholder="Access Key"
                        value={accessKeyValue}
                        onChange={(event) => setAccessKeyValue(event.target.value)}
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={12}>
                    <ToneField label="Secret Key">
                      <Input.Password
                        size="large"
                        placeholder="Secret Key"
                        value={secretKeyValue}
                        onChange={(event) => setSecretKeyValue(event.target.value)}
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={12}>
                    <ToneField label="Open API Key 저장">
                      <Button
                        block
                        size="large"
                        type="primary"
                        style={{ color: "#000" }}
                        loading={isSavingCoupangCredential}
                        onClick={() => void saveCoupangCredentials()}
                      >
                        Open API Key 저장
                      </Button>
                    </ToneField>
                  </Col>
                  <Col xs={24} md={12}>
                    <ToneField label="Open API Key 제거">
                      <Button
                        block
                        size="large"
                        danger
                        icon={<DeleteOutlined />}
                        loading={isClearingCoupangCredential}
                        onClick={() => void clearCoupangCredentials()}
                      >
                        Open API Key 제거
                      </Button>
                    </ToneField>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card bordered={false} style={sectionCardStyle}>
              <Row gutter={[0, 0]}>
                <Col span={24}>
                  <Row align="middle" gutter={8}>
                    <Col>
                      <ColumnHeightOutlined style={{ fontSize: 18, color: "#EEE" }} />
                    </Col>
                    <Col>
                      <Text style={sectionTitleStyle}>App options</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <div style={groupStyle}>
                <Row gutter={[12, 12]} justify="space-between" align="middle">
                  <Col flex="auto">
                    <Text style={groupTitleStyle}>SELECT 높이 설정</Text>
                  </Col>
                  <Col>
                    <ToneStatusChip tone="processing">현재 값 {selHeight ?? 100}px</ToneStatusChip>
                  </Col>
                </Row>
                <Row gutter={[12, 12]} align="middle" style={{ marginTop: 12 }}>
                  <Col xs={24} md={8}>
                    <ToneField label="SELECT 높이">
                      <InputNumber
                        size="large"
                        style={{ width: "100%" }}
                        value={selHeight}
                        onChange={(value) => {
                          const nextValue = typeof value === "number" ? value : 100;
                          setSelHeight(nextValue);
                          localStorage.setItem("selHeight", nextValue.toString());
                        }}
                        min={100}
                        suffix="px"
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={16}>
                    <Text style={{ color: "#EDF4C2", fontSize: 13, lineHeight: 1.6 }}>
                      💡 옵션 한줄당 32px 입니다.
                    </Text>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
