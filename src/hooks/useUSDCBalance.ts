import { TOKEN_FACTORY_ADDRESS } from "@/config";
import SublicTokenFactoryAbi from "@/abi/SublicTokenFactory";
import { bscTestnet } from "viem/chains";
import { useBalance, useReadContract } from "wagmi";
import { erc20Abi } from "viem";

export function useUSDCBalance(address?: `0x${string}`) {
  const { data: usdcAddress } = useReadContract({
    chainId: bscTestnet.id,
    address: TOKEN_FACTORY_ADDRESS,
    abi: SublicTokenFactoryAbi,
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
    args: address ? [address, TOKEN_FACTORY_ADDRESS] : undefined,
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
