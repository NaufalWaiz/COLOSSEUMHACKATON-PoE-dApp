"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { BarChart3, Flame, GitCommitHorizontal, Layers3, Trophy } from "lucide-react";
import Logo from "@/LOGO.png";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/submit", label: "Submit", icon: GitCommitHorizontal },
  { href: "/profile", label: "Profile", icon: Flame },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 text-foreground no-underline">
            <div>
              <Image src={Logo} alt="Skilltree logo" className="h-full w-full object-contain" priority />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Skilltree</p>
              <p className="text-xs text-muted-foreground">Growth log for makers</p>
            </div>
          </Link>

          <SignedIn>
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
                      active && "bg-muted text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SignedIn>
        </div>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="inline-flex items-center rounded-lg border border-border bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90">
                Login
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/submit"
              className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted md:inline-flex"
            >
              <Layers3 className="h-4 w-4" />
              New entry
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
