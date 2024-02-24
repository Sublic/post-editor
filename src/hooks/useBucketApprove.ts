import BucketHub from "@/abi/BucketHub";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useIsMounted } from "./useIsMounted";
import { BUCKET_HUB_ADDRESS, FACTORY_ADDRESS } from "@/config";
import { bscTestnet } from "viem/chains";

const CREATE_ROLE =
  "0xa7a925e56b0f4627a3e4910a6e10d23a82143f84f9d73d587c9ef425941ace8e";

export function useBucketApprove() {
  const isMounted = useIsMounted();
  const { address, isConnected } = useAccount();

  const hasRoleResponse = useReadContract({
    address: BUCKET_HUB_ADDRESS,
    chainId: bscTestnet.id,
    abi: BucketHub,
    functionName: "hasRole",
    query: {
      refetchInterval: 2000,
    },
    args:
      isMounted && address
        ? [CREATE_ROLE, address, FACTORY_ADDRESS]
        : undefined,
  });

  const grantRoleMutation = useWriteContract();
  const grantRole = () => {
    grantRoleMutation.writeContract({
      address: BUCKET_HUB_ADDRESS,
      chainId: bscTestnet.id,
      abi: BucketHub,
      functionName: "grantRole",
      args: [
        CREATE_ROLE,
        FACTORY_ADDRESS,
        BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ],
    });
  };

  return {
    isRoleGranted: hasRoleResponse.data,
    roleIsLoading: hasRoleResponse.isLoading,
    roleIsError: hasRoleResponse.isError,
    roleIsSuccess: hasRoleResponse.isSuccess,
    roleError: hasRoleResponse.error,

    grantRole,
    isConnected: isConnected && isMounted,
    grantRoleIsPending: grantRoleMutation.isPending,
    grantRoleIsError: grantRoleMutation.isError,
    grantRoleIsSuccess: grantRoleMutation.isSuccess,
    grantRoleError: grantRoleMutation.error,
  };
}
