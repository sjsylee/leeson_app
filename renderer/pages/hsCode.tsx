import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  AutoComplete,
  Input,
  Divider,
  Button,
  Table,
  Tag,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  SearchOutlined,
  CheckCircleTwoTone,
  RedoOutlined,
  CopyOutlined,
  TableOutlined,
  PaperClipOutlined,
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
import { hsCodeApi, windowApi } from "../lib/electron";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

interface DataType {
  key: React.Key;
  value: number;
  label: string;
  cat_code: number;
  tax_cat: string;
  hs_code: number;
  gov_cat: string;
  big_cat: number;
  name_high: string | null;
  name_mid: string | null;
  name_low: string | null;
  name_detail: string | null;
  code_high: string | null;
  code_mid: string | null;
  code_low: number | null;
  code_detail: string | null;
  cp_cat_ref: string | null;
}

interface HsCodeOption extends Omit<DataType, "key"> {
  key?: React.Key;
}

interface HsCodeAutoCompleteOption {
  key: React.Key;
  value: string;
  label: string;
  hsCodeOption: HsCodeOption;
}

const { Text } = Typography;

export default function NextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<HsCodeOption[]>([]);
  const [hsCodeData, setHsCodeData] = useState<DataType[]>([]);
  const [value, setValue] = useState<number>();
  const [searchText, setSearchText] = useState("");
  const [selHeight, setSelHeight] = useState<number>();

  const toNumber = (input: unknown) => {
    if (typeof input === "number" && Number.isFinite(input)) {
      return input;
    }

    if (typeof input === "string") {
      const parsed = Number(input);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return 0;
  };

  const toNumberOrNull = (input: unknown) => {
    if (input === null || typeof input === "undefined" || input === "") {
      return null;
    }

    return toNumber(input);
  };

  const toStringOrNull = (input: unknown) => {
    if (input === null || typeof input === "undefined") {
      return null;
    }

    return String(input);
  };

  const toHsCodeOption = (input: unknown): HsCodeOption | null => {
    if (!input || typeof input !== "object") {
      return null;
    }

    const record = input as Record<string, unknown>;
    const recordKey =
      typeof record.key === "string" || typeof record.key === "number"
        ? record.key
        : undefined;

    return {
      key: recordKey,
      value: toNumber(record.value),
      label: String(record.label ?? ""),
      cat_code: toNumber(record.cat_code),
      tax_cat: String(record.tax_cat ?? ""),
      hs_code: toNumber(record.hs_code),
      gov_cat: String(record.gov_cat ?? ""),
      big_cat: toNumber(record.big_cat),
      name_high: toStringOrNull(record.name_high),
      name_mid: toStringOrNull(record.name_mid),
      name_low: toStringOrNull(record.name_low),
      name_detail: toStringOrNull(record.name_detail),
      code_high: toStringOrNull(record.code_high),
      code_mid: toStringOrNull(record.code_mid),
      code_low: toNumberOrNull(record.code_low),
      code_detail: toStringOrNull(record.code_detail),
      cp_cat_ref: toStringOrNull(record.cp_cat_ref),
    };
  };

  const fetch = (
    nextValue: string,
    callback: (options: HsCodeOption[]) => void
  ) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    currentValue = nextValue;

    const delayedSearch = () => {
      hsCodeApi.search({ q: nextValue }).then((response) => {
        if (currentValue === nextValue) {
          const options = Array.isArray(response.result)
            ? response.result
                .map(toHsCodeOption)
                .filter((option): option is HsCodeOption => option !== null)
            : [];

          callback(options);
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
    const storedHeight = localStorage.getItem("selHeight");
    setSelHeight(Number(storedHeight) || 100);
  }, []);

  const handleSearch = (nextValue: string) => {
    setSearchText(nextValue);
    fetch(nextValue, setData);
  };

  const createRowFromOption = (option: HsCodeOption): DataType => ({
    key: option.key ?? option.value,
    value: option.value,
    label: option.label,
    cat_code: option.cat_code,
    tax_cat: option.tax_cat,
    hs_code: option.hs_code,
    gov_cat: option.gov_cat,
    big_cat: option.big_cat,
    name_high: option.name_high,
    name_mid: option.name_mid,
    name_low: option.name_low,
    name_detail: option.name_detail,
    code_high: option.code_high,
    code_mid: option.code_mid,
    code_low: option.code_low,
    code_detail: option.code_detail,
    cp_cat_ref: option.cp_cat_ref,
  });

  const handleSelect = (_nextValue: string, option: HsCodeAutoCompleteOption) => {
    setHsCodeData([createRowFromOption(option.hsCodeOption)]);
    setValue(option.hsCodeOption.value);
    setSearchText(option.label);
    setData([]);
    windowApi.restore();
  };

  const handleInputChange = (nextValue: string) => {
    setSearchText(nextValue);

    if (!nextValue) {
      setValue(undefined);
      setHsCodeData([]);
      setData([]);
      return;
    }

    if (value && nextValue !== hsCodeData[0]?.label) {
      setValue(undefined);
      setHsCodeData([]);
    }
  };

  const copyRecordSlice = (record: DataType, start: number, length?: number) => {
    const textArea = document.createElement("textarea");
    const values = Object.values(record);

    textArea.value = typeof length === "number" ? values.slice(start, start + length).join("\t") : values.slice(start).join("\t");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: (
        <Text style={{ color: "#FFEB00", fontFamily: "LINESeedKR-Bd" }}>
          cat_code
        </Text>
      ),
      width: 100,
      dataIndex: "cat_code",
      key: "cat_code",
      fixed: "left",
      render: (text: number, record) => (
        <CopyToClipboard
          text={String(text)}
          onCopy={() => {
            copyRecordSlice(record, 3);
            messageApi.success({
              content: "복사 성공!",
              style: {
                color: "#EEE",
              },
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Tag
            color="geekblue"
            style={{
              fontSize: "15px",
              fontFamily: "LINESeedKR-Bd",
            }}
          >
            {text}
          </Tag>
        </CopyToClipboard>
      ),
    },
    {
      title: "tax_cat",
      width: 100,
      dataIndex: "tax_cat",
      key: "tax_cat",
      render: (text: string, record) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            copyRecordSlice(record, 4, 12);
            messageApi.success({
              content: "복사 성공!",
              style: {
                color: "#EEE",
              },
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "hs_code",
      width: 100,
      dataIndex: "hs_code",
      key: "hs_code",
      render: (text: number) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "gov_cat",
      width: 100,
      dataIndex: "gov_cat",
      key: "gov_cat",
      render: (text: string) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "big_cat",
      width: 100,
      dataIndex: "big_cat",
      key: "big_cat",
      render: (text: number) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "name_high",
      width: 100,
      dataIndex: "name_high",
      key: "name_high",
      render: (text: string | null) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "name_mid",
      width: 100,
      dataIndex: "name_mid",
      key: "name_mid",
      render: (text: string | null) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "name_low",
      width: 100,
      dataIndex: "name_low",
      key: "name_low",
      render: (text: string | null) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "name_detail",
      width: 100,
      dataIndex: "name_detail",
      key: "name_detail",
      render: (text: string | null) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "code_high",
      width: 100,
      dataIndex: "code_high",
      key: "code_high",
      render: (text: string | null) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "code_mid",
      width: 100,
      dataIndex: "code_mid",
      key: "code_mid",
      render: (text: string | null) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "code_low",
      width: 100,
      dataIndex: "code_low",
      key: "code_low",
      render: (text: number | null) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: "code_detail",
      width: 100,
      dataIndex: "code_detail",
      key: "code_detail",
      render: (text: string | null) => <Text style={{ fontSize: "13px" }}>{text}</Text>,
    },
    {
      title: (
        <Text style={{ color: "#FFEB00", fontFamily: "LINESeedKR-Bd" }}>
          cp_cat_ref
        </Text>
      ),
      width: 500,
      dataIndex: "cp_cat_ref",
      key: "cp_cat_ref",
      fixed: "right",
      render: (text: string | null) => <Text style={{ fontSize: "14px" }}>{text}</Text>,
    },
  ];

  const selectedRow = hsCodeData[0];
  const autoCompleteOptions: HsCodeAutoCompleteOption[] = data.map((option) => ({
    key: option.key ?? option.value,
    value: option.label,
    label: option.label,
    hsCodeOption: option,
  }));

  return (
    <>
      {contextHolder}
      <div>
        <TonePageHeading
          icon={<PaperClipOutlined style={{ fontSize: "20px", color: "#EEE" }} />}
          title="HS CODE"
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
                    <ToneStatusChip tone={selectedRow ? "success" : "default"}>
                      {selectedRow ? "결과 로드 완료" : "카테고리 선택 대기"}
                    </ToneStatusChip>
                  </Col>
                  <Col>
                    <ToneStatusChip tone="processing">{`테이블 행 ${hsCodeData.length}개`}</ToneStatusChip>
                  </Col>
                </Row>
              }
            >
              <ToneGroup
                icon={<SearchOutlined style={{ fontSize: 16, color: "#EEE" }} />}
                title="쿠팡 카테고리 검색"
                tag={
                  <ToneStatusChip tone={selectedRow ? "success" : "default"}>
                    {selectedRow ? "카테고리 선택 완료" : "선택 대기"}
                  </ToneStatusChip>
                }
              >
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} xl={16}>
                    <ToneField label="카테고리 검색">
                       <AutoComplete
                         style={{ width: "100%" }}
                         options={autoCompleteOptions}
                         filterOption={false}
                         notFoundContent={null}
                         onSearch={handleSearch}
                         onSelect={handleSelect}
                         onChange={handleInputChange}
                         value={searchText}
                         listHeight={selHeight}
                       >
                         <Input.Search
                           allowClear
                           size="large"
                           placeholder="쿠팡 카테고리를 검색해주세요."
                           enterButton
                           onSearch={handleSearch}
                         />
                       </AutoComplete>
                     </ToneField>
                   </Col>
                  <Col xs={24} sm={12} xl={4}>
                    <ToneField label="선택 라벨">
                      <CopyToClipboard
                        text={selectedRow?.label ?? ""}
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
                          disabled={!selectedRow?.label}
                        >
                          복사
                        </Button>
                      </CopyToClipboard>
                    </ToneField>
                  </Col>
                  <Col xs={24} sm={12} xl={4}>
                    <ToneField label="조회 초기화">
                      <Button
                        block
                        size="large"
                        type="primary"
                        style={{ color: "#000" }}
                        icon={<RedoOutlined />}
                        onClick={() => {
                          setValue(undefined);
                          setSearchText("");
                          setData([]);
                          setHsCodeData([]);
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
              icon={<TableOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="HS CODE 테이블"
            >
              <ToneGroup
                title="상세 결과"
                tag={
                  <ToneStatusChip tone={selectedRow ? "success" : "default"}>
                    {selectedRow ? "복사 가능한 결과 있음" : "결과 없음"}
                  </ToneStatusChip>
                }
              >
                <div style={pageToneStyles.tableWrap}>
                  <Table
                    className="custom-table"
                    columns={columns}
                    dataSource={hsCodeData}
                    pagination={false}
                    loading={isLoading}
                    scroll={{ x: "max-content" }}
                    size="large"
                    bordered
                    rowClassName={() => "long-row"}
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
