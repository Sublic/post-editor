import { FACTORY_ADDRESS } from "@/config";
import { client } from "./client";
import { InitMediaRequest } from "./types";
import MediaFactoryAbi, { AdminParams } from "@/abi/MediaFactory";
import {
  PublicClient,
  WalletClient,
  decodeEventLog,
  etherUnits,
  parseEther,
  parseEventLogs,
} from "viem";
import { authenticate } from "./auth";
import { bscTestnet } from "viem/chains";
import { waitEvent } from "./event";
import {
  CreateBucketApprovalResponse,
  decodeObjectFromHexString,
  encodeToHexString,
} from "@bnb-chain/greenfield-js-sdk";

type BucketApproveMsg = {
  primary_sp_approval: {
    expired_height: string;
  };
};

export async function initMediaResource(
  request: InitMediaRequest,
  context: {
    user: `0x${string}`;
    viemClient: WalletClient;
    readClient: PublicClient;
    window: Pick<Window, "localStorage" | "location">;
  }
): Promise<`0x${string}`> {
  const { spAddress, readQuotaToCharge } = AdminParams(
    await context.readClient.readContract({
      address: FACTORY_ADDRESS,
      abi: MediaFactoryAbi,
      functionName: "params",
    })
  );

  const seed = await authenticate(
    context.user,
    context.viemClient,
    context.window.localStorage,
    spAddress
  );

  const approve = await client.bucket.getCreateBucketApproval(
    {
      bucketName: `sublic-${request.name}`,
      spInfo: {
        primarySpAddress: spAddress,
      },
      chargedReadQuota: readQuotaToCharge.toString(),
      creator: context.user,
      paymentAddress: context.user,
      visibility: "VISIBILITY_TYPE_PRIVATE",
    },
    {
      type: "EDDSA",
      address: context.user,
      domain: context.window.location.origin,
      seed,
    }
  );

  const signedMsg = decodeObjectFromHexString(
    approve.body
  ) as CreateBucketApprovalResponse;

  const txResuponse = await context.viemClient.writeContract({
    address: FACTORY_ADDRESS,
    chain: bscTestnet,
    account: context.user,
    abi: MediaFactoryAbi,
    functionName: "createMediaResource",
    args: [
      request.name,
      BigInt(signedMsg.primary_sp_approval.expired_height),
      signedMsg.primary_sp_approval.global_virtual_group_family_id,
      encodeToHexString(signedMsg.primary_sp_approval.sig),
      request.authors as Array<`0x${string}`>,
    ],
    value: parseEther("0.08"),
  });

  const receipt = await context.readClient.waitForTransactionReceipt({
    hash: txResuponse,
  });

  const initiatedLog = parseEventLogs({
    abi: MediaFactoryAbi,
    eventName: ["MediaResourceCreationInitiated"],
    logs: receipt.logs,
  })[0];

  const mediaId = decodeEventLog({
    abi: MediaFactoryAbi,
    ...initiatedLog,
  }).args.id;

  await waitEvent(
    context.readClient,
    {
      address: FACTORY_ADDRESS,
      abi: MediaFactoryAbi,
      eventName: "MediaResourceCreationCompleted",
      args: { id: mediaId },
    },
    60000
  );

  return mediaId;
}
