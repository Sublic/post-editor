import { useAccount } from "@/hooks/useAccount";
import { useCheckSubscription } from "@/hooks/useCheckSubscription";
import { Space, Spin, Typography } from "antd";
import { PropsWithChildren } from "react";

interface SubscriptionGateProps {
  mediaId: `0x${string}`;
}

export function SubscriptionGate({
  mediaId,
  children,
}: PropsWithChildren<SubscriptionGateProps>) {
  const { address } = useAccount();
  const {
    data: isSubscribed,
    isLoading,
    isSuccess,
  } = useCheckSubscription(mediaId, address);
  return isLoading || !isSuccess ? (
    <Space>
      <Spin />{" "}
      <Typography.Text strong>Checking your subscription</Typography.Text>
    </Space>
  ) : isSuccess && isSubscribed ? (
    children
  ) : (
    <Typography.Title level={2}>You need to subscribe</Typography.Title> // Add buy form
  );
}
