"use client";
import { client, selectSp } from "@/client/client";
import { useEffect, useState } from "react";
import { ArticleList, ArticlePreview } from "@/components/feed";
import { getBucketFromMediaId } from "@/client/getBucketFromMediaId";
import { downloadFile } from "@/client/greenfieldDownloadFile";
import { PublicClient, WalletClient } from "viem";

interface ArticleMapEntry {
  id: string;
  name: string;
  description: string;
  content: string;
}
type ArticlesMap = { [key: string]: ArticleMapEntry };

export function useGreenfieldLoadArticles(
  mediaId: `0x${string}`,
  address: `0x${string}` | undefined,
  walletClient?: WalletClient,
  bscReadClient?: PublicClient
) {
  const [articles, setArticles] = useState<Array<ArticlePreview>>([]);
  const [articlesMap, setArticlesMap] = useState<ArticlesMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!walletClient || !bscReadClient) {
      return;
    }
    const loadArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!address) {
          throw new Error("Address is not provided");
        }
        const { bucketInfo } = await getBucketFromMediaId(mediaId, {
          readClient: bscReadClient,
        });

        if (!bucketInfo?.bucketName) {
          throw new Error("Failed to fetch bucket info");
        }

        let bucketName = bucketInfo.bucketName;
        const spInfo = await selectSp();

        let res = await client.object.listObjects({
          bucketName,
          endpoint: spInfo.endpoint,
        });
        if (!res.body) {
          throw new Error("Failed to get objects");
        }
        let rawObjects = res.body.GfSpListObjectsByBucketNameResponse.Objects;

        for (const obj of rawObjects) {
          const { ObjectName, BucketName } = obj.ObjectInfo;
          const [uuid] = ObjectName.split("/");
          if (!articlesMap[uuid]) {
            articlesMap[uuid] = {
              id: uuid,
              name: "",
              content: "",
              description: "",
            };
          }
          if (ObjectName.endsWith("name_description.txt")) {
            let obj = await downloadFile(ObjectName, bucketName, {
              user: address,
              viemClient: walletClient,
              window,
              readClient: bscReadClient,
            });
            const parts = obj.split("\n----\n");
            articlesMap[uuid].name = parts[0].trim();
            articlesMap[uuid].description = parts[1].trim();
          }
          if (ObjectName.endsWith("content.md")) {
            articlesMap[uuid].content = `${ObjectName}`;
          }
        }
        const fetchedArticles: Array<ArticlePreview> = Object.values(
          articlesMap
        ).map((article: ArticlePreview) => {
          return {
            id: article.id,
            name: article.name,
            description: article.description,
          };
        });

        setArticles(fetchedArticles);
        setArticlesMap(articlesMap);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      loadArticles();
    }
  }, [mediaId, address, walletClient, bscReadClient]);
  return { articles, isLoading, error, articlesMap };
}
