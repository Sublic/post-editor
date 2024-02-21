import {
  PermissionError,
  checkMediaPermissions,
} from "@/client/checkMediaPermissions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { bscTestnet } from "viem/chains";
import { usePublicClient } from "wagmi";

const CHECK_PERMISSION_QUERY_KEY = "CHECK_PERMISSION_QUERY_KEY";

export function useMediaPermissionsCheck(
  mediaId?: `0x${string}`,
  refetchInterval: number | undefined | false = 10000
) {
  const readClient = usePublicClient({ chainId: bscTestnet.id });

  const { error, isLoading, isSuccess } = useQuery<
    boolean,
    Error | PermissionError,
    void,
    [string, `0x${string}` | undefined]
  >({
    queryKey: [CHECK_PERMISSION_QUERY_KEY, mediaId],
    enabled: Boolean(mediaId) && Boolean(readClient),
    queryFn: ({ queryKey }) =>
      checkMediaPermissions(queryKey[1]!, { readClient: readClient! }),
    refetchInterval,
  });

  const permissionErrorMessage = useMemo(() => {
    if (error && error instanceof PermissionError) {
      return error.message;
    }
    if (isSuccess && !error) {
      return undefined;
    }
  }, [error, isSuccess]);

  return {
    isSuccess,
    permissionErrorMessage,
    isLoading,
  };
}
