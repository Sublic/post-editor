import { getSublicGroups } from "@/client/getSublicGroups";
import { useQuery } from "@tanstack/react-query";
import { bscTestnet } from "viem/chains";
import { usePublicClient } from "wagmi";

export function useCheckSubscription(
  mediaId?: `0x${string}`,
  userAddress?: `0x${string}`
) {
  const readClient = usePublicClient({ chainId: bscTestnet.id })!;
  return useQuery({
    queryKey: ["CHECK_MEDIA_SUBSCRIPTION", mediaId, userAddress],
    queryFn: async ({ queryKey }) => {
      const groups = await getSublicGroups(queryKey[2] as `0x${string}`, {
        readClient,
      });
      return groups.findIndex((group) => group.mediaId === queryKey[1]) !== -1;
    },
    enabled: Boolean(userAddress) && Boolean(mediaId),
    retryDelay: 1000,
    retry: true,
    gcTime: Infinity,
    staleTime: Infinity,
  });
}
