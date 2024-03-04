"use client";
import { client, selectSp } from "@/client/client";
import { useEffect, useState } from "react";
import { ArticleList, ArticlePreview } from "@/components/feed";
import { getBucketFromMediaId } from "@/client/getBucketFromMediaId";
import { authenticate } from "@/client/auth";

export function useGreenfieldLoadArticles(mediaId: string, address: string, walletClient: any, readClient: any, bscReadClient: any) {
    const [articles, setArticles] = useState([]);
    const [articlesMap, setArticlesMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
    const loadArticles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { bucketInfo } = await getBucketFromMediaId(mediaId, {
                readClient: bscReadClient,
            });

            if (!bucketInfo?.bucketName) {
                throw new Error("Failed to fetch bucket info");
            }
            const seed = await authenticate(
                address,
                walletClient,
                window.localStorage,
                ""
            );
            console.log(address, bucketInfo.bucketName, mediaId);
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
                const [uuid] = ObjectName.split('/');
                if (!articlesMap[uuid]) {
                    articlesMap[uuid] = { id: uuid, nameDescription: '', content: '' };
                }
                if (ObjectName.endsWith('name_description.txt')) {
                    let obj = await client.object.getObject({
                        bucketName: bucketName,
                        objectName: ObjectName,
                    },
                    {
                        type: 'EDDSA',
                        address,
                        domain: window.location.origin,
                        seed: seed,
                    });
                    const text = await obj.body.text();
                    const parts = text.split("\n----\n");
                    articlesMap[uuid].name = parts[0].trim();
                    articlesMap[uuid].description = parts[1].trim();
                }
                if (ObjectName.endsWith('content.md')) {
                    articlesMap[uuid].content = `${ObjectName}`;
                }
            }
            const fetchedArticles: any[] = Object.values(articlesMap).map((article: any) => {
                return {
                    id: article.id,
                    name: article.name,
                    description: article.description,
                };
            });

            setArticles(fetchedArticles);
            setArticlesMap(articlesMap);
        } catch (err) {
        setError(err.message);
        } finally {
        setIsLoading(false);
        }
    };

    if (address) {
        loadArticles();
    }
    }, [address]);
    console.log(articlesMap);
    return { articles, isLoading, error, articlesMap};

}
