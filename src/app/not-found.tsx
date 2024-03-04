"use client";
import { Flex, Row, Typography } from "antd";

export default function ErrorPage() {
  return (
    <Flex className="w-full h-full">
      <Row justify="center" className="self-center w-full flex-col">
        <Typography.Title level={2}>404</Typography.Title>
        <Typography.Text strong>Page not found</Typography.Text>
      </Row>
    </Flex>
  );
}
