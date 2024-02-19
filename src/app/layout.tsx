"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout, Typography } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

const { Header, Content } = Layout;

// export const metadata: Metadata = {
//   title: "Sublic editor",
//   description: "Post to your decentralized blog",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <Providers>
            <Layout className="min-h-screen">
              <Header>
                <Typography.Text strong>Sublic</Typography.Text>
              </Header>
              <Content className="p-4 text-center bg-transparent">
                {children}
              </Content>
            </Layout>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
