import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/shell/site-header";

export const metadata: Metadata = {
  title: "Skilltree",
  description: "A lightweight growth journal with a GitHub-inspired dashboard and Clerk authentication.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <AppProviders>
            <SiteHeader />
            <main className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</main>
          </AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
