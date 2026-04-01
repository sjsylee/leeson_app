import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  Select,
  Divider,
  Input,
  Button,
  Popconfirm,
  Tag,
} from "antd";
import {
  SearchOutlined,
  LinkOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  CheckCircleTwoTone,
  WarningTwoTone,
  CloudDownloadOutlined,
  RedoOutlined,
  FormOutlined,
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
import { keywordApi } from "../lib/electron";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const { Text } = Typography;

type KeywordOption = {
  value: string;
  label: string;
};

export default function NextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<KeywordOption[]>([]);
  const [value, setValue] = useState<string>();
  const [uploadValue, setUploadValue] = useState<string>();
  const [savePath, setSavePath] = useState<string>();

  const fetch = (
    nextValue: string,
    callback: (options: KeywordOption[]) => void
  ) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    currentValue = nextValue;

    const delayedSearch = () => {
      keywordApi.search({ q: nextValue }).then((response) => {
        if (currentValue === nextValue) {
          callback(response.result);
        }
      });
    };

    if (nextValue && nextValue.length > 1) {
      timeout = setTimeout(delayedSearch, 300);
    } else {
      callback([]);
    }
  };

  useEffect(() => {
    const storedPath = localStorage.getItem("savePath");
    setSavePath(storedPath ?? undefined);
  }, []);

  const handleSearch = (nextValue: string) => {
    fetch(nextValue, setData);
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    console.log(nextValue);
  };

  const relatedKeywords = (value ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  const visibleKeywords = relatedKeywords.slice(0, 10);
  const hiddenKeywordCount = Math.max(relatedKeywords.length - visibleKeywords.length, 0);
  const isKeywordReady = Boolean(value?.trim() && uploadValue?.trim());
  const hasSavePath = Boolean(savePath?.trim());
  const hasTooManyKeywords = relatedKeywords.length > 10;
  const exceedsCharLimit = (value?.length ?? 0) > 100;

  const handleClose = (removedTag: string) => {
    const nextTags = relatedKeywords.filter((keyword) => keyword !== removedTag);
    setValue(nextTags.join(","));
  };

  return (
    <>
      {contextHolder}
      <div className="layout-content">
        <TonePageHeading
          icon={<FormOutlined style={{ fontSize: "20px", color: "#EEE" }} />}
          title="키워드 추가"
        />
        <Divider />

        <Row gutter={[0, 16]} style={{ marginTop: 8 }}>
          <Col span={24}>
            <ToneSectionCard
              icon={<SearchOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="키워드 구성"
              extra={
                <Row gutter={[8, 8]} justify="end">
                  <Col>
                    <ToneStatusChip tone={isKeywordReady ? "success" : "warning"}>
                      {isKeywordReady ? "업로드 준비 완료" : "입력값 확인 필요"}
                    </ToneStatusChip>
                  </Col>
                  <Col>
                    <ToneStatusChip tone={hasTooManyKeywords ? "error" : "processing"}>
                      {`연관키워드 ${relatedKeywords.length}개`}
                    </ToneStatusChip>
                  </Col>
                  <Col>
                    <ToneStatusChip tone={hasSavePath ? "success" : "default"}>
                      {hasSavePath ? "저장 경로 준비됨" : "저장 경로 미입력"}
                    </ToneStatusChip>
                  </Col>
                </Row>
              }
            >
              <ToneGroup
                icon={<SearchOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title="기존 키워드 검색"
                tag={
                  <ToneStatusChip tone={value?.trim() ? "success" : "default"}>
                    {value?.trim() ? "불러오기 완료" : "선택 대기"}
                  </ToneStatusChip>
                }
              >
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} xl={18}>
                    <ToneField label="기존 키워드 검색">
                      <Select<string, KeywordOption>
                        style={{ width: "100%" }}
                        size="large"
                        showSearch
                        placeholder="기존 키워드를 검색해주세요."
                        defaultActiveFirstOption={false}
                        suffixIcon={null}
                        filterOption={false}
                        notFoundContent={null}
                        onSearch={handleSearch}
                        onChange={handleChange}
                        options={data}
                        allowClear
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} xl={6}>
                    <ToneField label="편집 초기화">
                      <Button
                        block
                        size="large"
                        type="primary"
                        icon={<RedoOutlined />}
                        style={{ color: "#000" }}
                        onClick={() => {
                          setValue(undefined);
                          setUploadValue(undefined);
                        }}
                      >
                        초기화
                      </Button>
                    </ToneField>
                  </Col>
                </Row>
              </ToneGroup>

              <ToneGroup
                icon={<LinkOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title="연관키워드 매칭"
                tag={
                  <ToneStatusChip tone={isKeywordReady ? "success" : "warning"}>
                    {isKeywordReady ? "업로드 가능" : "기준/연관키워드 필요"}
                  </ToneStatusChip>
                }
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={6}>
                    <ToneField label="기준 키워드">
                      <Input
                        size="large"
                        value={uploadValue}
                        onChange={(event) => {
                          setUploadValue(event.target.value);
                        }}
                        allowClear
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={18}>
                    <ToneField label="연관키워드">
                      <Input
                        size="large"
                        placeholder="연관키워드를 ',' 로 구분하여 입력해주세요."
                        value={value}
                        onChange={(event) => {
                          setValue(
                            event.target.value
                              .split(",")
                              .map((keyword) => keyword.trim())
                              .filter((keyword) => keyword.length <= 20)
                              .join(",")
                          );
                        }}
                        allowClear
                      />
                    </ToneField>
                  </Col>
                </Row>

                <div style={{ ...pageToneStyles.actionStrip, marginTop: 16 }}>
                  <Row gutter={[12, 12]}>
                    <Col span={24}>
                      <Text style={{ ...pageToneStyles.fieldLabel, marginBottom: 10 }}>미리보기 태그</Text>
                      <div>
                        {visibleKeywords.length > 0 ? (
                          visibleKeywords.map((keyword) => (
                            <Tag
                              key={keyword}
                              color="geekblue"
                              closable
                              style={{ marginBottom: 8 }}
                              onClose={(event) => {
                                event.preventDefault();
                                handleClose(keyword);
                              }}
                            >
                              {keyword}
                            </Tag>
                          ))
                        ) : (
                          <Text style={{ color: "#DCE4F0", fontSize: 12 }}>
                            입력된 연관키워드가 아직 없습니다.
                          </Text>
                        )}
                        {hiddenKeywordCount > 0 ? (
                          <Tag color="gold" style={{ marginBottom: 8 }}>
                            {`+${hiddenKeywordCount}개 더`}
                          </Tag>
                        ) : null}
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <ToneStatTile
                        label="연관키워드 수"
                        value={`${relatedKeywords.length}개`}
                        helper="권장 수량은 10개 이내입니다."
                        accent={hasTooManyKeywords ? "warning" : "success"}
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <ToneStatTile
                        label="문자 수"
                        value={`${value?.length ?? 0} / 100`}
                        helper="100자를 초과하면 저장 과정에서 오류가 날 수 있습니다."
                        accent={exceedsCharLimit ? "warning" : "success"}
                      />
                    </Col>
                  </Row>
                </div>
              </ToneGroup>
            </ToneSectionCard>
          </Col>

          <Col span={24}>
            <ToneSectionCard
              icon={<DatabaseOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="업로드 및 다운로드"
            >
              <ToneGroup
                icon={<CloudUploadOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title="키워드 업로드"
                tag={
                  <ToneStatusChip tone={isKeywordReady ? "success" : "warning"}>
                    {isKeywordReady ? "실행 가능" : "입력 대기"}
                  </ToneStatusChip>
                }
              >
                <div style={pageToneStyles.actionStrip}>
                  <Row gutter={[12, 12]} justify="space-between" align="middle">
                    <Col flex="auto">
                      <Text style={pageToneStyles.helperText}>
                        기준 키워드 <Text style={{ color: "#EEE" }}>{uploadValue || "-"}</Text> 와
                        연관키워드 <Text style={{ color: "#EEE" }}>{value || "-"}</Text> 를 함께
                        저장합니다.
                      </Text>
                    </Col>
                    <Col>
                      <Button
                        size="large"
                        type="primary"
                        icon={<DatabaseOutlined />}
                        disabled={!isKeywordReady}
                        style={!isKeywordReady ? { color: "#EEE" } : { color: "#000" }}
                        loading={isLoading}
                        onClick={async () => {
                          setIsLoading(true);

                          const result = await keywordApi.upload({
                            kwd: uploadValue ?? "",
                            related_kwd: value ?? "",
                          });

                          if (!result.result) {
                            if (result.errorLog.includes("Duplicate")) {
                              messageApi.error({
                                content: "중복되는 키워드 값이 존재합니다!",
                                style: { color: "#EEE" },
                                icon: <WarningTwoTone twoToneColor="#C70039" />,
                              });
                            } else if (result.errorLog.includes("Data too long")) {
                              messageApi.error({
                                content: "키워드가 100자를 초과하였습니다!",
                                style: { color: "#EEE" },
                                icon: <WarningTwoTone twoToneColor="#C70039" />,
                              });
                            } else {
                              messageApi.error({
                                content: "에러 발생! 문의요망",
                                style: { color: "#EEE" },
                                icon: <WarningTwoTone twoToneColor="#C70039" />,
                              });
                            }
                          } else if (result.errorLog === "update") {
                            messageApi.success({
                              content: "기존 키워드 업데이트 성공!",
                              style: { color: "#EEE" },
                              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                            });
                          } else {
                            messageApi.success({
                              content: "키워드 업로드 성공!",
                              style: { color: "#EEE" },
                              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                            });
                          }

                          console.log(result);
                          setIsLoading(false);
                        }}
                      >
                        DB 업로드
                      </Button>
                    </Col>
                  </Row>
                </div>
              </ToneGroup>

              <ToneGroup
                icon={<CloudDownloadOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title="키워드 다운로드"
                tag={
                  <ToneStatusChip tone={hasSavePath ? "success" : "default"}>
                    {hasSavePath ? "경로 저장됨" : "경로 입력 필요"}
                  </ToneStatusChip>
                }
              >
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} xl={18}>
                    <ToneField label="저장 경로">
                      <Input
                        size="large"
                        value={savePath}
                        status="warning"
                        placeholder="저장경로를 입력해주세요."
                        onChange={(event) => {
                          const currentPath = event.target.value;

                          setSavePath(currentPath);
                          localStorage.setItem("savePath", currentPath);
                        }}
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} xl={6}>
                    <ToneField label="최신 파일 받기">
                      <Popconfirm
                        title="키워드 다운로드"
                        description="최신화된 키워드를 다운로드 하시겠습니까?"
                        okText="다운로드"
                        cancelText="종료"
                        onConfirm={async () => {
                          setIsLoading(true);

                           const result = await keywordApi.download({
                            savePath: savePath ?? "",
                          });

                          if (!result.result) {
                            if (result.errorLog.includes("Unrecognized")) {
                              messageApi.error({
                                content: "엑셀 파일 확장자가 올바르지 않습니다!",
                                style: { color: "#EEE" },
                                icon: <WarningTwoTone twoToneColor="#C70039" />,
                              });
                            } else {
                              messageApi.error({
                                content: "존재하지 않는 파일 경로 입니다!",
                                style: { color: "#EEE" },
                                icon: <WarningTwoTone twoToneColor="#C70039" />,
                              });
                            }
                          } else {
                            messageApi.success({
                              content: "키워드 다운로드 성공!",
                              style: { color: "#EEE" },
                              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                            });
                          }

                          setIsLoading(false);
                        }}
                      >
                        <Button
                          block
                          type="primary"
                          size="large"
                          icon={<CloudDownloadOutlined />}
                          style={{ color: "#000" }}
                        >
                          다운로드
                        </Button>
                      </Popconfirm>
                    </ToneField>
                  </Col>
                </Row>
              </ToneGroup>
            </ToneSectionCard>
          </Col>
        </Row>
      </div>
    </>
  );
}
