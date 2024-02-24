import { GREEN_CHAIN_ID, GRPC_URL } from "@/config";
import { Client } from "@bnb-chain/greenfield-js-sdk";

export const client = Client.create(GRPC_URL, String(GREEN_CHAIN_ID), {
  zkCryptoUrl:
    "https://unpkg.com/@bnb-chain/greenfield-zk-crypto@0.0.3/dist/node/zk-crypto.wasm",
});
