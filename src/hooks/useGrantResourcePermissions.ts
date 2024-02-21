import { grantPermissionsToGroups } from "@/client/grantPermissions";
import { GREEN_CHAIN_ID } from "@/config";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { bscTestnet } from "viem/chains";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

const GRANT_PERMISSIONS_MUTATION_KEY = "GRANT_PERMISSIONS_MUTATION_KEY";

export function useGrantResourcePermissions(
  mediaId: `0x${string}`
): Partial<UseMutationResult<void, Error, void, unknown>> {
  const readClient = usePublicClient({ chainId: bscTestnet.id });
  const { address } = useAccount();
  const { data: wallet } = useWalletClient({ chainId: GREEN_CHAIN_ID });

  const mutationResponse = useMutation({
    mutationKey: [GRANT_PERMISSIONS_MUTATION_KEY, mediaId],
    mutationFn: () =>
      grantPermissionsToGroups(mediaId, {
        readClient: readClient!,
        wallet: wallet!,
        user: address!,
      }),
  });

  if (wallet && address) {
    return mutationResponse;
  }

  return {};
}
