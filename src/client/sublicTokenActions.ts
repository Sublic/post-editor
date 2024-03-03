import { TOKEN_FACTORY_ADDRESS, SWAPPER_ADDRESS } from "@/config";
import SublicTokenFactory from "@/abi/SublicTokenFactory";
import Swapper from "@/abi/Swapper";
import {
  PublicClient,
  WalletClient,
  decodeEventLog,
  parseEventLogs,
} from "viem";
import { authenticate } from "./auth";
import { bscTestnet } from "viem/chains";
import { waitEvent } from "./event";

export async function createSubscriptionToken(
  name: string,
  symbol: string,
  context: {
    user: `0x${string}`;
    viemClient: WalletClient;
    readClient: PublicClient;
    window: Pick<Window, "localStorage" | "location">;
  }
): Promise<[`0x${string}`, `0x${string}`]> {

  const seed = await authenticate(
    context.user,
    context.viemClient,
    context.window.localStorage,
    ""
  );

  const txResuponse = await context.viemClient.writeContract({
    address: TOKEN_FACTORY_ADDRESS,
    chain: bscTestnet,
    account: context.user,
    abi: SublicTokenFactory,
    functionName: "createSubscriptionToken",
    args: [
      name,
      symbol
    ]
  });

  const receipt = await context.readClient.waitForTransactionReceipt({
    hash: txResuponse,
  });

  const initiatedLog = parseEventLogs({
    abi: SublicTokenFactory,
    eventName: ["NewSubscriptionTokenCreated"],
    logs: receipt.logs,
  })[0];

  const eventArgs = decodeEventLog({
    abi: SublicTokenFactory,
    ...initiatedLog,
  }).args

  const tokenAddress = eventArgs.token;
  const poolAddress = eventArgs.pool;

  await waitEvent(
    context.readClient,
    {
      address: TOKEN_FACTORY_ADDRESS,
      abi: SublicTokenFactory,
      eventName: "NewSubscriptionTokenCreated",
      args: { token: tokenAddress,
              pool: poolAddress },
    },
    60000 * 5
  );

  return [tokenAddress, poolAddress];
}

export async function swapUSDCForToken(
  amountUSDC: bigint,
  token: `0x${string}`,
  context: {
    user: `0x${string}`;
    viemClient: WalletClient;
    readClient: PublicClient;
    window: Pick<Window, "localStorage" | "location">;
  }
): Promise<Boolean> {

  const seed = await authenticate(
    context.user,
    context.viemClient,
    context.window.localStorage,
    ""
  );

  const txResuponse = await context.viemClient.writeContract({
    address: SWAPPER_ADDRESS,
    chain: bscTestnet,
    account: context.user,
    abi: Swapper,
    functionName: "swapExactInputMultihop",
    args: [
      amountUSDC,
      token
    ]
  });

  const receipt = await context.readClient.waitForTransactionReceipt({
    hash: txResuponse,
  });

  return receipt.status == 'success';
}
