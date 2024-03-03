"use client";

import { Button, Card, Image, Space, Typography } from "antd";
import { ChangeEvent, useCallback, useRef } from "react";
import { client } from "@/client/client";
import { authenticate } from "@/client/auth";
import { uploadFile } from "@/client/greenfieldUploadFile";
import { v4 as uuidv4 } from "uuid";
import { getBucketFromMediaId } from "@/client/getBucketFromMediaId";
import { PublicClient, WalletClient } from "viem";

interface PublishToGreenfieldParams {
  title: string;
  brief: string;
  markdown: string;
  images: Array<ValuesItem>; // Assuming ValuesItem is correctly defined elsewhere
  mediaId: `0x${string}`;
  address?: `0x${string}` | undefined;
  readClient: PublicClient;
  bscReadClient: PublicClient;
  walletClient: WalletClient;
}

type ValuesItem = { file?: File; url: string };

export async function publishToGreenfield({
  title,
  brief,
  markdown,
  images,
  mediaId,
  address,
  readClient,
  bscReadClient,
  walletClient,
}: PublishToGreenfieldParams) {
  try {
    const { bucketInfo } = await getBucketFromMediaId(mediaId, {
      readClient: bscReadClient,
    });

    if (!bucketInfo?.bucketName) {
      throw new Error("Failed to fetch bucket info");
    }

    const dirName = uuidv4();
    const textContent = `${title}\n\n----\n\n${brief}`;
    // Convert text content to a Blob
    const textBlob = new Blob([textContent], {
      type: "text/plain;charset=utf-8",
    });
    const textFileName = `${dirName}/name_description.txt`;
    const textFile = new File([textBlob], "name_description.txt", {
      type: "text/plain;charset=utf-8",
    });

    // Convert markdown content to a Blob
    const markdownBlob = new Blob([markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const markdownFileName = `${dirName}/content.md`;
    const markdownFile = new File([markdownBlob], "content.md", {
      type: "text/markdown;charset=utf-8",
    });
    if (!address) {
      throw new Error("Address is required");
    }
    // Upload text file
    await uploadFile(textFileName, bucketInfo.bucketName, textFile, {
      user: address,
      viemClient: walletClient,
      readClient,
      window,
    });

    // Upload markdown file
    await uploadFile(markdownFileName, bucketInfo.bucketName, markdownFile, {
      user: address,
      viemClient: walletClient,
      readClient,
      window,
    });

    // Upload images deprecated because images are inserted into markdown
    // for (const image of images) {
    //     if (!image.file) {
    //         continue; // Skip images without a file
    //     }
    //     const imageName = image.file.name; // Ensure this gets a valid name from your `image` object
    //     const imagePath = `${dirName}/images/${imageName}`;
    //     await uploadFile(imagePath, bucket, image.file, { user: address, viemClient: walletClient, readClient, window });
    // }

    console.log("Article published successfully");
  } catch (error) {
    // Handle errors
    console.error("Error publishing article:", error);
  }
}
