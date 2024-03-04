"use client";
import { Article, ArticleInfo } from "@/components/feed";
import { SubscriptionGate } from "@/components/subscription-gate";
import { useQuery } from "@tanstack/react-query";
import { Row, Spin } from "antd";
import {downloadFile} from "@/client/greenfieldDownloadFile";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { GREEN_CHAIN_ID } from "@/config";
import { bscTestnet } from "viem/chains";
import { getBucketFromMediaId } from "@/client/getBucketFromMediaId";

const articles: Record<string, Omit<Article, "id">> = {
  "123": {
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    name: "Awesome article 1",
    text: "___Cool text___",
  },
};

function useArticle(mediaId: string, preview: string, address: `0x${string}` | undefined, walletClient: any, bscReadClient: any) {
  return useQuery<Article, Error, Article, [string, string, string]>({
    queryKey: ["ARTICLE_LOAD", mediaId, preview],
    queryFn: async ({ queryKey }) => {
      const { bucketInfo } = await getBucketFromMediaId(mediaId, {
        readClient: bscReadClient,
      });
      console.log(mediaId, preview, queryKey, bucketInfo.bucketName, address, walletClient, window);
      const name_description = await downloadFile(`${queryKey[2]}/name_description.txt`,bucketInfo.bucketName,{
        user: address,
        viemClient: walletClient,
        window,
      });
      const parts = name_description.split("\n----\n");
      const name = parts[0].trim();
      const description = parts[1].trim();
      const file = await downloadFile(`${queryKey[2]}/content.md`,bucketInfo.bucketName,{
        user: address,
        viemClient: walletClient,
        window,
      });
      console.log(file);
      return {
        description: description,
        name: name,
        text: file,
      }
    },
  });
}

export default function Page({
  params,
}: {
  params: { id: `0x${string}`; article: string };
}) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient({
    chainId: GREEN_CHAIN_ID,
  });
  const bscReadClient = usePublicClient({
    chainId: bscTestnet.id,
  })!;
  const { isLoading, data } = useArticle(params.id, params.article, address, walletClient, bscReadClient);
  return (
    <Row justify="center" className="px-[10%]">
      {/* <SubscriptionGate mediaId={params.id}> */}
        {isLoading ? (
          <Spin tip="Loading..." className="mt-10">
            <div />
          </Spin>
        ) : (
          <ArticleInfo {...data!} />
        )}
      {/* </SubscriptionGate> */}
    </Row>
  );
}
