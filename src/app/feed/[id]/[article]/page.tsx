"use client";
import { Article, ArticleInfo } from "@/components/feed";
import { useQuery } from "@tanstack/react-query";
import { Space, Spin } from "antd";
import { ConnectKitButton } from "connectkit";
import { setTimeout } from "timers";

const articles: Record<string, Omit<Article, "id">> = {
  "123": {
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    name: "Awesome article 1",
    text: "___Cool text___",
  },
};

function useArticle(mediaId: string, preview: string) {
  return useQuery<Article, Error, Article, [string, string, string]>({
    queryKey: ["ARTICLE_LOAD", mediaId, preview],
    queryFn: async ({ queryKey }) => {
      if (queryKey[2] in articles) {
        const articleId = queryKey[2];
        return { ...articles[articleId], id: articleId };
      }
      throw new Error("Article not found");
    },
  });
}

export default function Page({
  params,
}: {
  params: { id: `0x${string}`; article: string };
}) {
  const { isLoading, data } = useArticle(params.id, params.article);
  return (
    <Space className="w-full" direction="vertical" align="center" size="large">
      <ConnectKitButton />
      {isLoading ? (
        <Spin tip="Loading...">
          <div />
        </Spin>
      ) : (
        <ArticleInfo {...data!} />
      )}
    </Space>
  );
}
