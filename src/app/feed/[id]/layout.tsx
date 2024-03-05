"use client";
import { SubscriptionGate } from "@/components/subscription-gate";

export default function FeedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: `0x${string}` };
}>) {
  return <SubscriptionGate mediaId={params.id}>{children}</SubscriptionGate>;
}
