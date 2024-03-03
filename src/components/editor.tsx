"use client";

import { Images } from "@/components/images";
import { publishToGreenfield } from "@/components/greenfield-uploader";
import { usePersistence } from "@/hooks/usePersistence";
import { embedImagesIntoMarkdown } from "@/utils/markdown";
import MDEditor from "@uiw/react-md-editor";
import { Button, Col, Form, Input, Row, Space, Tabs, Typography } from "antd";
import { useMemo, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { ContentOrPrompt } from "@/components/create-media-form/content-or-prompt";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { GREEN_CHAIN_ID } from "@/config";
import Script from 'next/script';

export function Editor() {
  const [selectedTab, selectTab] = useState<"editor" | "article">("editor");
  const {
    title,
    setTitle,
    brief,
    setBrief,
    markdown,
    setMarkdown,
    images,
    setImages,
    bucket,
    setBucket,
  } = usePersistence();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient({
    chainId: GREEN_CHAIN_ID
  });
  const readClient = usePublicClient({
    chainId: GREEN_CHAIN_ID
  });
  const replasedMarkdown = useMemo(
    () => embedImagesIntoMarkdown(markdown, images),
    [markdown, images]
  );
  const handleFormSubmit = async () => {
    // Call publishToGreenfield with the current state
    await publishToGreenfield({
      title,
      brief,
      markdown: replasedMarkdown,
      images,
      bucket,
      address,
      readClient,
      walletClient,
    });
  };

  return (
    <>
      <Typography.Title level={2}>Create your amazing article</Typography.Title>
      <Script src="https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/browser/umd/index.js" strategy="beforeInteractive"></Script>
      <Script id="set-wasm-path"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__PUBLIC_FILE_HANDLE_WASM_PATH__ = 'https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/node/file-handle.wasm'`,
        }}
      ></Script>
      <Row justify="center" className="my-10">
         <ConnectKitButton />
      </Row>
      <ContentOrPrompt>
        <Row className="mt-6">
          <Col offset={4} span={16}>
            <Form layout="vertical" onFinish={handleFormSubmit}>
              <Space direction="vertical" className="w-full">
                <Col offset={4} span={10}>
                <Form.Item label="Grenfield Bucket" className="w-[340px]">
                    <Input
                      value={bucket}
                      onChange={(e) => setBucket(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="Title" className="w-[340px]">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col offset={4} span={16}>
                  <Form.Item
                    label="Brief (max 200 symbols)"
                    className="w-[500px]"
                  >
                    <Input.TextArea
                      placeholder="This text will be visible on the feed row"
                      maxLength={200}
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Form.Item label="Content" className="w-full">
                  <Tabs
                    type="card"
                    items={[
                      {
                        key: "editor",
                        label: "Edit",
                        children: (
                          <MDEditor
                            value={markdown}
                            onChange={(m) => setMarkdown(m as string)}
                            preview="edit"
                            className="min-h-[300px]"
                          />
                        ),
                        active: selectedTab === "editor",
                      },
                      {
                        key: "article",
                        label: "View",
                        children: (
                          <MDEditor.Markdown
                            source={replasedMarkdown}
                            className="min-h-[300px]"
                          />
                        ),
                        active: selectedTab === "article",
                      },
                    ]}
                    onChange={(k) => selectTab(k as "editor" | "article")}
                  />
                </Form.Item>
                <Form.Item label="Assets">
                  <Images
                    values={images}
                    onChange={setImages}
                    onInsert={(imageIndex) => {
                      setMarkdown(currentMarkdown => 
                        `${currentMarkdown}<img src="images:${imageIndex}" width="100" height="100" alt="image">`
                      );
                    }}
                  />
                </Form.Item>
                <Row justify="center">
                <Button type="primary" htmlType="submit">
                  Publish
                </Button>
                </Row>
              </Space>
            </Form>
          </Col>
        </Row>
      </ContentOrPrompt>
    </>
  );
}
