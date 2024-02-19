import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { initMediaResource } from "@/client/initMediaResource";
import { useIsMounted } from "./useIsMounted";
import { bscTestnet } from "viem/chains";

const INIT_ONCHAIN_MEDIA_RESOURCE_MUTATION_KEY = "INIT_ONCHAIN_MEDIA_RESOURCE";

type MediaResourceSpec = {
  name: string;
  authors: Array<`0x${string}`>;
};

export function useInitMediaResource(): Partial<
  UseMutationResult<unknown, Error, MediaResourceSpec>
> {
  const { data: walletClient } = useWalletClient({
    chainId: bscTestnet.id,
  });
  const readClient = usePublicClient({
    chainId: bscTestnet.id,
  });

  const isMounted = useIsMounted();

  const { isConnected, address } = useAccount();

  const result = useMutation({
    mutationKey: [INIT_ONCHAIN_MEDIA_RESOURCE_MUTATION_KEY],
    mutationFn: (args: MediaResourceSpec) =>
      initMediaResource(args, {
        user: address!,
        viemClient: walletClient!,
        readClient: readClient!,
        window,
      }),
  });

  if (isMounted && isConnected && walletClient && readClient && window) {
    return result;
  } else {
    return {};
  }
}
