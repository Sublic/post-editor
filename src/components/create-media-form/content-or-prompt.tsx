"use client";

import { PropsWithChildren } from "react";
import { useAccount } from "../../hooks/useAccount";
import { ConnectPropmt } from "./connect-prompt";

export function ContentOrPrompt({ children }: PropsWithChildren) {
  const { isConnected } = useAccount();
  return isConnected ? children : <ConnectPropmt />;
}
