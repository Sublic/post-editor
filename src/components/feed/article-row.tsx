import { Button, Col, Row, Typography } from "antd";
import { ArticlePreview } from "./types";
import { redirect } from "next/navigation";

export function ArticleRow({ description, id, name }: ArticlePreview) {
  return (
    <Row className="text-center">
      <Col span={8} offset={8}>
        <Typography.Title level={3}>{name}</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Paragraph className="text-center">
          {description}
        </Typography.Paragraph>
      </Col>
      <Col offset={10} span={4}>
        <Button type="primary" onClick={() => redirect(`./${id}`)}>
          Read
        </Button>
      </Col>
    </Row>
  );
}
