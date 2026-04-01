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
  Radio,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  AmazonOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  CheckCircleTwoTone,
  WarningTwoTone,
  ControlOutlined,
  CloudDownloadOutlined,
  RedoOutlined,
  CopyOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  ToneField,
  ToneGroup,
  TonePageHeading,
  ToneSectionCard,
  ToneStatusChip,
  pageToneStyles,
} from "../components/PageTone/PageTone";
import { categoryApi, windowApi } from "../lib/electron";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const { Text } = Typography;

type CategoryOption = {
  value: number;
  label: string;
};

export default function NextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<CategoryOption[]>([]);
  const [value, setValue] = useState<number>();
  const [uploadValue, setUploadValue] = useState<string>();
  const [searchOpt, setSearchOpt] = useState<"cp" | "ec">("cp");
  const [savePath, setSavePath] = useState<string>();
  const [selHeight, setSelHeight] = useState<number>();

  const fetch = (
    nextValue: string,
    nextSearchOpt: "cp" | "ec",
    callback: (options: CategoryOption[]) => void
  ) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    currentValue = nextValue;

    const delayedSearch = () => {
      const request =
        nextSearchOpt === "cp"
          ? categoryApi.searchCp({ q: nextValue })
          : categoryApi.searchEc({ q: nextValue });

      request.then((response) => {
        if (currentValue === nextValue) {
          callback(response.result);
          windowApi.expand(1400, 1400);
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

    const storedHeight = localStorage.getItem("selHeight");
    setSelHeight(Number(storedHeight) || 100);
  }, []);

  const handleSearch = (nextValue: string) => {
    fetch(nextValue, searchOpt, setData);
  };

  const handleChange = (nextValue: number) => {
    setValue(nextValue);
    windowApi.restore();
  };

  const selectedOption = data.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label;
  const searchModeLabel = searchOpt === "cp" ? "쿠팡 카테고리" : "기존 카테고리";
  const isUploadReady = typeof value === "number" && Boolean(uploadValue?.trim());
  const hasSavePath = Boolean(savePath?.trim());

  return (
    <>
      {contextHolder}
      <div>
        <TonePageHeading
          icon={<FormOutlined style={{ fontSize: "20px", color: "#EEE" }} />}
          title="카테고리 추가"
        />
        <Divider />

        <Row gutter={[0, 16]} style={{ marginTop: 8 }}>
          <Col span={24}>
            <ToneSectionCard
              icon={<ControlOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="검색 구성"
              extra={
                <Row gutter={[8, 8]} justify="end">
                  <Col>
                    <ToneStatusChip tone="processing">{searchModeLabel}</ToneStatusChip>
                  </Col>
                  <Col>
                    <ToneStatusChip tone={isUploadReady ? "success" : "warning"}>
                      {isUploadReady ? "업로드 준비 완료" : "매칭 정보 필요"}
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
                title="검색 옵션 선택"
                tag={<ToneStatusChip tone="processing">현재 {searchModeLabel}</ToneStatusChip>}
              >
                <Radio.Group
                  size="large"
                  value={searchOpt}
                  onChange={(event) => {
                    setValue(undefined);
                    setData([]);
                    setSearchOpt(event.target.value);
                  }}
                  buttonStyle="solid"
                >
                  <Radio.Button value="cp">쿠팡 카테고리</Radio.Button>
                  <Radio.Button value="ec">기존 카테고리</Radio.Button>
                </Radio.Group>
              </ToneGroup>

              <ToneGroup
                icon={<AmazonOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title="Amazon 카테고리 매칭"
                tag={
                  <ToneStatusChip tone={isUploadReady ? "success" : "warning"}>
                    {isUploadReady ? "업로드 가능" : "입력값 확인 필요"}
                  </ToneStatusChip>
                }
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={6}>
                    <ToneField label="선택 코드">
                      <Input size="large" value={value} readOnly />
                    </ToneField>
                  </Col>
                  <Col xs={24} md={18}>
                    <ToneField label="Amazon 카테고리명">
                      <Input
                        size="large"
                        placeholder="Amazon 카테고리를 입력해주세요."
                        value={uploadValue}
                        onChange={(event) => {
                          setUploadValue(event.target.value);
                        }}
                        allowClear
                      />
                    </ToneField>
                  </Col>
                </Row>
              </ToneGroup>

              <ToneGroup
                icon={<SearchOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title={searchOpt === "cp" ? "쿠팡 카테고리 검색" : "기존 카테고리 검색"}
                tag={
                  <ToneStatusChip tone={selectedLabel ? "success" : "default"}>
                    {selectedLabel ? "선택 완료" : "선택 대기"}
                  </ToneStatusChip>
                }
              >
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} xl={16}>
                    <ToneField label="카테고리 검색">
                      <Select<number, CategoryOption>
                        allowClear
                        style={{ width: "100%" }}
                        size="large"
                        showSearch
                        placeholder={
                          searchOpt === "cp"
                            ? "쿠팡 카테고리를 검색해주세요."
                            : "기존 카테고리를 영어로 검색해주세요."
                        }
                        defaultActiveFirstOption={false}
                        suffixIcon={null}
                        filterOption={false}
                        notFoundContent={null}
                        onSearch={handleSearch}
                        onChange={handleChange}
                        value={value}
                        options={data}
                        listHeight={selHeight}
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} sm={12} xl={4}>
                    <ToneField label="선택 라벨">
                      <CopyToClipboard
                        text={selectedLabel ?? ""}
                        onCopy={() => {
                          messageApi.success({
                            content: "복사 성공!",
                            style: { color: "#EEE" },
                            icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                          });
                        }}
                      >
                        <Button
                          block
                          style={{ color: "#000" }}
                          size="large"
                          type="primary"
                          icon={<CopyOutlined />}
                          disabled={!selectedLabel}
                        >
                          복사
                        </Button>
                      </CopyToClipboard>
                    </ToneField>
                  </Col>
                  <Col xs={24} sm={12} xl={4}>
                    <ToneField label="작업 초기화">
                      <Button
                        block
                        size="large"
                        type="primary"
                        style={{ color: "#000" }}
                        icon={<RedoOutlined />}
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
            </ToneSectionCard>
          </Col>

          <Col span={24}>
            <ToneSectionCard
              icon={<DatabaseOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="데이터 동기화"
            >
              <ToneGroup
                icon={<CloudUploadOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title="카테고리 업로드"
                tag={
                  <ToneStatusChip tone={isUploadReady ? "success" : "warning"}>
                    {isUploadReady ? "실행 가능" : "입력 대기"}
                  </ToneStatusChip>
                }
              >
                <div style={pageToneStyles.actionStrip}>
                  <Row gutter={[12, 12]} justify="space-between" align="middle">
                    <Col flex="auto">
                      <Text style={pageToneStyles.helperText}>
                        선택 코드 <Text style={{ color: "#EEE" }}>{value ?? "-"}</Text> 와 Amazon
                        카테고리명 <Text style={{ color: "#EEE" }}>{uploadValue || "-"}</Text> 를
                        조합해 DB에 업로드합니다.
                      </Text>
                    </Col>
                    <Col>
                      <Button
                        size="large"
                        type="primary"
                        icon={<DatabaseOutlined />}
                        disabled={!isUploadReady}
                        style={!isUploadReady ? { color: "#EEE" } : { color: "#000" }}
                        loading={isLoading}
                        onClick={async () => {
                          setIsLoading(true);

                          const result = await categoryApi.upload({
                            name: uploadValue ?? "",
                            displayCategoryCode: value,
                          });

                          if (!result.result) {
                            if (result.errorLog.includes("Duplicate")) {
                              messageApi.error({
                                content: "중복되는 카테고리 값이 존재합니다!",
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
                          } else {
                            messageApi.success({
                              content: "카테고리 업로드 성공!",
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
                title="카테고리 다운로드"
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
                          const currentValue = event.target.value;

                          setSavePath(currentValue);
                          localStorage.setItem("savePath", currentValue);
                        }}
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} xl={6}>
                    <ToneField label="최신 파일 받기">
                      <Popconfirm
                        title="카테고리 다운로드"
                        description="최신화된 카테고리를 다운로드 하시겠습니까?"
                        okText="다운로드"
                        cancelText="종료"
                        onConfirm={async () => {
                          setIsLoading(true);

                           const result = await categoryApi.download({
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
                              content: "카테고리 다운로드 성공!",
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
