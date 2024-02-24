import { useMediaPermissionsCheck } from "@/hooks/useResourcePermissionsCheck";
import { Button, Row, Space, Spin, Typography } from "antd";
import { PropsWithChildren } from "react";

export function CheckPermissions({
  children,
  mediaId,
}: PropsWithChildren<{ mediaId: `0x${string}` }>) {
  const { isSuccess, isLoading, permissionErrorMessage } =
    useMediaPermissionsCheck(mediaId);

  if (isSuccess && !permissionErrorMessage) {
    return children;
  }

  return (
    <Row justify="center" className="mt-10">
      <Space direction="vertical" className="w-full">
        {isLoading && (
          <Spin size="large" tip="Checking permissions...">
            <div />
          </Spin>
        )}
        {permissionErrorMessage && (
          <>
            <Typography.Text type="warning" strong>
              Media resource init error: {permissionErrorMessage}
            </Typography.Text>
            <Button type="link" href={`/setup/${mediaId}`}>
              Fix
            </Button>
          </>
        )}
      </Space>
    </Row>
  );
}
