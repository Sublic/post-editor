import { useMediaPermissionsCheck } from "@/hooks/useResourcePermissionsCheck";
import { Stages } from "./types";
import { App, Button, Spin } from "antd";
import { useGrantResourcePermissions } from "@/hooks/useGrantResourcePermissions";
import { useEffect } from "react";

interface GreenfieldStepProps {
  setIsLoading(v: boolean): void;
  nextStage(step: Stages): void;
  mediaId: `0x${string}`;
}

export function GreenfieldStep({
  setIsLoading,
  nextStage,
  mediaId,
}: GreenfieldStepProps) {
  const { isLoading, isSuccess, permissionErrorMessage } =
    useMediaPermissionsCheck(mediaId, false);

  const { notification } = App.useApp();

  const {
    mutate,
    isPending,
    isSuccess: isMutationSuccess,
    error,
  } = useGrantResourcePermissions(mediaId);

  useEffect(() => {
    if (isMutationSuccess) {
      notification.success({ message: "Policies created" });
    }
  }, [isMutationSuccess, notification]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Policies creation error",
        description: String(error),
      });
    }
  }, [error, notification]);

  setIsLoading(isPending || false);

  if ((isSuccess && !permissionErrorMessage) || isMutationSuccess) {
    nextStage("done");
  }

  if (isLoading) {
    return (
      <Spin size="large" tip="Checking permissions..." className="mt-10">
        <div />
      </Spin>
    );
  }

  return (
    <Button type="primary" onClick={() => mutate && mutate()}>
      Grant permissions
    </Button>
  );
}
