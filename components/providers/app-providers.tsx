"use client";

import type { ReactNode } from "react";
import { WalletContextProvider } from "@/components/providers/wallet-context-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>;
}
