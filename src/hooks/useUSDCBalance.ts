import { SWAPPER_ADDRESS } from "@/config";
import SwapperAbi from "@/abi/Swapper";
import { bscTestnet } from "viem/chains";
import { useBalance, useReadContract } from "wagmi";
import { erc20Abi } from "viem";

export function useUSDCBalance(address?: `0x${string}`) {
  const { data: usdcAddress } = useReadContract({
    chainId: bscTestnet.id,
    address: SWAPPER_ADDRESS,
    abi: SwapperAbi,
    functionName: "USDC",
  });

  const { data: usdc, ...other } = useBalance({
    chainId: bscTestnet.id,
    address,
    token: usdcAddress,
    query: {
      refetchInterval: 2000,
    },
  });

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: usdcAddress,
    chainId: bscTestnet.id,
    functionName: "allowance",
    args: address ? [address, SWAPPER_ADDRESS] : undefined,
    query: {
      refetchInterval: 2000,
    },
  });

  return {
    ...other,
    ...usdc,
    allowance,
    usdcAddress,
  };
}
