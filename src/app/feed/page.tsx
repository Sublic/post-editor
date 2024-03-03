"use client";

import { MediaList } from "@/components/media-list";
import { Space } from "antd";
import { ConnectKitButton } from "connectkit";

export default function Page() {
  return (
    <Space
      direction="vertical"
      className="w-full pt-10"
      align="center"
      classNames={{ item: "mt-10" }}
    >
      <ConnectKitButton />
      <MediaList />
    </Space>
  );
}
