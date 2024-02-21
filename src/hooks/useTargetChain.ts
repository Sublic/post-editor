import { useAccount, useSwitchChain } from "wagmi";

export function useTargetChain(targetChainId: number): [boolean, () => void] {
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  return [
    chainId === targetChainId,
    () => {
      switchChain({ chainId: targetChainId });
    },
  ];
}
