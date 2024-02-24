import {
  Abi,
  ContractEventName,
  PublicClient,
  Transport,
  WatchContractEventParameters,
} from "viem";

export function waitEvent<
  const TAbi extends Abi | readonly unknown[],
  TEventName extends ContractEventName<TAbi>,
  TStrict extends boolean | undefined = undefined
>(
  client: PublicClient,
  args: Omit<
    WatchContractEventParameters<TAbi, TEventName, TStrict, Transport>,
    "onLogs" | "onError"
  >,
  timeotMs: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    let unwatch: (() => void) | null = null;

    const timeout = setTimeout(() => {
      if (unwatch) {
        unwatch();
        reject(new Error("Wait event timeout error"));
      }
    }, timeotMs);

    unwatch = client.watchContractEvent({
      ...args,
      onLogs: () => {
        resolve();
        clearTimeout(timeout);
      },
      onError: (err) => {
        reject(err);
        clearTimeout(timeout);
      },
    });
  });
}
