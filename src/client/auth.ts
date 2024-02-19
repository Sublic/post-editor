import { Client } from "viem";
import { client } from "./client";
import { GREEN_CHAIN_ID } from "@/config";
import {
  IReturnOffChainAuthKeyPairAndUpload,
  SpResponse,
} from "@bnb-chain/greenfield-js-sdk";

const STORAGE_AUTH_KEY = "OFFCHAIN_GREENFIELD_SP_AUTH";

type PersistedAuthData = Record<string, { seed: string; expiration: number }>;

const getAllSps = async () => {
  const sps = await client.sp.getStorageProviders();

  return sps.map((sp) => {
    return {
      address: sp.operatorAddress,
      endpoint: sp.endpoint,
      name: sp.description?.moniker,
    };
  });
};

export async function authenticate(
  address: string,
  provider: Client,
  storage: Storage,
  operatorAddress: string
) {
  if (storage.getItem(STORAGE_AUTH_KEY) != null) {
    const persisted: PersistedAuthData = JSON.parse(
      storage.getItem(STORAGE_AUTH_KEY)!
    );

    if (persisted[address].expiration > Date.now()) {
      return persisted[address].seed;
    }
  }
  const allSps = await getAllSps();
  const offchainAuthRes =
    await client.offchainauth.genOffChainAuthKeyPairAndUpload(
      {
        sps: allSps.filter(
          (sp) => sp.address.toLowerCase() === operatorAddress.toLowerCase()
        ),
        chainId: GREEN_CHAIN_ID,
        expirationMs: 5 * 24 * 60 * 60 * 1000,
        domain: window.location.origin,
        address,
      },
      provider
    );

  if (
    offchainAuthRes.code !== 0 ||
    !offchainAuthRes.body?.seedString ||
    !offchainAuthRes.body.expirationTime
  ) {
    throw new Error("Offchain auth error");
  }

  const oldPersisted: PersistedAuthData =
    storage.getItem(STORAGE_AUTH_KEY) != null
      ? JSON.parse(storage.getItem(STORAGE_AUTH_KEY)!)
      : {};

  oldPersisted[address] = {
    seed: offchainAuthRes.body.seedString,
    expiration: offchainAuthRes.body.expirationTime,
  };

  storage.setItem(STORAGE_AUTH_KEY, JSON.stringify(oldPersisted));

  return offchainAuthRes.body.seedString;
}
