import { Button, Col, Row, Space, Typography } from "antd";
import { redirect } from "next/navigation";

export function DoneStep({ mediaId }: { mediaId: `0x${string}` }) {
  return (
    <Space direction="vertical" className="w-full" size="middle">
      <Typography.Title level={3}>Congrats!</Typography.Title>
      <Typography.Text strong>
        Your media succefully bootstraped
      </Typography.Text>
      <Row className="mt-5">
        <Col offset={8} span={4}>
          <Typography.Text>Make your awesome articles:</Typography.Text>
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={() => redirect(`/editor/${mediaId}`)}>
            Editor
          </Button>
        </Col>
      </Row>
      <Row>
        <Col offset={10} span={4}>
          <Typography.Text copyable={{ text: `link` }}>
            Share the link with your followers
          </Typography.Text>
        </Col>
      </Row>
    </Space>
  );
}
