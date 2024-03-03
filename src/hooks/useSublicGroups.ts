import { getSublicGroups } from "@/client/getSublicGroups";
import { SublicGroup } from "@/client/types";
import { useQuery } from "@tanstack/react-query";
import { bscTestnet } from "viem/chains";
import { usePublicClient } from "wagmi";

export function useSublicGroups(address?: `0x${string}`) {
  const readClient = usePublicClient({ chainId: bscTestnet.id });

  return useQuery<
    Array<SublicGroup>,
    Error,
    Array<SublicGroup>,
    [string, `0x${string}` | undefined]
  >({
    queryKey: ["FETCH_SUBLIC_GROUPS", address],
    queryFn: ({ queryKey }) => {
      return getSublicGroups(queryKey[1]!, { readClient: readClient! });
    },
    enabled: Boolean(address),
  });
}
