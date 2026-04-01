import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Divider,
  Input,
  Button,
  message,
  Progress,
  Table,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  RobotOutlined,
  BulbOutlined,
  DeploymentUnitOutlined,
  RedoOutlined,
  SearchOutlined,
  CopyOutlined,
  CheckCircleTwoTone,
  CloudDownloadOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
  coupangCategoryPredictionApi,
  settingsApi,
  type AppProfileStatus,
  type CoupangCategoryBatchInputRow,
  type CoupangCategoryBatchProgress,
  type CoupangCategoryBatchPredictResult,
  type CoupangCategoryBatchResultRow,
  type CoupangCategoryPredictionResult,
} from "../lib/electron";

const { Text } = Typography;

type MatchDraft = {
  sourceCategory: string;
  productDescription: string;
  brand: string;
};

type Mode = "single" | "excel";

const initialDraft: MatchDraft = {
  sourceCategory: "",
  productDescription: "",
  brand: "",
};

export default function CategoryAiMatchPage() {
  const [mode, setMode] = useState<Mode>("single");
  const [draft, setDraft] = useState<MatchDraft>(initialDraft);
  const [result, setResult] = useState<CoupangCategoryPredictionResult | null>(null);
  const [lastSubmittedDraft, setLastSubmittedDraft] = useState<MatchDraft | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [status, setStatus] = useState<AppProfileStatus | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [templateSavePath, setTemplateSavePath] = useState<string | null>(null);
  const [importFilePath, setImportFilePath] = useState<string | null>(null);
  const [exportSavePath, setExportSavePath] = useState<string | null>(null);
  const [importedRows, setImportedRows] = useState<CoupangCategoryBatchInputRow[]>([]);
  const [importSummary, setImportSummary] = useState<string>("");
  const [batchResult, setBatchResult] = useState<CoupangCategoryBatchPredictResult | null>(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isImportingExcel, setIsImportingExcel] = useState(false);
  const [isBatchPredicting, setIsBatchPredicting] = useState(false);
  const [isDownloadingBatchResult, setIsDownloadingBatchResult] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [batchProgress, setBatchProgress] = useState<CoupangCategoryBatchProgress | null>(null);

  const hasSourceCategory = Boolean(draft.sourceCategory.trim());
  const hasCoupangCredentials =
    Boolean(status?.credentialsStored.coupangAccessKey) &&
    Boolean(status?.credentialsStored.coupangSecretKey);
  const canPredict = hasSourceCategory && hasCoupangCredentials;
  const topCandidate = result?.candidates[0] ?? null;
  const hasImportedRows = importedRows.length > 0;
  const hasBatchResult = Boolean(batchResult && batchResult.rows.length > 0);
  const canRunBatch = hasImportedRows && hasCoupangCredentials;
  const excelWorkflowSummary = importSummary || "불러온 엑셀 파일이 없습니다.";
  const recentExcelPathLabel = importFilePath
    ? `불러온 파일: ${importFilePath}`
    : templateSavePath
      ? `최근 양식 저장: ${templateSavePath}`
      : null;

  const clampedStatValueStyle: React.CSSProperties = {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 4,
    minHeight: 108,
    wordBreak: "break-word",
  };

  const predictionTone = useMemo<"default" | "processing" | "success" | "warning">(() => {
    if (isPredicting) {
      return "processing";
    }

    if (result) {
      return "success";
    }

    if (lastSubmittedDraft && !result) {
      return "warning";
    }

    return "default";
  }, [isPredicting, lastSubmittedDraft, result]);

  const batchStatusTone = useMemo<"default" | "processing" | "success" | "warning">(() => {
    if (isBatchPredicting) {
      return "processing";
    }

    if (hasBatchResult) {
      return "success";
    }

    if (hasImportedRows) {
      return "warning";
    }

    return "default";
  }, [hasBatchResult, hasImportedRows, isBatchPredicting]);

  const batchProgressPercent =
    batchProgress && batchProgress.totalRows > 0
      ? Math.min(100, Math.round((batchProgress.processedRows / batchProgress.totalRows) * 100))
      : 0;

  const batchColumns: TableColumnsType<CoupangCategoryBatchResultRow> = [
    {
      title: "row",
      dataIndex: "rowNumber",
      key: "rowNumber",
      width: 80,
      render: (value: number) => <Text>{value}</Text>,
    },
    {
      title: "sourceCategory",
      dataIndex: "sourceCategory",
      key: "sourceCategory",
      width: 240,
      render: (value: string) => <Text>{value}</Text>,
    },
    {
      title: "brand",
      dataIndex: "brand",
      key: "brand",
      width: 140,
      render: (value: string) => <Text>{value || "-"}</Text>,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: "success" | "error") => (
        <ToneStatusChip tone={value === "success" ? "success" : "error"}>
          {value === "success" ? "성공" : "실패"}
        </ToneStatusChip>
      ),
    },
    {
      title: "topCategory",
      dataIndex: "topCategoryName",
      key: "topCategoryName",
      width: 220,
      render: (_value: string, record) => {
        if (!record.topCategoryCode) {
          return <Text>-</Text>;
        }

        return (
          <CopyToClipboard
            text={record.topCategoryCode}
            onCopy={() => {
              messageApi.success({
                content: "카테고리 번호 복사 성공!",
                style: { color: "#EEE" },
                icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
              });
            }}
          >
            <Button size="small" icon={<CopyOutlined />}>
              [{record.topCategoryCode}] {record.topCategoryName || "복사"}
            </Button>
          </CopyToClipboard>
        );
      },
    },
  ];

  useEffect(() => {
    settingsApi
      .getStatus()
      .then((nextStatus) => {
        setStatus(nextStatus);
      })
      .catch(() => {
        setStatus(null);
      });

    const unsubscribeBatchProgress = coupangCategoryPredictionApi.onBatchProgress((progress) => {
      setBatchProgress(progress);
    });

    return () => {
      unsubscribeBatchProgress();
    };
  }, []);

  const importExcelFromPath = async (filePath: string) => {
    const imported = await coupangCategoryPredictionApi.importExcel({ filePath });

    setImportFilePath(filePath);
    setImportedRows(imported.rows);
    setBatchResult(null);
    setBatchProgress(null);
    setImportSummary(
      `총 ${imported.totalRows}행 중 ${imported.parsedRows}행을 읽었고 ${imported.skippedRows}행은 비어 있어 건너뛰었습니다.`
    );
  };

  const handlePredict = async () => {
    if (isPredicting || !canPredict) {
      return;
    }

    setIsPredicting(true);

    try {
      const predictionResult = await coupangCategoryPredictionApi.predict({
        productName: draft.sourceCategory,
        productDescription: draft.productDescription,
        brand: draft.brand,
      });

      setResult(predictionResult);
      setLastSubmittedDraft(draft);
      messageApi.success({
        content: "카테고리 예측이 완료되었습니다.",
        style: { color: "#EEE" },
      });
    } catch (error) {
      setResult(null);
      setLastSubmittedDraft(draft);
      messageApi.error({
        content: error instanceof Error ? error.message : "카테고리 예측 중 오류가 발생했습니다.",
        style: { color: "#EEE" },
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleImportExcel = async () => {
    if (isImportingExcel) {
      return;
    }

    setIsImportingExcel(true);

    try {
      const selectedPath = await coupangCategoryPredictionApi.chooseImportExcelFile();

      if (!selectedPath) {
        return;
      }

      await importExcelFromPath(selectedPath);
      messageApi.success({
        content: "엑셀 양식 불러오기 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      setImportedRows([]);
      setBatchResult(null);
      setImportSummary("");
      messageApi.error({
        content: error instanceof Error ? error.message : "엑셀 파일을 읽지 못했습니다.",
        style: { color: "#EEE" },
      });
    } finally {
      setIsImportingExcel(false);
    }
  };

  const handleBatchPredict = async () => {
    if (isBatchPredicting || !canRunBatch) {
      return;
    }

    setIsBatchPredicting(true);
    setBatchResult(null);
    setBatchProgress({
      processedRows: 0,
      totalRows: importedRows.length,
      successCount: 0,
      errorCount: 0,
      currentRowNumber: null,
      currentSourceCategory: null,
      status: "running",
    });

    try {
      const nextResult = await coupangCategoryPredictionApi.predictBatch({ rows: importedRows });

      setBatchResult(nextResult);
      setBatchProgress((current) =>
        current
          ? {
              ...current,
              processedRows: nextResult.totalRows,
              totalRows: nextResult.totalRows,
              successCount: nextResult.successCount,
              errorCount: nextResult.errorCount,
              currentRowNumber: null,
              currentSourceCategory: null,
              status: "completed",
            }
          : current
      );
      messageApi.success({
        content: "엑셀 일괄 예측이 완료되었습니다.",
        style: { color: "#EEE" },
      });
    } catch (error) {
      setBatchResult(null);
      setBatchProgress(null);
      messageApi.error({
        content: error instanceof Error ? error.message : "엑셀 일괄 예측 중 오류가 발생했습니다.",
        style: { color: "#EEE" },
      });
    } finally {
      setIsBatchPredicting(false);
    }
  };

  const handleTemplateDownload = async () => {
    if (isDownloadingTemplate) {
      return;
    }

    setIsDownloadingTemplate(true);

    try {
      const selectedPath = await coupangCategoryPredictionApi.chooseTemplateSavePath();

      if (!selectedPath) {
        return;
      }

      const response = await coupangCategoryPredictionApi.downloadTemplate({ savePath: selectedPath });

      if (!response.result) {
        throw new Error(response.errorLog || "템플릿 다운로드 실패");
      }

      setTemplateSavePath(selectedPath);

      messageApi.success({
        content: "엑셀 양식 다운로드 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : "엑셀 양식 다운로드 실패",
        style: { color: "#EEE" },
      });
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleBatchResultDownload = async () => {
    if (isDownloadingBatchResult || !hasBatchResult || !batchResult) {
      return;
    }

    setIsDownloadingBatchResult(true);

    try {
      const selectedPath = await coupangCategoryPredictionApi.chooseBatchResultSavePath();

      if (!selectedPath) {
        return;
      }

      const response = await coupangCategoryPredictionApi.downloadBatchResults({
        savePath: selectedPath,
        rows: batchResult.rows,
      });

      if (!response.result) {
        throw new Error(response.errorLog || "결과 엑셀 다운로드 실패");
      }

      setExportSavePath(selectedPath);

      messageApi.success({
        content: "결과 엑셀 다운로드 성공!",
        style: { color: "#EEE" },
      });
    } catch (error) {
      messageApi.error({
        content: error instanceof Error ? error.message : "결과 엑셀 다운로드 실패",
        style: { color: "#EEE" },
      });
    } finally {
      setIsDownloadingBatchResult(false);
    }
  };

  const handleSinglePressEnter = () => {
    void handlePredict();
  };

  const handleDropImport: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setIsDragActive(false);

    const droppedFile = event.dataTransfer.files.item(0);
    const droppedPath = droppedFile ? Reflect.get(droppedFile, "path") : null;

    if (typeof droppedPath !== "string" || !droppedPath) {
      messageApi.error({
        content: "드롭한 파일 경로를 확인할 수 없습니다. 파일 불러오기 버튼을 사용해주세요.",
        style: { color: "#EEE" },
      });
      return;
    }

    setIsImportingExcel(true);
    void importExcelFromPath(droppedPath)
      .then(() => {
        messageApi.success({
          content: "드래그앤드롭으로 엑셀 파일을 불러왔습니다.",
          style: { color: "#EEE" },
        });
      })
      .catch((error) => {
        setImportedRows([]);
        setBatchResult(null);
        setImportSummary("");
        messageApi.error({
          content: error instanceof Error ? error.message : "드롭한 엑셀 파일을 읽지 못했습니다.",
          style: { color: "#EEE" },
        });
      })
      .finally(() => {
        setIsImportingExcel(false);
      });
  };

  const renderSingleMode = () => (
    <>
      <Col span={24}>
        <ToneSectionCard
          icon={<BulbOutlined style={{ fontSize: 18, color: "#EEE" }} />}
          title="매칭 준비"
          extra={
            <Row gutter={[8, 8]} justify="end">
              <Col>
                <ToneStatusChip tone={hasSourceCategory ? "success" : "default"}>
                  {hasSourceCategory ? "입력 준비됨" : "입력 대기"}
                </ToneStatusChip>
              </Col>
              <Col>
                <ToneStatusChip tone={hasCoupangCredentials ? "success" : "warning"}>
                  {hasCoupangCredentials ? "Coupang Key 준비됨" : "Coupang Key 필요"}
                </ToneStatusChip>
              </Col>
              <Col>
                <ToneStatusChip tone={predictionTone}>
                  {isPredicting ? "예측 요청 중" : result ? "예측 완료" : "예측 대기"}
                </ToneStatusChip>
              </Col>
            </Row>
          }
        >
          <ToneGroup
            icon={<SearchOutlined style={{ fontSize: 16, color: "#EEE" }} />}
            title="예측 입력"
            tag={
              <ToneStatusChip tone={lastSubmittedDraft ? "success" : "default"}>
                {lastSubmittedDraft ? "최근 요청 반영됨" : "요청 전"}
              </ToneStatusChip>
            }
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} md={10}>
                <ToneField label="상품명 또는 원본 카테고리">
                  <Input
                    size="large"
                    placeholder="예: 여성 샌들, 캠핑 랜턴, 주방 수납함"
                    value={draft.sourceCategory}
                    onChange={(event) => {
                      setDraft((prev) => ({ ...prev, sourceCategory: event.target.value }));
                    }}
                    onPressEnter={handleSinglePressEnter}
                  />
                </ToneField>
              </Col>
              <Col xs={24} md={10}>
                <ToneField label="상품 설명(선택)">
                  <Input
                    size="large"
                    placeholder="예: EVA 밑창, 미끄럼 방지, 여름용"
                    value={draft.productDescription}
                    onChange={(event) => {
                      setDraft((prev) => ({ ...prev, productDescription: event.target.value }));
                    }}
                    onPressEnter={handleSinglePressEnter}
                  />
                </ToneField>
              </Col>
              <Col xs={24} md={4}>
                <ToneField label="브랜드(선택)">
                  <Input
                    size="large"
                    placeholder="브랜드"
                    value={draft.brand}
                    onChange={(event) => {
                      setDraft((prev) => ({ ...prev, brand: event.target.value }));
                    }}
                    onPressEnter={handleSinglePressEnter}
                  />
                </ToneField>
              </Col>
              <Col span={24}>
                <div style={{ ...pageToneStyles.actionStrip, marginTop: 4 }}>
                  <Row gutter={[12, 12]} align="middle" justify="space-between">
                    <Col flex="auto">
                      <Text style={{ ...pageToneStyles.fieldLabel, marginBottom: 0, display: "block" }}>
                        예측 실행
                      </Text>
                      <Text style={{ ...pageToneStyles.helperText, marginTop: 4 }}>
                        상품명 입력 후 Coupang API Key가 준비되어 있으면 바로 예측 요청을 실행합니다.
                      </Text>
                    </Col>
                    <Col xs={24} sm={12} md={7} lg={6} xl={5}>
                      <Button
                        block
                        size="large"
                        type="primary"
                        icon={<RobotOutlined />}
                        style={{ color: "#000" }}
                        disabled={!canPredict}
                        loading={isPredicting}
                        onClick={() => void handlePredict()}
                      >
                        Coupang 예측 실행
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
          icon={<DeploymentUnitOutlined style={{ fontSize: 18, color: "#EEE" }} />}
          title="예측 결과"
        >
          <ToneGroup
            title="Coupang 카테고리 후보"
            tag={
              <ToneStatusChip tone={result ? "success" : "default"}>
                {result ? "후보 수신 완료" : "제출 전"}
              </ToneStatusChip>
            }
          >
            {result && lastSubmittedDraft ? (
              <>
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={12}>
                    <ToneStatTile
                      label="요청 상품명"
                      value={<div style={clampedStatValueStyle}>{lastSubmittedDraft.sourceCategory}</div>}
                      helper="마지막 예측 요청 기준"
                      accent="default"
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <ToneStatTile
                      label="1순위 카테고리"
                      value={<div style={clampedStatValueStyle}>{topCandidate?.categoryName ?? "없음"}</div>}
                      helper={
                        topCandidate ? (
                          <CopyToClipboard
                            text={topCandidate.categoryCode}
                            onCopy={() => {
                              messageApi.success({
                                content: "카테고리 번호 복사 성공!",
                                style: { color: "#EEE" },
                                icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                              });
                            }}
                          >
                            <Button size="small" icon={<CopyOutlined />} style={{ marginTop: 2 }}>
                              [{topCandidate.categoryCode}] 복사
                            </Button>
                          </CopyToClipboard>
                        ) : (
                          "후보 없음"
                        )
                      }
                      accent={topCandidate ? "success" : "warning"}
                    />
                  </Col>
                </Row>

                <div style={{ ...pageToneStyles.actionStrip, marginTop: 16 }}>
                  <Text style={pageToneStyles.infoValue}>{result.summary}</Text>
                  {topCandidate ? (
                    <CopyToClipboard
                      text={topCandidate.categoryCode}
                      onCopy={() => {
                        messageApi.success({
                          content: "카테고리 번호 복사 성공!",
                          style: { color: "#EEE" },
                          icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                        });
                      }}
                    >
                      <Text style={{ ...pageToneStyles.helperText, cursor: "pointer" }}>
                        추천 카테고리: [{topCandidate.categoryCode}] {topCandidate.categoryName} (클릭 복사)
                      </Text>
                    </CopyToClipboard>
                  ) : null}
                  {result.rawCode ? (
                    <Text style={pageToneStyles.helperText}>응답 코드: {result.rawCode}</Text>
                  ) : null}
                </div>
              </>
            ) : (
              <div style={pageToneStyles.infoPanel}>
                <Text style={pageToneStyles.infoValue}>아직 예측 결과가 없습니다.</Text>
                <Text style={pageToneStyles.helperText}>
                  {hasCoupangCredentials
                    ? "상품명을 입력한 뒤 Coupang 예측 실행을 눌러주세요."
                    : "설정 페이지에서 Coupang Access Key/Secret Key를 저장한 뒤 예측을 실행해주세요."}
                </Text>
              </div>
            )}
          </ToneGroup>
        </ToneSectionCard>
      </Col>
    </>
  );

  const renderExcelMode = () => (
    <>
      <Col span={24}>
        <ToneSectionCard
          icon={<FileExcelOutlined style={{ fontSize: 18, color: "#EEE" }} />}
          title="엑셀 검색 준비"
          extra={
            <Row gutter={[8, 8]} justify="end">
              <Col>
                <ToneStatusChip tone={templateSavePath ? "success" : "default"}>
                  {templateSavePath ? "양식 저장 완료" : "양식 미저장"}
                </ToneStatusChip>
              </Col>
              <Col>
                <ToneStatusChip tone={hasImportedRows ? "success" : "warning"}>
                  {hasImportedRows ? `${importedRows.length}행 로드됨` : "엑셀 로드 필요"}
                </ToneStatusChip>
              </Col>
              <Col>
                <ToneStatusChip tone={hasCoupangCredentials ? "success" : "warning"}>
                  {hasCoupangCredentials ? "Coupang Key 준비됨" : "Coupang Key 필요"}
                </ToneStatusChip>
              </Col>
              <Col>
                <ToneStatusChip tone={batchStatusTone}>
                  {isBatchPredicting ? "일괄 예측 중" : hasBatchResult ? "결과 준비 완료" : "실행 대기"}
                </ToneStatusChip>
              </Col>
            </Row>
          }
        >
          <ToneGroup
            icon={<UploadOutlined style={{ fontSize: 16, color: "#EEE" }} />}
            title="엑셀 작업 흐름"
            tag={<ToneStatusChip tone={hasImportedRows ? "success" : "warning"}>{hasImportedRows ? "검색 실행 가능" : "엑셀 로드 대기"}</ToneStatusChip>}
          >
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <div style={pageToneStyles.actionStrip}>
                  <Row gutter={[12, 12]} align="middle" justify="space-between">
                    <Col flex="auto">
                      <Text style={pageToneStyles.infoValue}>{excelWorkflowSummary}</Text>
                      {recentExcelPathLabel ? (
                        <Text style={pageToneStyles.helperText}>{recentExcelPathLabel}</Text>
                      ) : null}
                      {batchProgress && isBatchPredicting ? (
                        <>
                          <Text style={pageToneStyles.helperText}>
                            {batchProgress.processedRows} / {batchProgress.totalRows} 처리 완료 · 성공 {batchProgress.successCount}
                            건 · 실패 {batchProgress.errorCount}건
                            {batchProgress.currentSourceCategory
                              ? ` · 현재: ${batchProgress.currentSourceCategory}`
                              : ""}
                          </Text>
                          <Progress
                            percent={batchProgressPercent}
                            size="small"
                            status="active"
                            showInfo={false}
                            strokeColor="#22c78a"
                            trailColor="rgba(255, 255, 255, 0.12)"
                            style={{ marginTop: 8, marginBottom: 0 }}
                          />
                        </>
                      ) : null}
                    </Col>
                    <Col xs={24} sm={8} md={7} lg={5} xl={5}>
                      <Button
                        block
                        size="large"
                        type="primary"
                        style={{ color: "#000" }}
                        icon={<CloudDownloadOutlined />}
                        loading={isDownloadingTemplate}
                        onClick={() => void handleTemplateDownload()}
                      >
                        양식 다운로드
                      </Button>
                    </Col>
                    <Col xs={24} sm={8} md={5} lg={4} xl={4}>
                      <Button
                        block
                        size="large"
                        type="default"
                        icon={<UploadOutlined />}
                        loading={isImportingExcel}
                        onClick={() => void handleImportExcel()}
                      >
                        파일 불러오기
                      </Button>
                    </Col>
                    <Col xs={24} sm={8} md={5} lg={4} xl={4}>
                      <Button
                        block
                        size="large"
                        type="primary"
                        style={{ color: "#000" }}
                        icon={<RobotOutlined />}
                        loading={isBatchPredicting}
                        disabled={!canRunBatch}
                        onClick={() => void handleBatchPredict()}
                      >
                        검색 실행
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col span={24}>
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragActive(true);
                  }}
                  onDragLeave={() => {
                    setIsDragActive(false);
                  }}
                  onDrop={handleDropImport}
                  style={{
                    ...pageToneStyles.infoPanel,
                    borderStyle: "dashed",
                    borderColor: isDragActive ? "#66d9b8" : "rgba(196, 212, 255, 0.22)",
                    background: isDragActive ? "rgba(80, 141, 105, 0.18)" : "rgba(10, 20, 40, 0.18)",
                    padding: "10px 14px",
                    minHeight: 0,
                    cursor: "copy",
                  }}
                >
                  <Row gutter={[12, 8]} align="middle" justify="space-between">
                    <Col flex="auto">
                      <Text style={pageToneStyles.infoValue}>
                        {isDragActive ? "여기에 파일을 놓아주세요." : "엑셀 파일 드래그앤드롭"}
                      </Text>
                    </Col>
                    <Col>
                      <ToneStatusChip tone={isDragActive ? "processing" : hasImportedRows ? "success" : "default"}>
                        {isDragActive ? "드롭 준비" : hasImportedRows ? "파일 로드됨" : "파일 대기"}
                      </ToneStatusChip>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </ToneGroup>

          <ToneGroup
            icon={<CloudDownloadOutlined style={{ fontSize: 16, color: "#EEE" }} />}
            title="결과 엑셀 다운로드"
            tag={<ToneStatusChip tone={hasBatchResult ? "success" : "default"}>{hasBatchResult ? "다운로드 가능" : "결과 대기"}</ToneStatusChip>}
          >
            <div style={pageToneStyles.actionStrip}>
              <Row gutter={[12, 12]} align="middle" justify="space-between">
                <Col flex="auto">
                  <Text style={pageToneStyles.infoValue}>테이블 결과를 바로 엑셀로 저장합니다.</Text>
                  <Text style={pageToneStyles.helperText}>
                    현재 보이는 결과 행을 Excel 파일로 저장할 경로를 native 저장창에서 선택합니다.
                  </Text>
                  {exportSavePath ? (
                    <Text style={pageToneStyles.helperText}>최근 저장 위치: {exportSavePath}</Text>
                  ) : null}
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={5}>
                  <Button
                    block
                    size="large"
                    type="primary"
                    style={{ color: "#000" }}
                    icon={<CloudDownloadOutlined />}
                    loading={isDownloadingBatchResult}
                    disabled={!hasBatchResult}
                    onClick={() => void handleBatchResultDownload()}
                  >
                    결과 다운로드
                  </Button>
                </Col>
              </Row>
            </div>
          </ToneGroup>
        </ToneSectionCard>
      </Col>

      <Col span={24}>
        <ToneSectionCard
          icon={<DeploymentUnitOutlined style={{ fontSize: 18, color: "#EEE" }} />}
          title="엑셀 검색 결과"
        >
          <ToneGroup
            title="일괄 예측 테이블"
            tag={<ToneStatusChip tone={hasBatchResult ? "success" : "default"}>{hasBatchResult ? "테이블 준비 완료" : "결과 없음"}</ToneStatusChip>}
          >
            {batchResult ? (
              <>
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={8}>
                    <ToneStatTile
                      label="총 검색 행"
                      value={`${batchResult.totalRows}건`}
                      helper="엑셀에서 읽은 전체 검색 대상"
                      accent="default"
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <ToneStatTile
                      label="성공 건수"
                      value={`${batchResult.successCount}건`}
                      helper="카테고리를 받은 행"
                      accent="success"
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <ToneStatTile
                      label="실패 건수"
                      value={`${batchResult.errorCount}건`}
                      helper="입력 오류 또는 API 실패"
                      accent={batchResult.errorCount > 0 ? "warning" : "success"}
                    />
                  </Col>
                </Row>
                <div style={{ ...pageToneStyles.actionStrip, marginTop: 16 }}>
                  <Text style={pageToneStyles.infoValue}>{batchResult.summary}</Text>
                </div>
                <div style={pageToneStyles.tableWrap}>
                  <Table
                    className="custom-table"
                    columns={batchColumns}
                    dataSource={batchResult.rows.map((row) => ({ ...row, key: row.rowNumber }))}
                    pagination={{ pageSize: 10, showSizeChanger: false }}
                    scroll={{ x: "max-content" }}
                    bordered
                  />
                </div>
              </>
            ) : (
              <div style={pageToneStyles.infoPanel}>
                <Text style={pageToneStyles.infoValue}>아직 엑셀 검색 결과가 없습니다.</Text>
                <Text style={pageToneStyles.helperText}>
                  엑셀 양식을 채운 뒤 불러오고, 일괄 검색 실행을 눌러주세요.
                </Text>
              </div>
            )}
          </ToneGroup>
        </ToneSectionCard>
      </Col>
    </>
  );

  return (
    <>
      {contextHolder}
      <div>
        <TonePageHeading
          icon={<RobotOutlined style={{ fontSize: "20px", color: "#EEE" }} />}
          title="카테고리 AI 매칭"
        />
        <Divider />

        <Row gutter={[0, 16]} style={{ marginTop: 8 }}>
          <Col span={24}>
            <ToneSectionCard
              icon={<BulbOutlined style={{ fontSize: 18, color: "#EEE" }} />}
              title="검색 모드 선택"
              extra={
                <ToneStatusChip tone={mode === "single" ? "processing" : "success"}>
                  {mode === "single" ? "단일 검색 모드" : "엑셀 검색 모드"}
                </ToneStatusChip>
              }
            >
              <div style={pageToneStyles.actionStrip}>
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={12}>
                    <Button
                      block
                      size="large"
                      type={mode === "single" ? "primary" : "default"}
                      style={mode === "single" ? { color: "#000" } : undefined}
                      icon={<SearchOutlined />}
                      onClick={() => setMode("single")}
                    >
                      단일 검색
                    </Button>
                  </Col>
                  <Col xs={24} md={12}>
                    <Button
                      block
                      size="large"
                      type={mode === "excel" ? "primary" : "default"}
                      style={mode === "excel" ? { color: "#000" } : undefined}
                      icon={<FileExcelOutlined />}
                      onClick={() => setMode("excel")}
                    >
                      엑셀 검색
                    </Button>
                  </Col>
                </Row>
              </div>
            </ToneSectionCard>
          </Col>

          {mode === "single" ? renderSingleMode() : renderExcelMode()}
        </Row>
      </div>
    </>
  );
}
