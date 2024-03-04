import { SWAPPER_ADDRESS } from "@/config";
import SwapperAbi from "@/abi/Swapper";
import { bscTestnet } from "viem/chains";
import { useWriteContract } from "wagmi";
import BigNumber from "bignumber.js";

export function useBuyToken(tokenAddress?: `0x${string}`) {
  const { writeContract, ...other } = useWriteContract();

  return {
    ...other,
    buy: (amount: BigNumber) => {
      if (!tokenAddress) {
        throw new Error(`Invalid token address ${tokenAddress}`);
      }
      return writeContract({
        chainId: bscTestnet.id,
        address: SWAPPER_ADDRESS,
        abi: SwapperAbi,
        functionName: "swapExactInputMultihop",
        args: [BigInt(amount.toString()), tokenAddress],
      });
    },
  };
}
