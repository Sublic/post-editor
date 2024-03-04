"use client";

import { Images } from "@/components/images";
import { publishToGreenfield } from "@/components/greenfield-uploader";
import { usePersistence } from "@/hooks/usePersistence";
import { embedImagesIntoMarkdown } from "@/utils/markdown";
import MDEditor from "@uiw/react-md-editor";
import { Button, Col, Form, Input, Row, Space, Tabs, Typography } from "antd";
import { useMemo, useState } from "react";
import { ContentOrPrompt } from "@/components/create-media-form/content-or-prompt";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { GREEN_CHAIN_ID } from "@/config";
import Script from "next/script";
import { bscTestnet } from "viem/chains";

interface EditorProps {
  mediaId: `0x${string}`;
}

export function Editor({ mediaId }: EditorProps) {
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
  } = usePersistence();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient({
    chainId: GREEN_CHAIN_ID,
  });
  const readClient = usePublicClient({
    chainId: GREEN_CHAIN_ID,
  })!;
  const bscReadClient = usePublicClient({
    chainId: bscTestnet.id,
  })!;
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
      mediaId,
      address,
      readClient,
      bscReadClient,
      walletClient: walletClient!,
    });
  };

  return (
    <>
      <Typography.Title level={2}>Create your amazing article</Typography.Title>
      <ContentOrPrompt>
        <Row className="mt-6">
          <Col offset={4} span={16}>
            <Form layout="vertical" onFinish={handleFormSubmit}>
              <Space direction="vertical" className="w-full">
                <Col offset={4} span={10}>
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
                      setMarkdown(
                        (currentMarkdown) =>
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
