import { TOKEN_FACTORY_ADDRESS } from "@/config";
import TokenFactoryAbi from "@/abi/SublicTokenFactory";
import { bscTestnet } from "viem/chains";
import { useWriteContract } from "wagmi";
import BigNumber from "bignumber.js";

export function useBuySubscriptionToken(mediaId: `0x${string}`) {
  const { writeContract, ...other } = useWriteContract();

  return {
    ...other,
    buy: (amount: BigNumber) => {
      return writeContract({
        chainId: bscTestnet.id,
        address: TOKEN_FACTORY_ADDRESS,
        abi: TokenFactoryAbi,
        functionName: "buySubscriptionWithUSDC",
        args: [BigInt(amount.toString()), mediaId],
      });
    },
  };
}
