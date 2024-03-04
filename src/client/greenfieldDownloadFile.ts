import { client } from "./client";
import {
  WalletClient,
} from "viem";
import * as FileHandle from "@bnb-chain/greenfiled-file-handle";
import { authenticate } from "./auth";

export async function downloadFile(
  objectName: string,
  bucketName: string,
  context: {
    user: `0x${string}`;
    viemClient: WalletClient;
    window: Pick<Window, "localStorage" | "location">;
  }
): Promise<string> {
    const seed = await authenticate(
    context.user,
    context.viemClient,
    context.window.localStorage,
    ""
    );
    const obj = await client.object.getObject({
        bucketName: bucketName,
        objectName: objectName,
    },
    {
        type: 'EDDSA',
        address: context.user,
        domain: window.location.origin,
        seed: seed,
    });
    if (!obj.body) {
        throw new Error("Failed to get object");
    }
    const text = await obj.body.text();
    return text;
}
