import { Space, Typography } from "antd";
import { Article } from "./types";
import MDEditor from "@uiw/react-md-editor";

export function ArticleInfo({ description, name, text }: Article) {
  return (
    <Space direction="vertical" className="w-full" size="large">
      <Typography.Title level={3}>{name}</Typography.Title>
      <Typography.Paragraph>{description}</Typography.Paragraph>
      <MDEditor.Markdown source={text} style={{ textAlign: "initial" }} />
    </Space>
  );
}
