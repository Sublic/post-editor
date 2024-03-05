import { client } from "./client";
import { PublicClient, WalletClient } from "viem";
import * as FileHandle from "@bnb-chain/greenfiled-file-handle";
import MediaFactoryAbi from "@/abi/MediaFactory";
import { authenticate } from "./auth";
import { AdminParams } from "@/abi/MediaFactory";
import { FACTORY_ADDRESS } from "@/config";

export async function downloadFile(
  objectName: string,
  bucketName: string,
  context: {
    user: `0x${string}`;
    viemClient: WalletClient;
    readClient: PublicClient;
    window: Pick<Window, "localStorage" | "location">;
  }
): Promise<string> {
  const { spAddress } = AdminParams(
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
  const obj = await client.object.getObject(
    {
      bucketName: bucketName,
      objectName: objectName,
    },
    {
      type: "EDDSA",
      address: context.user,
      domain: window.location.origin,
      seed: seed,
    }
  );
  if (!obj.body) {
    throw new Error("Failed to get object");
  }
  const text = await obj.body.text();
  return text;
}
