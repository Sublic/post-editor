import { useIsMounted } from "./useIsMounted";
import { UseAccountReturnType, useAccount as useWagmiAccount } from "wagmi";

export function useAccount(): Partial<UseAccountReturnType> {
  const isMounted = useIsMounted();
  const response = useWagmiAccount();

  if (isMounted) {
    return response;
  } else {
    return {};
  }
}
