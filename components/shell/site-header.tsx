"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Flame, Layers3, Trophy } from "lucide-react";
import { WalletAuthButton } from "@/components/wallet-auth-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/submit", label: "Submit", icon: Layers3 },
  { href: "/profile", label: "Profile", icon: Flame },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 text-foreground no-underline">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-300 text-sm font-black text-slate-950">
              PoE
            </div>
            <div>
              <p className="text-lg font-semibold">Proof of Effort</p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Web3 Reputation Rail</p>
            </div>
          </Link>
          <Badge>Solana Devnet MVP</Badge>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/10 hover:text-foreground",
                  active && "bg-white/10 text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <WalletAuthButton />
      </div>
    </header>
  );
}
