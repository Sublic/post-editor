import { TOKEN_FACTORY_ADDRESS } from "@/config";
import { bscTestnet } from "viem/chains";
import { useWriteContract } from "wagmi";
import BigNumber from "bignumber.js";
import { erc20Abi } from "viem";

export function useApproveToken(tokenAddress?: `0x${string}`) {
  const { writeContract, ...other } = useWriteContract();

  return {
    ...other,
    approve: (amount: BigNumber) => {
      if (!tokenAddress) {
        throw new Error(`Invalid token address ${tokenAddress}`);
      }
      return writeContract({
        chainId: bscTestnet.id,
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [TOKEN_FACTORY_ADDRESS, BigInt(amount.toString())],
      });
    },
  };
}
