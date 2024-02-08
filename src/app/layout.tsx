"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout, Typography } from "antd";
import { Theme } from "@/providers/theme";
import { AntdRegistry } from "@ant-design/nextjs-registry";

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
    <Theme>
      <AntdRegistry>
        <html lang="en">
          <body className={inter.className}>
            <Layout className="min-h-screen">
              <Header>
                <Typography.Text strong>Sublic</Typography.Text>
              </Header>
              <Content className="p-4 text-center bg-transparent">
                {children}
              </Content>
            </Layout>
          </body>
        </html>
      </AntdRegistry>
    </Theme>
  );
}
