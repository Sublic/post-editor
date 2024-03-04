"use client";

import { ArticleList, ArticlePreview } from "@/components/feed";
import { SubscriptionGate } from "@/components/subscription-gate";
import { useCheckSubscription } from "@/hooks/useCheckSubscription";
import { Row, Space, Spin, Typography } from "antd";
import { useRouter } from "next/navigation";
import {useGreenfieldLoadArticles} from "@/hooks/useGreenfieldLoadArticles";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { GREEN_CHAIN_ID } from "@/config";
import { bscTestnet } from "viem/chains";


export default function Page({ params }: { params: { id: `0x${string}` } }) {
  const router = useRouter();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient({
    chainId: GREEN_CHAIN_ID,
  });
  const readClient = usePublicClient({
    chainId: GREEN_CHAIN_ID,
  })!;
  const bscReadClient = usePublicClient({
    chainId: bscTestnet.id,
  })!;
  const { articles, isLoading, error, articlesMap } = useGreenfieldLoadArticles(params.id, address, walletClient, readClient, bscReadClient);
  
  if (isLoading) return <Spin />;
  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;
  return (
    <Row justify="center" className="px-[20%]">
      <SubscriptionGate mediaId={params.id}>
        <ArticleList
          items={articles}
          totalCount={articles.length}
          redirect={(id) => router.push(`/feed/${params.id}/${id}/`)}
        />
      </SubscriptionGate>
    </Row>
  );
}
