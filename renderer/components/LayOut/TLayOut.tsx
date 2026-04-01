import React, { useCallback, useEffect, useState } from "react";

import type { MenuProps } from "antd";
import { Button, Col, Layout, Menu, Row, Typography } from "antd";
import {
  ExclamationCircleFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
const { Header, Content, Footer, Sider } = Layout;
import { motion } from "framer-motion";
import { settingsApi } from "../../lib/electron";

type MenuItem = Required<MenuProps>["items"][number];
type SettingsStatus = Awaited<ReturnType<typeof settingsApi.getStatus>>;

const SETTINGS_STATUS_CHANGED_EVENT = "settings-status-changed";
const { Text } = Typography;

interface LCProps {
  children: React.ReactNode;
}

const App: React.FC<LCProps> = ({ children }) => {
  const router = useRouter();

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>(
    router.pathname.replace("/", "") || "home",
  );
  const [settingsStatus, setSettingsStatus] = useState<SettingsStatus | null>(
    null,
  );

  const syncSettingsStatus = useCallback(async () => {
    try {
      const nextStatus = await settingsApi.getStatus();
      setSettingsStatus(nextStatus);
    } catch {
      setSettingsStatus(null);
    }
  }, []);

  useEffect(() => {
    void syncSettingsStatus();
  }, [router.pathname, syncSettingsStatus]);

  useEffect(() => {
    const handleSettingsStatusChange = () => {
      void syncSettingsStatus();
    };

    window.addEventListener(
      SETTINGS_STATUS_CHANGED_EVENT,
      handleSettingsStatusChange,
    );

    return () => {
      window.removeEventListener(
        SETTINGS_STATUS_CHANGED_EVENT,
        handleSettingsStatusChange,
      );
    };
  }, [syncSettingsStatus]);

  const hasIncompleteSettings = settingsStatus
    ? !settingsStatus.isConfigured
    : false;
  const missingFieldsLabel =
    settingsStatus && settingsStatus.missingFields.length > 0
      ? `누락 항목: ${settingsStatus.missingFields.join(", ")}`
      : "설정 페이지에서 연결 정보, DB credential, Coupang Open API key를 확인해주세요.";

  const getAnimatedIcon = (
    key: string,
    d: string,
    color1: string,
    color2: string,
  ) => (
    <motion.div
      animate={{
        scale: selectedKey === key || hoveredKey === key ? 1.3 : 1, // 선택되었거나 호버 중이면 확대
      }}
      transition={{ duration: selectedKey === key ? 0 : 0.2 }} // 라우터 이동 시 즉시 확대
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        <motion.path
          d={d}
          stroke="#EEE" // 테두리 색 유지
          strokeWidth="1.5"
          fill="transparent"
          animate={{
            fill:
              hoveredKey === key || selectedKey === key
                ? `url(#gradient-${key})`
                : "transparent", // 선택/호버 시 그라디언트 적용
          }}
          transition={{
            duration: hoveredKey === key ? 0.3 : 0.4, // 색 채울 때 0.3초, 빠질 때 0.4초로 더 부드럽게
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );

  const items: MenuItem[] = [
    {
      key: "opt",
      label: "설정",
      icon: getAnimatedIcon(
        "opt",
        "M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z",
        "#A9BFA8",
        "#5E686D",
      ),
      onMouseEnter: () => setHoveredKey("opt"),
      onMouseLeave: () => setHoveredKey(null),
      onClick: () => setSelectedKey("opt"),
    },

    {
      key: "grp1",
      label: "추가",
      type: "group",
      children: [
        {
          key: "home",
          label: "카테고리 추가",
          icon: getAnimatedIcon(
            "home",
            "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z",
            "#FFD65A",
            "#E82561",
          ),
          onMouseEnter: () => setHoveredKey("home"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("home"),
        },
        {
          key: "kwd",
          label: "키워드 추가",
          icon: getAnimatedIcon(
            "kwd",
            "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z",
            "#85A947",
            "#3E7B27",
          ),
          onMouseEnter: () => setHoveredKey("kwd"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("kwd"),
        },
      ],
    },
    {
      key: "grp2",
      label: "확인",
      type: "group",
      children: [
        {
          key: "hsCode",
          label: "HS CODE",
          icon: getAnimatedIcon(
            "hsCode",
            "M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z",
            "#72BAA9",
            "#474E93",
          ),
          onMouseEnter: () => setHoveredKey("hsCode"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("hsCode"),
        },

        {
          key: "cpCat",
          label: "쿠팡 카테고리",
          icon: getAnimatedIcon(
            "cpCat",
            "M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z",
            "#FFF574",
            "#FB4141",
          ),
          onMouseEnter: () => setHoveredKey("cpCat"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("cpCat"),
        },
        {
          key: "customsValidation",
          label: "통관부호 검증",
          icon: getAnimatedIcon(
            "customsValidation",
            "M12 2.25c-2.08 0-4.118.52-5.924 1.511l-1.1.603a1.875 1.875 0 0 0-.976 1.643v4.32c0 5.237 3.044 10 7.797 12.201a.75.75 0 0 0 .606 0C17.156 20.327 20.2 15.564 20.2 10.327v-4.32a1.875 1.875 0 0 0-.976-1.643l-1.1-.603A12.287 12.287 0 0 0 12 2.25Zm3.18 6.72a.75.75 0 1 0-1.06-1.06l-3.12 3.12-1.3-1.3a.75.75 0 0 0-1.06 1.06l1.83 1.83a.75.75 0 0 0 1.06 0l3.65-3.65Z",
            "#9AD0C2",
            "#2D5B7A",
          ),
          onMouseEnter: () => setHoveredKey("customsValidation"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("customsValidation"),
        },
        {
          key: "categoryAiMatch",
          label: "카테고리 AI 매칭",
          icon: getAnimatedIcon(
            "categoryAiMatch",
            "M11.097 3.515a.75.75 0 0 1 1.406 0l1.052 2.72a.75.75 0 0 0 .43.43l2.72 1.052a.75.75 0 0 1 0 1.406l-2.72 1.052a.75.75 0 0 0-.43.43l-1.052 2.72a.75.75 0 0 1-1.406 0l-1.052-2.72a.75.75 0 0 0-.43-.43l-2.72-1.052a.75.75 0 0 1 0-1.406l2.72-1.052a.75.75 0 0 0 .43-.43l1.052-2.72ZM5.25 13.5a.75.75 0 0 1 .75.75v.75h.75a.75.75 0 0 1 0 1.5H6v.75a.75.75 0 0 1-1.5 0V16.5h-.75a.75.75 0 0 1 0-1.5h.75v-.75a.75.75 0 0 1 .75-.75Zm12 1.5a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5Z",
            "#FFF7AE",
            "#FF7D7D",
          ),
          onMouseEnter: () => setHoveredKey("categoryAiMatch"),
          onMouseLeave: () => setHoveredKey(null),
          onClick: () => setSelectedKey("categoryAiMatch"),
        },
        // {
        //   key: "textTest",
        //   label: "글자수 세기",
        //   icon: getAnimatedIcon(
        //     "textTest",
        //     <PlusSquareOutlined style={{ color: "#EEE", fontSize: "14px" }} />
        //   ),
        //   onMouseEnter: () => setHoveredKey("textTest"),
        //   onMouseLeave: () => setHoveredKey(null),
        //   onClick: () => setSelectedKey("textTest"),
        // },
      ],
    },
    // getItem("설정", "opt", <SettingOutlined />),
    // getItem("카테고리 추가", "home", <PlusSquareOutlined />),
    // getItem("키워드 추가", "kwd", <PlusSquareOutlined />),
    // getItem("HS CODE", "hsCode", <ProfileOutlined />),
    // getItem("글자수 세기", "textTest", <CalculatorOutlined />),
    // getItem("쿠팡 카테고리", "cpCat", <ZoomInOutlined />),
    ,
  ];

  return (
    <Layout className="custom-layout">
      <Layout style={{ minHeight: "100vh" }} className="custom-sider-layout">
        <Sider
          className="custom-sider"
          width={"250px"}
          style={{
            background: "#EEEEEE",
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="titlebar" style={{ padding: 20, height: "200px" }} />
          <Menu
            className="custom-menu"
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            selectedKeys={[router.pathname.replace("/", "")]}
            onClick={({ key }) => {
              router.replace(key);
            }}
            style={{
              background: "#EEEEEE",
            }}
            items={items}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: "250px",
            height: "100vh",
            overflow: "hidden",
          }}
          className="custom-content-layout"
        >
           <Header
             className="custom-header"
             style={{
                padding: "0 16px",
                minHeight: 32,
                height: "auto",
                lineHeight: "normal",
                position: "sticky",
                top: 0,
                zIndex: 30,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
             }}
           >
             <div
               style={{
                 width: "100%",
                 display: "flex",
                 justifyContent: "space-between",
                 alignItems: "center",
                  gap: "5px",
                }}
             >
              <div style={{ flex: 1, minWidth: 0 }}>
                {hasIncompleteSettings ? (
                   <div
                     style={{
                       display: "inline-flex",
                       alignItems: "center",
                        gap: "5px",
                        maxWidth: "100%",
                        padding: "4px 8px",
                       borderRadius: "8px",
                       background:
                         "linear-gradient(135deg, rgba(190, 49, 68, 0.92), rgba(122, 28, 45, 0.88))",
                       border: "1px solid rgba(255, 246, 179, 0.35)",
                       boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.18)",
                     }}
                   >
                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                     >
                       <ExclamationCircleFilled
                         style={{ color: "#FFF6B3", fontSize: "14px" }}
                       />
                     </motion.div>
                     <div
                       style={{
                         minWidth: 0,
                         display: "flex",
                         flexDirection: "column",
                          gap: 0,
                       }}
                     >
                       <Text
                         style={{
                           display: "block",
                           color: "#FFF6B3",
                           fontSize: "11px",
                            lineHeight: 1.1,
                           fontFamily: "LINESeedKR-Bd",
                         }}
                       >
                        CONFIG 설정이 끝나지 않았습니다!
                      </Text>
                      <Text
                         style={{
                           display: "block",
                           color: "#FDECEC",
                           fontSize: "10px",
                            lineHeight: 1.2,
                           fontFamily: "LINESeedKR-Rg",
                         }}
                       >
                        {missingFieldsLabel}
                      </Text>
                    </div>
                    <Button
                      size="small"
                      className="transparent-button"
                       style={{
                         color: "#FFF6B3",
                         border: "1px solid rgba(255, 246, 179, 0.28)",
                         boxShadow: "none",
                         paddingInline: 7,
                         height: 24,
                         whiteSpace: "nowrap",
                         flexShrink: 0,
                       }}
                       onClick={() => {
                         setSelectedKey("opt");
                        void router.replace("opt");
                      }}
                    >
                      설정 열기
                    </Button>
                  </div>
                ) : null}
              </div>
              <Row gutter={2} align="middle" style={{ flexShrink: 0 }}>
                <Col>
                  <Button
                    size="small"
                    className="transparent-button"
                    icon={<LeftOutlined style={{ color: "#EEE" }} />}
                    onClick={() => router.back()}
                  />
                </Col>
                <Col>
                  <Button
                    size="small"
                    className="transparent-button"
                    icon={<RightOutlined style={{ color: "#EEE" }} />}
                  />
                </Col>
              </Row>
            </div>
          </Header>
          <Content
            className="custom-content non-draggable"
            style={{
              padding: "16px 24px 24px",
              marginTop: "4px",
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              scrollBehavior: "smooth",
            }}
          >
            {children}
          </Content>
          <Footer
            className="custom-footer"
            style={{
              textAlign: "center",
              fontSize: 10,
              color: "#EEE",
            }}
          >
            ver1.6.0
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
