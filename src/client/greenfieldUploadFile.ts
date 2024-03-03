import { client } from "./client";
import {
  PublicClient,
  WalletClient,
} from "viem";
import * as FileHandle from "@bnb-chain/greenfiled-file-handle";
import { authenticate } from "./auth";

export async function uploadFile(
  objectName: string,
  bucketName: string,
  file: File,
  context: {
    user: `0x${string}`;
    viemClient: WalletClient;
    readClient: PublicClient;
    window: Pick<Window, "localStorage" | "location">;
  }
): Promise<void> {
  const seed = await authenticate(
    context.user,
    context.viemClient,
    context.window.localStorage,
    ""
  );
  const data = new Uint8Array(await file.arrayBuffer());
  const dataSizeInMegabytes = Math.ceil(data.length / (1024 * 1024));
  console.log('dataSizeInMegabytes', dataSizeInMegabytes, data, FileHandle);
  const hashResult = await FileHandle.getCheckSums(
      data,
      dataSizeInMegabytes * 1024 * 1024, // 16 * 1024 * 1024
      4,
      2
  );

  const { contentLength, expectCheckSums } = hashResult;

  console.log('offChainData', seed);
  console.log('hashResult ', hashResult);
  console.log('Calculated object hash. Creating transaction...');
  console.log('File will be created as: ' + objectName);
  const createObjectTx = await client.object.createObject(
      {
          bucketName: bucketName,
          objectName: objectName,
          creator: context.user,
          visibility: "VISIBILITY_TYPE_PRIVATE",
          fileType: "",
          redundancyType: 'REDUNDANCY_EC_TYPE',
          contentLength,
          expectCheckSums: JSON.parse(expectCheckSums),
      },
      {
          type: 'EDDSA',
          domain: window.location.origin,
          seed: seed,
          address: context.user,
      },
  );

  const simulateInfo = await createObjectTx.simulate({
      denom: 'BNB',
  })
      .catch(error => {
          console.log('Transaction is likely to fail: ' + error.message);
      });

  console.log('simulateInfo', simulateInfo);

  const res = await createObjectTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(simulateInfo?.gasLimit),
      gasPrice: simulateInfo?.gasPrice || '5000000000',
      payer: context.user,
      granter: '',
  });

  console.log('Object transaction created. Uploading...');
  let uploadRes = await client.object.uploadObject(
      {
          bucketName: bucketName,
          objectName: objectName,
          body: file,
          txnHash: res.transactionHash,
      },
      {
          type: 'EDDSA',
          domain: window.location.origin,
          seed: seed,
          address: context.user,
      },
  );
  console.log('uploadRes', uploadRes);
}
