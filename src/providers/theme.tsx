import { App, ConfigProvider, theme } from "antd";
import React, { PropsWithChildren } from "react";

export const Theme = ({ children }: PropsWithChildren) => (
  <App>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f0b90b",
        },
        components: {
          Layout: {
            bodyBg: "transparent",
            headerBg: "#f0b90b",
            siderBg: "transparent",
          },
          Menu: {
            colorBgContainer: "transparent",
            lineWidth: 0,
            itemSelectedBg: "rgba(255,255,255,0.12)",
            itemSelectedColor: "#fff",
            fontWeightStrong: 500,
          },
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  </App>
);
