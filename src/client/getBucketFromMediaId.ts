import { PublicClient } from "viem";
import MediaFactoryAbi, { MediaResource } from "@/abi/MediaFactory";
import { FACTORY_ADDRESS } from "@/config";
import { client } from "./client";

export async function getBucketFromMediaId(
  mediaId: `0x${string}`,
  context: { readClient: PublicClient }
) {
  const media = MediaResource(
    await context.readClient.readContract({
      address: FACTORY_ADDRESS,
      abi: MediaFactoryAbi,
      functionName: "resources",
      args: [mediaId],
    })
  );

  const bucket = await client.bucket.headBucketById(media.bucketId.toString());

  return bucket;
}
