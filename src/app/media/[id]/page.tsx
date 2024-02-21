"use client";
import { CheckPermissions } from "@/components/check-permission";
import { Typography } from "antd";

export default function Page({ params }: { params: { id: `0x${string}` } }) {
  return (
    <CheckPermissions mediaId={params.id}>
      <Typography.Text strong>Your media feed</Typography.Text>
    </CheckPermissions>
  );
}
