import MediaFactoryAbi, { MediaResource } from "@/abi/MediaFactory";
import { FACTORY_ADDRESS } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { bscTestnet } from "viem/chains";
import { usePublicClient } from "wagmi";

export function useMediaTokenAddress(mediaId: `0x${string}`) {
  const readClient = usePublicClient({ chainId: bscTestnet.id });
  const { data: tokenAddress, ...other } = useQuery({
    queryKey: ["GET_MEDIA_TOKEN_ADDRESS", mediaId],
    queryFn: async ({ queryKey }) => {
      const media = MediaResource(
        await readClient!.readContract({
          address: FACTORY_ADDRESS,
          abi: MediaFactoryAbi,
          functionName: "resources",
          args: [queryKey[1] as `0x${string}`],
        })
      );

      return media.token;
    },
    enabled: Boolean(readClient),
  });
  return {
    tokenAddress,
    ...other,
  };
}
