// theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  components: {
    Layout: {
      triggerBg: "#EEEEEE",
    },
    Menu: {
      darkItemColor: "#45474B",
    },
    Divider: {
      verticalMarginInline: 1,
    },
    Message: {
      contentBg: "transparent",
      fontSize: 14,
    },
    Form: {
      labelFontSize: 12,
      itemMarginBottom: 7,
    },
    Modal: {
      contentBg: "#F5F7F8",
      headerBg: "#F5F7F8",
      titleFontSize: 14,
    },
    Table: {
      bodySortBg: "#211C6A",
      headerBg: "#16C47F",
      cellPaddingBlock: 6,
      cellFontSize: 13,
      headerColor: "#000",
    },
    Statistic: {
      contentFontSize: 16,
      titleFontSize: 11,
    },
  },
  token: {
    fontSize: 13,
    fontFamily: "LINESeedKR-Rg",
    colorPrimary: "#16C47F",
  },
};

export default theme;
