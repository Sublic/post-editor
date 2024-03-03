import { List } from "antd";
import { ArticlePreview } from "./types";
import { ArticleRow } from "./article-row";
import { redirect } from "next/dist/server/api-utils";

interface ArticleListProps {
  items: Array<ArticlePreview>;
  totalCount: number;
  redirect: (id: string) => void;
}

export function ArticleList({ items, totalCount, redirect }: ArticleListProps) {
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
          <ArticleRow {...item} redirect={redirect.bind(null, item.id)} />
        </List.Item>
      )}
    />
  );
}
