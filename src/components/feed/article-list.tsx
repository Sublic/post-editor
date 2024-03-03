import { List } from "antd";
import { ArticlePreview } from "./types";
import { ArticleRow } from "./article-row";

interface ArticleListProps {
  items: Array<ArticlePreview>;
  totalCount: number;
}

export function ArticleList({ items, totalCount }: ArticleListProps) {
  return (
    <List
      dataSource={items}
      bordered
      pagination={{
        position: "bottom",
        align: "center",
        pageSize: 5,
        total: totalCount,
      }}
      renderItem={(item, i) => (
        <List.Item key={i} className="mb-5">
          <ArticleRow {...item} />
        </List.Item>
      )}
    />
  );
}
