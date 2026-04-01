import React, { useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  Card,
  Divider,
  Input,
  Button,
  Tag,
  Descriptions,
  DescriptionsProps,
} from "antd";
import { FieldStringOutlined, RedoOutlined } from "@ant-design/icons";
import { byteCount } from "../lib/etc";

const { Title, Text } = Typography;

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "쿠팡",
    children: "300 Byte",
  },
  {
    key: "2",
    label: "스마트스토어",
    children: "한글/영문/숫자 기준 100자",
  },
  {
    key: "3",
    label: "11번가",
    children: "100 Byte",
  },
  {
    key: "5",
    label: "롯데ON",
    children: "100 Byte",
  },
  {
    key: "4",
    label: "옥션/G마켓 (ESM+)",
    children: " 100 Byte",
  },
];

export default function NextPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [value, setValue] = useState<string>();

  const handleClose = (removedTag: string) => {
    const newTags = value.split(",").filter((tag) => tag !== removedTag);
    console.log(newTags);
    setValue(newTags.join(","));
  };

  const forMap = (tag: string, tagNumber: number = value.split(",").length) => {
    let tagLimit = 10;

    const tagElem = (
      <Tag
        color="#211C6A"
        closable
        style={{
          fontSize: "14px",
          paddingTop: "3px",
          paddingBottom: "3px",
          margin: "3px",
          color: "#F5F5F5",
          fontFamily: "LINESeedKR-Rg",
        }}
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );

    if (tagNumber < tagLimit) {
      return (
        <span key={tag} style={{ display: "inline-block" }}>
          {tagElem}
        </span>
      );
    } else if (tagNumber === tagLimit) {
      return (
        <span key={"extra"} style={{ display: "inline-block" }}>
          <Tag
            color="#77E4C8"
            style={{
              fontSize: "14px",
              paddingTop: "3px",
              paddingBottom: "3px",
              margin: "3px",
              color: "#C7253E",
              fontFamily: "LINESeedKR-Rg",
            }}
          >
            {`10개 초과 ..`}
          </Tag>
        </span>
      );
    }
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      {contextHolder}
      <div>
        <Row>
          <Col>
            <Title level={4}>글자수 세기</Title>
          </Col>
        </Row>
        <Divider />
        <Row align="middle" style={{ marginBottom: "10px", marginTop: "28px" }}>
          <Col style={{ marginRight: "5px" }}>
            <FieldStringOutlined />
          </Col>
          <Col>
            <Text style={{ fontSize: "14px" }}>글자수 세기</Text>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col>
            <Input
              style={{ minWidth: "800px" }}
              size="large"
              placeholder="텍스트를 입력해주세요."
              value={value}
              onChange={(nv) => {
                setValue(nv.target.value);
              }}
              allowClear
            />
          </Col>
          <Col>
            <Button
              size="large"
              type="primary"
              icon={<RedoOutlined />}
              onClick={() => {
                setValue(null);
              }}
            >
              초기화
            </Button>
          </Col>
        </Row>
        <Row>
          {value ? (
            <Row style={{ marginTop: "30px" }} gutter={12} align="middle">
              <Col>
                <Row align={"middle"} gutter={3}>
                  <Col>
                    <Text
                      style={{
                        fontSize: "18px",
                        marginRight: "5px",
                        fontFamily: "LINESeedKR-Rg",
                      }}
                    >
                      바이트수:
                    </Text>
                  </Col>
                  <Col>
                    <Text
                      style={
                        byteCount(value) <= 100
                          ? {
                              fontSize: "30px",
                              fontFamily: "LINESeedKR-Bd",
                              color: "#0D7C66",
                            }
                          : {
                              fontSize: "30px",
                              fontFamily: "LINESeedKR-Bd",
                              color: "#C7253E",
                            }
                      }
                    >
                      {`${byteCount(value)} / 100`}
                    </Text>
                  </Col>
                  <Col>
                    <Text
                      style={{
                        marginLeft: "5px",
                        fontSize: "20px",
                        fontFamily: "LINESeedKR-Bd",
                      }}
                    >
                      Byte
                    </Text>
                  </Col>
                </Row>
              </Col>
              <Divider
                type="vertical"
                style={{ marginRight: "20px", marginLeft: "20px" }}
              />
              <Col>
                <Row align={"middle"} gutter={3}>
                  <Col>
                    <Text
                      style={{
                        fontSize: "18px",
                        marginRight: "5px",
                        fontFamily: "LINESeedKR-Rg",
                      }}
                    >
                      글자수:
                    </Text>
                  </Col>
                  <Col>
                    <Text
                      style={
                        value.length <= 100
                          ? {
                              fontSize: "30px",
                              fontFamily: "LINESeedKR-Bd",
                              color: "#0D7C66",
                            }
                          : {
                              fontSize: "30px",
                              fontFamily: "LINESeedKR-Bd",
                              color: "#C7253E",
                            }
                      }
                    >
                      {`${value.length} / 100`}
                    </Text>
                  </Col>
                  <Col>
                    <Text
                      style={{
                        marginLeft: "5px",
                        fontSize: "20px",
                        fontFamily: "LINESeedKR-Bd",
                      }}
                    >
                      자
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            <></>
          )}
        </Row>
        <Row style={{ marginTop: "40px" }}>
          <Descriptions
            title={
              <Text
                style={{
                  fontSize: "18px",
                  marginRight: "5px",
                  fontFamily: "LINESeedKR-Rg",
                }}
              >
                마켓별 상품명 최대 길이:
              </Text>
            }
            items={items}
            labelStyle={{
              fontSize: "14px",
            }}
            contentStyle={{
              fontSize: "14px",
              fontFamily: "LINESeedKR-Bd",
            }}
          ></Descriptions>
        </Row>

        <Row
          align="middle"
          style={{ marginBottom: "10px", marginTop: "40px" }}
        ></Row>
      </div>
    </>
  );
}
