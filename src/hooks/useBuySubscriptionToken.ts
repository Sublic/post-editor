import { TOKEN_FACTORY_ADDRESS } from "@/config";
import TokenFactoryAbi from "@/abi/SublicTokenFactory";
import { bscTestnet } from "viem/chains";
import { useAccount, useWriteContract } from "wagmi";
import BigNumber from "bignumber.js";
import { useQueryClient } from "@tanstack/react-query";

export function useBuySubscriptionToken(mediaId: `0x${string}`) {
  const { writeContractAsync, ...other } = useWriteContract();
  const { address } = useAccount();
  const queryClient = useQueryClient();

  return {
    ...other,
    buy: async (amount: BigNumber) => {
      return writeContractAsync({
        chainId: bscTestnet.id,
        address: TOKEN_FACTORY_ADDRESS,
        abi: TokenFactoryAbi,
        functionName: "buySubscriptionWithUSDC",
        args: [BigInt(amount.toString()), mediaId],
      }).then(() =>
        queryClient.invalidateQueries({
          queryKey: ["CHECK_MEDIA_SUBSCRIPTION", mediaId, address!],
        })
      );
    },
  };
}
