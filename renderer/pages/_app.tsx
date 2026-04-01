import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import TLayOut from "../components/LayOut/TLayOut";
import "../assets/styles/globals.css";
import theme from "../theme/themeConfig";
import { AnimatePresence, motion } from "framer-motion";

const menuOrder = [
  "opt",
  "home",
  "kwd",
  "hsCode",
  "cpCat",
  "customsValidation",
  "categoryAiMatch",
];

const App = ({ Component, pageProps, router }: AppProps) => {
  const [prevIndex, setPrevIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  const noLayoutPages = ["/update"];
  const shouldApplyLayout = !noLayoutPages.includes(router.pathname);

  useEffect(() => {
    const currentKey = router.pathname.replace("/", "") || "home";
    const currentIndex = menuOrder.indexOf(currentKey);

    if (currentIndex !== -1) {
      setDirection(currentIndex > prevIndex ? -1 : 1); // 인덱스 비교하여 방향 설정
      setPrevIndex(currentIndex); // 현재 인덱스를 저장
    }
  }, [router.pathname]);

  return shouldApplyLayout ? (
    <ConfigProvider theme={theme}>
      <TLayOut>
        <AnimatePresence mode="wait">
          <motion.div
            key={router.route} // 라우트 변경 감지
            initial={{ y: direction * 80, opacity: 0 }} // 인덱스 따라 방향 조정
            animate={{ y: 0, opacity: 1 }} // 자연스럽게 보이기
            exit={{ y: -80, opacity: 0 }} // 위로 사라지기
            transition={{ duration: 0.3, ease: "easeInOut" }} // 부드러운 애니메이션
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </TLayOut>
    </ConfigProvider>
  ) : (
    <ConfigProvider theme={theme}>
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route} // 라우트 변경 감지
          initial={{ y: direction * 80, opacity: 0 }} // 인덱스 따라 방향 조정
          animate={{ y: 0, opacity: 1 }} // 자연스럽게 보이기
          exit={{ y: -80, opacity: 0 }} // 위로 사라지기
          transition={{ duration: 0.3, ease: "easeInOut" }} // 부드러운 애니메이션
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </ConfigProvider>
  );
};

export default App;
