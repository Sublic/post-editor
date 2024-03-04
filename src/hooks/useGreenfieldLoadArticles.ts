"use client";
import { useEffect, useState } from "react";
import { ArticleList, ArticlePreview } from "@/components/feed";
import { getBucketFromMediaId } from "@/client/getBucketFromMediaId";

export function useGreenfieldLoadArticles(mediaId: string, address: string, walletClient: any, readClient: any, bscReadClient: any) {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // console.log(mediaId, address);
    useEffect(() => {
    const loadArticles = async () => {
        setIsLoading(true);
        setError(null);
        try {
        // Replace this with your actual function to fetch articles
        // const fetchedArticles = await fetchArticlesFromStorage(address);
        // Simulating a fetch operation
        const { bucketInfo } = await getBucketFromMediaId(mediaId, {
            readClient: bscReadClient,
          });
        console.log(address, bucketInfo);
        if (!bucketInfo?.bucketName) {
            throw new Error("Failed to fetch bucket info");
        }
        
        console.log(address, bucketInfo.bucketName, mediaId);
        const fetchedArticles = await new Promise((resolve) => setTimeout(() => resolve([
        
            {
                id: "123",
                name: "Awesome article 1lll",
                description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            },
            {
                id: "456",
                name: "Awesome article 2lll",
                description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            },
            {
                id: "789",
                name: "Awesome article 3lll",
                description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            },
            {
                id: "1111",
                name: "Awesome article 4lll",
                description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            },
            {
                id: "1",
                name: "Awesome article 5lll",
                description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            },
            {
                id: "2",
                name: "Awesome article 6lll",
                description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            },
                
        ]), 1000));

        setArticles(fetchedArticles);
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
    // console.log(address);
    return { articles, isLoading, error };

}
