import { FACTORY_ADDRESS } from "@/config";
import { PublicClient } from "viem";
import MediaFactoryAbi, { MediaResource } from "@/abi/MediaFactory";
import { client } from "./client";
import {
  ActionType,
  Effect,
} from "@bnb-chain/greenfield-cosmos-types/greenfield/permission/common";
import {
  AUTHORS_REQUIRED_ACTIONS,
  SUBSCRIBERS_REQUIRED_ACTIONS,
} from "./constants";

export class PermissionError extends Error {}

function allowedPolicies(
  bucketName: string,
  response: Awaited<
    ReturnType<(typeof client)["group"]["getBucketPolicyOfGroup"]>
  >
): Array<ActionType> {
  return response.policy
    ? response.policy.statements
        .filter((s) => s.effect === Effect.EFFECT_ALLOW)
        .filter((s) => s.resources.includes(`grn:o::${bucketName}/*`))
        .flatMap((s) => s.actions)
    : [];
}

export async function checkMediaPermissions(
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

  if (!bucket.bucketInfo) {
    throw new PermissionError(`Bucket with id ${media.bucketId} not found`);
  }

  try {
    const authorsPermissions = allowedPolicies(
      bucket.bucketInfo.bucketName,
      await client.group.getBucketPolicyOfGroup(
        bucket.bucketInfo.bucketName,
        media.authorsGroupId
      )
    );

    const subscriberPermissions = allowedPolicies(
      bucket.bucketInfo.bucketName,
      await client.group.getBucketPolicyOfGroup(
        bucket.bucketInfo.bucketName,
        media.subcribersGroupId
      )
    );

    if (
      !AUTHORS_REQUIRED_ACTIONS.every((a) => authorsPermissions.includes(a))
    ) {
      throw new PermissionError(`Authors permissions non set`);
    }

    if (
      !SUBSCRIBERS_REQUIRED_ACTIONS.every((a) =>
        subscriberPermissions.includes(a)
      )
    ) {
      throw new PermissionError(`Subscriber permissions non set`);
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("No such Policy")) {
      throw new PermissionError("Policies for group not found");
    }
    throw err;
  }

  return true;
}
