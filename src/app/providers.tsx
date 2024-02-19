"use client";

import { Web3Provider } from "@/providers/connectkit";
import { Theme } from "@/providers/theme";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <Theme>
      <Web3Provider>{children}</Web3Provider>
    </Theme>
  );
}
