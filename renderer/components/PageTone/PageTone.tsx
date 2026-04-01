import React from "react";
import { Card, Col, Row, Tag, Typography } from "antd";

const { Text } = Typography;

export const pageToneStyles = {
  pageTitleText: {
    fontFamily: "LINESeedKR-Bd",
    fontSize: 20,
    color: "#EEE",
  } as React.CSSProperties,
  overviewCard: {
    marginTop: 24,
    background: "linear-gradient(135deg, rgba(11, 22, 37, 0.58), rgba(21, 94, 149, 0.34))",
    border: "1px solid rgba(238, 238, 238, 0.12)",
    borderRadius: 20,
    boxShadow: "0px 18px 36px rgba(0, 0, 0, 0.18)",
  } as React.CSSProperties,
  sectionCard: {
    background: "rgba(8, 19, 33, 0.34)",
    border: "1px solid rgba(238, 238, 238, 0.12)",
    borderRadius: 20,
    boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.16)",
  } as React.CSSProperties,
  group: {
    marginTop: 16,
    padding: 16,
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: "LINESeedKR-Bd",
    fontSize: 20,
    color: "#EEE",
  } as React.CSSProperties,
  sectionDescription: {
    display: "block",
    marginTop: 8,
    color: "#DCE4F0",
    fontSize: 13,
    lineHeight: 1.6,
  } as React.CSSProperties,
  groupTitle: {
    display: "block",
    color: "#EEE",
    fontFamily: "LINESeedKR-Bd",
    fontSize: 15,
  } as React.CSSProperties,
  fieldLabel: {
    display: "block",
    marginBottom: 8,
    color: "#EEF7FF",
    fontSize: 12,
    fontFamily: "LINESeedKR-Bd",
    letterSpacing: 0.2,
  } as React.CSSProperties,
  fieldStack: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  } as React.CSSProperties,
  fieldLabelSlot: {
    minHeight: 26,
    marginBottom: 8,
    display: "flex",
    alignItems: "flex-end",
  } as React.CSSProperties,
  fieldLabelGhost: {
    display: "block",
    minHeight: 18,
  } as React.CSSProperties,
  fieldControlWrap: {
    display: "flex",
    flex: 1,
    alignItems: "stretch",
  } as React.CSSProperties,
  helperText: {
    display: "block",
    marginTop: 6,
    color: "#DCE4F0",
    fontSize: 12,
    lineHeight: 1.6,
  } as React.CSSProperties,
  statusChip: {
    marginInlineEnd: 0,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.16)",
    fontSize: 12,
    lineHeight: 1.2,
    fontFamily: "LINESeedKR-Bd",
    letterSpacing: 0.2,
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.12)",
  } as React.CSSProperties,
  statusChipDefault: {
    color: "#EEF7FF",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
  } as React.CSSProperties,
  statusChipProcessing: {
    color: "#DFF6FF",
    background: "linear-gradient(135deg, rgba(50, 130, 184, 0.3), rgba(89, 168, 230, 0.18))",
    border: "1px solid rgba(130, 198, 255, 0.26)",
  } as React.CSSProperties,
  statusChipSuccess: {
    color: "#E8FFE8",
    background: "linear-gradient(135deg, rgba(61, 126, 91, 0.4), rgba(102, 187, 106, 0.18))",
    border: "1px solid rgba(171, 235, 198, 0.3)",
  } as React.CSSProperties,
  statusChipWarning: {
    color: "#FFF6D6",
    background: "linear-gradient(135deg, rgba(181, 112, 35, 0.42), rgba(255, 200, 87, 0.18))",
    border: "1px solid rgba(255, 216, 131, 0.28)",
  } as React.CSSProperties,
  statusChipError: {
    color: "#FFE2E2",
    background: "linear-gradient(135deg, rgba(160, 52, 69, 0.46), rgba(229, 82, 107, 0.18))",
    border: "1px solid rgba(255, 171, 185, 0.26)",
  } as React.CSSProperties,
  statTile: {
    height: "100%",
    padding: 16,
    background: "rgba(255, 255, 255, 0.07)",
    border: "1px solid rgba(255, 255, 255, 0.09)",
    borderRadius: 16,
  } as React.CSSProperties,
  statLabel: {
    display: "block",
    color: "#DCE4F0",
    fontSize: 11,
    fontFamily: "LINESeedKR-Bd",
    letterSpacing: 0.3,
  } as React.CSSProperties,
  statValue: {
    display: "block",
    marginTop: 8,
    color: "#EEE",
    fontSize: 20,
    fontFamily: "LINESeedKR-Bd",
    lineHeight: 1.3,
  } as React.CSSProperties,
  statValueSuccess: {
    color: "#CDFADB",
  } as React.CSSProperties,
  statValueWarning: {
    color: "#FFF6B3",
  } as React.CSSProperties,
  statHelper: {
    display: "block",
    marginTop: 8,
    color: "#DCE4F0",
    fontSize: 12,
    lineHeight: 1.5,
  } as React.CSSProperties,
  actionStrip: {
    padding: 16,
    background: "rgba(8, 19, 33, 0.28)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
  } as React.CSSProperties,
  tableWrap: {
    marginTop: 16,
    padding: 12,
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    overflow: "hidden",
  } as React.CSSProperties,
  infoPanel: {
    padding: 16,
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
  } as React.CSSProperties,
  infoValue: {
    display: "block",
    color: "#EEE",
    fontSize: 14,
    lineHeight: 1.7,
    wordBreak: "break-word",
  } as React.CSSProperties,
};

type TonePageHeadingProps = {
  icon: React.ReactNode;
  title: string;
};

type ToneOverviewCardProps = {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  tags?: React.ReactNode;
  children?: React.ReactNode;
};

type ToneSectionCardProps = {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
};

type ToneGroupProps = {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  tag?: React.ReactNode;
  children: React.ReactNode;
};

type ToneStatTileProps = {
  label: string;
  value: React.ReactNode;
  helper?: React.ReactNode;
  accent?: "default" | "success" | "warning";
};

type ToneFieldProps = {
  label?: React.ReactNode;
  helper?: React.ReactNode;
  children: React.ReactNode;
  reserveLabelSpace?: boolean;
};

type ToneStatusChipTone = "default" | "processing" | "success" | "warning" | "error";

type ToneStatusChipProps = {
  tone?: ToneStatusChipTone;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const toneStatusChipToneStyles: Record<ToneStatusChipTone, React.CSSProperties> = {
  default: pageToneStyles.statusChipDefault,
  processing: pageToneStyles.statusChipProcessing,
  success: pageToneStyles.statusChipSuccess,
  warning: pageToneStyles.statusChipWarning,
  error: pageToneStyles.statusChipError,
};

export function TonePageHeading({ icon, title }: TonePageHeadingProps) {
  return (
    <Row gutter={8} align="middle">
      <Col>{icon}</Col>
      <Col>
        <Text style={pageToneStyles.pageTitleText}>{title}</Text>
      </Col>
    </Row>
  );
}

export function ToneOverviewCard({
  icon,
  title,
  description,
  tags,
  children,
}: ToneOverviewCardProps) {
  const hasDescription = Boolean(description);

  return (
    <Card bordered={false} style={pageToneStyles.overviewCard} bodyStyle={{ padding: 20 }}>
      <Row gutter={[16, hasDescription ? 16 : 12]} justify="space-between" align="middle">
        <Col flex="auto">
          <Row gutter={[0, hasDescription ? 6 : 0]}>
            <Col span={24}>
              <Row align="middle" gutter={8}>
                <Col>{icon}</Col>
                <Col>
                  <Text style={{ ...pageToneStyles.groupTitle, fontSize: 16 }}>{title}</Text>
                </Col>
              </Row>
            </Col>
            {hasDescription ? (
              <Col span={24}>
                <Text style={{ ...pageToneStyles.sectionDescription, marginTop: 0 }}>
                  {description}
                </Text>
              </Col>
            ) : null}
          </Row>
        </Col>
        {tags ? <Col>{tags}</Col> : null}
      </Row>
      {children ? <div style={{ marginTop: hasDescription ? 18 : 14 }}>{children}</div> : null}
    </Card>
  );
}

export function ToneSectionCard({
  icon,
  title,
  description,
  extra,
  children,
}: ToneSectionCardProps) {
  const hasDescription = Boolean(description);

  return (
    <Card bordered={false} style={pageToneStyles.sectionCard} bodyStyle={{ padding: 20 }}>
      <Row gutter={[16, hasDescription ? 12 : 8]} justify="space-between" align="middle">
        <Col flex="auto">
          <Row gutter={[0, hasDescription ? 8 : 0]}>
            <Col span={24}>
              <Row align="middle" gutter={8}>
                <Col>{icon}</Col>
                <Col>
                  <Text style={pageToneStyles.sectionTitle}>{title}</Text>
                </Col>
              </Row>
            </Col>
            {hasDescription ? (
              <Col span={24}>
                <Text style={pageToneStyles.sectionDescription}>{description}</Text>
              </Col>
            ) : null}
          </Row>
        </Col>
        {extra ? <Col>{extra}</Col> : null}
      </Row>
      {children}
    </Card>
  );
}

export function ToneGroup({
  icon,
  title,
  description,
  tag,
  children,
}: ToneGroupProps) {
  const hasDescription = Boolean(description);

  return (
    <div style={pageToneStyles.group}>
      <Row gutter={[12, hasDescription ? 12 : 8]} justify="space-between" align="middle">
        <Col flex="auto">
          {icon ? (
            <Row align="middle" gutter={8}>
              <Col>{icon}</Col>
              <Col>
                <Text style={pageToneStyles.groupTitle}>{title}</Text>
              </Col>
            </Row>
          ) : (
            <Text style={pageToneStyles.groupTitle}>{title}</Text>
          )}
          {hasDescription ? <Text style={pageToneStyles.helperText}>{description}</Text> : null}
        </Col>
        {tag ? <Col>{tag}</Col> : null}
      </Row>
      <div style={{ marginTop: hasDescription ? 16 : 12 }}>{children}</div>
    </div>
  );
}

export function ToneField({
  label,
  helper,
  children,
  reserveLabelSpace = true,
}: ToneFieldProps) {
  return (
    <div style={pageToneStyles.fieldStack}>
      {label || reserveLabelSpace ? (
        <div style={pageToneStyles.fieldLabelSlot}>
          {label ? (
            <Text style={{ ...pageToneStyles.fieldLabel, marginBottom: 0 }}>{label}</Text>
          ) : (
            <span aria-hidden="true" style={pageToneStyles.fieldLabelGhost} />
          )}
        </div>
      ) : null}
      <div style={pageToneStyles.fieldControlWrap}>{children}</div>
      {helper ? <Text style={pageToneStyles.helperText}>{helper}</Text> : null}
    </div>
  );
}

export function ToneStatusChip({
  tone = "default",
  children,
  style,
}: ToneStatusChipProps) {
  return (
    <Tag style={{ ...pageToneStyles.statusChip, ...toneStatusChipToneStyles[tone], ...style }}>
      {children}
    </Tag>
  );
}

export function ToneStatTile({
  label,
  value,
  helper,
  accent = "default",
}: ToneStatTileProps) {
  const accentStyle =
    accent === "success"
      ? pageToneStyles.statValueSuccess
      : accent === "warning"
        ? pageToneStyles.statValueWarning
        : undefined;

  return (
    <div style={pageToneStyles.statTile}>
      <Text style={pageToneStyles.statLabel}>{label}</Text>
      <Text style={{ ...pageToneStyles.statValue, ...accentStyle }}>{value}</Text>
      {helper ? <Text style={pageToneStyles.statHelper}>{helper}</Text> : null}
    </div>
  );
}
