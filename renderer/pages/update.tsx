import { useEffect, useState } from "react";
import { Progress, Typography, Card, Spin } from "antd";
import { CheckCircleTwoTone, LoadingOutlined } from "@ant-design/icons";
import { updaterApi } from "../lib/electron";

const { Title, Text } = Typography;

const UpdatePage = () => {
  const [progress, setProgress] = useState<number>(0);
  const [updateComplete, setUpdateComplete] = useState<boolean>(false);

  useEffect(() => {
    const removeProgressListener = updaterApi.onProgress((percent) => {
      setProgress(percent);
    });

    const removeCompleteListener = updaterApi.onComplete(() => {
      setUpdateComplete(true);
    });

    return () => {
      removeProgressListener();
      removeCompleteListener();
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 400,
          textAlign: "center",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3} style={{ marginBottom: "20px" }}>
          {updateComplete ? "업데이트 완료!" : "업데이트 진행 중..."}
        </Title>

        {!updateComplete ? (
          <>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
            <Progress
              percent={Math.round(progress)}
              status="active"
              showInfo
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
              style={{ marginTop: "20px" }}
            />
            <Text type="secondary">업데이트 파일을 다운로드 중입니다...</Text>
          </>
        ) : (
          <>
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: "48px" }}
            />
            <Text strong style={{ display: "block", marginTop: "10px" }}>
              업데이트가 완료되었습니다! 앱이 곧 재시작됩니다...
            </Text>
          </>
        )}
      </Card>
    </div>
  );
};

export default UpdatePage;
