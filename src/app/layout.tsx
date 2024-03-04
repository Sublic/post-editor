"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Col, Layout, Menu, Row, Space, Typography } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "./providers";
import { ConnectKitButton } from "connectkit";
import {
  CameraOutlined,
  FileTextOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const { Header, Content, Sider } = Layout;

// export const metadata: Metadata = {
//   title: "Sublic editor",
//   description: "Post to your decentralized blog",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <html lang="en">
      <body className={inter.className}>
      <script src="https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/browser/umd/index.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__PUBLIC_FILE_HANDLE_WASM_PATH__ = 'https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/node/file-handle.wasm'`,
        }}
      ></script>
        <AntdRegistry>
          <Providers>
            <Layout>
              <Header className="min-h-fit">
                <Row align="middle">
                  <Col span={8}>
                    <Typography.Text strong>Sublic</Typography.Text>
                  </Col>
                  <Col md={{ span: 4, offset: 11 }} xs={{ offset: 2, span: 4 }}>
                    <ConnectKitButton />
                  </Col>
                </Row>
              </Header>
              <Layout className="min-h-screen">
                <Sider
                  className="border-solid border border-transparent border-r-gray-600 pt-10 mx-3"
                  breakpoint="md"
                  collapsedWidth="64"
                >
                  <Menu
                    className="pr-3"
                    items={[
                      {
                        key: "home",
                        label: "Home",
                        icon: <HomeOutlined />,
                        onClick: () => router.push("/"),
                      },
                      {
                        key: "media",
                        label: "My media",
                        icon: <FileTextOutlined />,
                        onClick: () => router.push("/feed"),
                      },
                      {
                        key: "setup",
                        label: "Create Media",
                        icon: <CameraOutlined />,
                        onClick: () => router.push("/setup"),
                      },
                    ]}
                  />
                </Sider>
                <Content className="p-4 text-center bg-transparent">
                  {children}
                </Content>
              </Layout>
            </Layout>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
