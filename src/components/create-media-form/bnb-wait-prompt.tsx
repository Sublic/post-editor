"use client";
import { Row, Space, Spin, Typography } from "antd";

export function BnbWaitPropmt() {
  return (
    <Row justify="center" className="mt-10">
      <Space direction="vertical">
        <Typography.Title level={3}>
          <Spin />
          Be patient
        </Typography.Title>
        <Typography.Text strong>
          This step may take few minutes to go
        </Typography.Text>
      </Space>
    </Row>
  );
}
