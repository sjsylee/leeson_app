import React, { useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  Divider,
  Input,
  Button,
  Table,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  SearchOutlined,
  RedoOutlined,
  WarningTwoTone,
  TableOutlined,
  MonitorOutlined,
} from "@ant-design/icons";
import {
  ToneField,
  ToneGroup,
  TonePageHeading,
  ToneSectionCard,
  ToneStatusChip,
  pageToneStyles,
} from "../components/PageTone/PageTone";
import { cpCategoryMetaApi } from "../lib/electron";

const { Text } = Typography;
const { Search } = Input;

interface DataType {
  attributeTypeName: string;
  dataType: string;
  inputType: string[];
  basicUnit: string;
  usableUnits: string[];
  required: string;
  groupNumber: string;
  exposed: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "옵션명",
    dataIndex: "attributeTypeName",
    key: "attributeTypeName",
    width: "100px",
    render: (text) => <Text style={{ fontSize: "18px" }}>{text}</Text>,
  },
  {
    title: "기본 단위",
    dataIndex: "basicUnit",
    key: "basicUnit",
    width: "100px",
    render: (text) => (
      <Text
        style={{
          fontSize: text === "없음" ? "15px" : "18px",
          color: text === "없음" ? "#D91656" : "#001F3F",
        }}
      >
        {text}
      </Text>
    ),
  },
  {
    title: "사용 가능 단위",
    dataIndex: "usableUnits",
    key: "usableUnits",
    width: "100px",
    render: (array: string[]) => <Text style={{ fontSize: "15px" }}>{array.join(", ")}</Text>,
  },
  {
    title: "데이터 타입",
    dataIndex: "dataType",
    key: "dataType",
    width: "100px",
    render: (text) => <Text style={{ fontSize: "18px", color: "#347928" }}>{text}</Text>,
  },
];

export default function NextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<DataType[]>([]);
  const [value, setValue] = useState<string>();
  const [catTitle, setCatTitle] = useState<string>();

  const toString = (input: unknown) => {
    if (input === null || typeof input === "undefined") {
      return "";
    }

    return String(input);
  };

  const toStringArray = (input: unknown) => {
    if (!Array.isArray(input)) {
      return [];
    }

    return input.map((item) => String(item));
  };

  const toDataRow = (input: unknown): DataType | null => {
    if (!input || typeof input !== "object") {
      return null;
    }

    const record = input as Record<string, unknown>;

    return {
      attributeTypeName: toString(record.attributeTypeName),
      dataType: toString(record.dataType),
      inputType: toStringArray(record.inputType),
      basicUnit: toString(record.basicUnit),
      usableUnits: toStringArray(record.usableUnits),
      required: toString(record.required),
      groupNumber: toString(record.groupNumber),
      exposed: toString(record.exposed),
    };
  };

  const hasResult = data.length > 0;

  return (
    <>
      {contextHolder}
      <div>
        <TonePageHeading
          icon={<MonitorOutlined style={{ fontSize: "20px", color: "#EEE" }} />}
          title="쿠팡 카테고리 검색"
        />
        <Divider />

        <Row gutter={[0, 16]} style={{ marginTop: 8 }}>
          <Col span={24}>
            <ToneSectionCard
              icon={<SearchOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="카테고리 검색"
              extra={
                <Row gutter={[8, 8]} justify="end">
                  <Col>
                    <ToneStatusChip tone={hasResult ? "success" : "default"}>
                      {hasResult ? "조회 완료" : "조회 대기"}
                    </ToneStatusChip>
                  </Col>
                  <Col>
                    <ToneStatusChip tone="processing">{`필수 옵션 ${data.length}개`}</ToneStatusChip>
                  </Col>
                </Row>
              }
            >
              <ToneGroup
                icon={<SearchOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title="쿠팡 카테고리 번호 조회"
                tag={
                  <ToneStatusChip tone={hasResult ? "success" : "default"}>
                    {hasResult ? "결과 로드 완료" : "조회 전"}
                  </ToneStatusChip>
                }
              >
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} xl={18}>
                    <ToneField label="카테고리 번호">
                      <Search
                        loading={isLoading}
                        enterButton={
                          <Button
                            size="large"
                            type="primary"
                            icon={<SearchOutlined />}
                            loading={isLoading}
                            style={{ color: "#000" }}
                          />
                        }
                        size="large"
                        value={value}
                        placeholder="쿠팡 카테고리 번호를 입력해주세요."
                        onChange={(event) => {
                          setValue(event.target.value);
                        }}
                        onSearch={async () => {
                          if (!value?.trim()) {
                            messageApi.error({
                              content: "카테고리 번호를 입력해주세요!",
                              style: { color: "#EEE" },
                              icon: <WarningTwoTone twoToneColor="#C70039" />,
                            });
                            return;
                          }

                          setIsLoading(true);

                          const result = await cpCategoryMetaApi.get({
                            catCode: value,
                          });

                          if (result.status === 400) {
                            messageApi.error({
                              content: "존재하지 않는 카테고리 입니다!",
                              style: { color: "#EEE" },
                              icon: <WarningTwoTone twoToneColor="#C70039" />,
                            });
                          } else if (result.status === 401) {
                            messageApi.error({
                              content: "올바르지 않은 API KEY 입니다!",
                              style: { color: "#EEE" },
                              icon: <WarningTwoTone twoToneColor="#C70039" />,
                            });
                          } else {
                            const nextRows = Array.isArray(result.result)
                              ? result.result
                                  .map(toDataRow)
                                  .filter((row): row is DataType => row !== null)
                              : [];

                            setData(nextRows);
                            setCatTitle(toString(result.cat_title));
                          }

                          setIsLoading(false);
                        }}
                      />
                    </ToneField>
                  </Col>
                  <Col xs={24} xl={6}>
                    <ToneField label="조회 초기화">
                      <Button
                        block
                        size="large"
                        type="primary"
                        icon={<RedoOutlined />}
                        onClick={() => {
                          setValue(undefined);
                          setCatTitle(undefined);
                          setData([]);
                        }}
                        style={{ color: "#000" }}
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
              icon={<TableOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="필수 입력 옵션"
            >
              <ToneGroup
                title="카테고리 메타 결과"
                tag={
                  <ToneStatusChip tone={hasResult ? "success" : "default"}>
                    {hasResult ? "테이블 준비 완료" : "결과 없음"}
                  </ToneStatusChip>
                }
              >
                <Row style={{ marginBottom: 16 }}>
                  <Col span={24}>
                    <ToneField label="카테고리명">
                      <Input size="large" value={catTitle} readOnly />
                    </ToneField>
                  </Col>
                </Row>

                <div style={pageToneStyles.tableWrap}>
                  <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    loading={isLoading}
                  />
                </div>
              </ToneGroup>
            </ToneSectionCard>
          </Col>
        </Row>
      </div>
    </>
  );
}
