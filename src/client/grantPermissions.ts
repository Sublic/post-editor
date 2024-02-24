import MediaFactoryAbi, { MediaResource } from "@/abi/MediaFactory";
import { FACTORY_ADDRESS } from "@/config";
import { PublicClient, WalletClient } from "viem";
import { client } from "./client";
import {
  Effect,
  PrincipalType,
} from "@bnb-chain/greenfield-cosmos-types/greenfield/permission/common";
import {
  AUTHORS_REQUIRED_ACTIONS,
  SUBSCRIBERS_REQUIRED_ACTIONS,
} from "./constants";
import { GRNToString, newObjectGRN } from "@bnb-chain/greenfield-js-sdk";

export async function grantPermissionsToGroups(
  mediaId: `0x${string}`,
  context: {
    readClient: PublicClient;
    wallet: WalletClient;
    user: `0x${string}`;
  }
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
    throw new Error(`Bucket with id ${media.bucketId} not found`);
  }

  const subscribersTx = await client.bucket.putBucketPolicy(
    bucket.bucketInfo.bucketName,
    {
      operator: media.owner,
      statements: [
        {
          effect: Effect.EFFECT_ALLOW,
          actions: SUBSCRIBERS_REQUIRED_ACTIONS,
          resources: [
            GRNToString(newObjectGRN(bucket.bucketInfo.bucketName, "*")),
          ],
        },
      ],
      principal: {
        type: PrincipalType.PRINCIPAL_TYPE_GNFD_GROUP,
        value: media.subcribersGroupId.toString(),
      },
    }
  );

  const authorsTx = await client.bucket.putBucketPolicy(
    bucket.bucketInfo.bucketName,
    {
      operator: media.owner,
      statements: [
        {
          effect: Effect.EFFECT_ALLOW,
          actions: AUTHORS_REQUIRED_ACTIONS,
          resources: [
            GRNToString(newObjectGRN(bucket.bucketInfo.bucketName, "*")),
          ],
        },
      ],
      principal: {
        type: PrincipalType.PRINCIPAL_TYPE_GNFD_GROUP,
        value: media.authorsGroupId.toString(),
      },
    }
  );

  const multiTx = await client.txClient.multiTx([subscribersTx, authorsTx]);

  const simulatedMultiTx = await multiTx.simulate({ denom: "BNB" });

  await multiTx.broadcast({
    gasLimit: Number(simulatedMultiTx.gasLimit),
    gasPrice: simulatedMultiTx.gasPrice,
    granter: "",
    payer: context.user,
    denom: "BNB",
    signTypedDataCallback(addr, eip712) {
      return context.wallet.request({
        method: "eth_signTypedData_v4",
        params: [addr as `0x${string}`, JSON.parse(eip712)],
      });
    },
  });
}
