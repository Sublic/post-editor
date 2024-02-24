"use client";
import { Row, Space, Typography } from "antd";

export function ConnectPropmt() {
  return (
    <Row justify="center" className="mt-10">
      <Space direction="vertical">
        <Typography.Title level={3}>Hold on</Typography.Title>
        <Typography.Text strong>
          You need to connect the wallet to move forward
        </Typography.Text>
      </Space>
    </Row>
  );
}
