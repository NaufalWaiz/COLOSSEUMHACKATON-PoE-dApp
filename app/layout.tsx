import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/shell/site-header";

export const metadata: Metadata = {
  title: "Proof of Effort",
  description: "Web3 reputation system that records transparent effort on Solana.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <SiteHeader />
          <main className="mx-auto min-h-[calc(100vh-88px)] max-w-7xl px-4 py-8 md:px-6 md:py-12">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
