import { useAccount } from "@/hooks/useAccount";
import { useCheckSubscription } from "@/hooks/useCheckSubscription";
import { Space, Spin, Typography } from "antd";
import { PropsWithChildren } from "react";
import { BuyTokenForm } from "./buy-token-form";

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
    <Space className="w-full" direction="vertical">
      <Typography.Title level={2}>You need to subscribe</Typography.Title>
      <Typography.Paragraph>
        Buy some media tokens to support the project and take your subscription
      </Typography.Paragraph>
      <BuyTokenForm mediaId={mediaId} />
    </Space>
  );
}
