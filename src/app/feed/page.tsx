"use client";

import { MediaList } from "@/components/media-list";
import { Row } from "antd";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <Row justify="center" className="mt-10 px-[20%]">
      <MediaList
        write={(id) => router.push(`/editor/${id}`)}
        read={(id) => router.push(`/feed/${id}`)}
      />
    </Row>
  );
}
