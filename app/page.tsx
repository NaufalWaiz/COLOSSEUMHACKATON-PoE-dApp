import Link from "next/link";
import { ArrowRight, Blocks, FileCheck2, ShieldCheck, Sparkles } from "lucide-react";
import { OverviewStat } from "@/components/overview-stat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const pillars = [
  {
    title: "Proof, not polish",
    description: "Log real work with proof files, descriptions, and timestamps instead of static CV bullets.",
    icon: FileCheck2,
  },
  {
    title: "Rule-based scoring",
    description: "Duration, activity weight, and consistency streak produce a transparent score you can audit.",
    icon: Sparkles,
  },
  {
    title: "Verifiable record",
    description: "Each effort item creates a deterministic hash plus a chain reference ready for Solana storage.",
    icon: Blocks,
  },
  {
    title: "Portable reputation",
    description: "A wallet-native profile makes effort portable across communities, teams, and future products.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <Badge>Hackathon MVP</Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
              Reputation that tracks <span className="text-primary">effort</span>, not just outcomes.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Proof of Effort records activity, computes a transparent score, stores the proof trail, and builds a wallet-native profile on top of Solana.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button className="px-6 py-3 text-base">
                Open dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="outline" className="px-6 py-3 text-base">
                Submit effort
              </Button>
            </Link>
          </div>
        </div>

        <Card className="relative overflow-hidden border-white/15 bg-white/5 p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.15),transparent_28%)]" />
          <div className="relative space-y-6">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">System architecture</p>
            <div className="grid gap-4">
              {[
                "Frontend / Next.js App Router",
                "API / Route Handlers + session verification",
                "Storage / Local mock for Supabase + IPFS",
                "Blockchain / Solana-ready record adapter",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <OverviewStat label="Transparent scoring" value="3x" detail="Activity weights for coding, learning, and watching." />
        <OverviewStat label="Storage trail" value="IPFS" detail="Proof hashes are tracked as immutable references." />
        <OverviewStat label="Verification" value="Wallet" detail="Authentication uses wallet connect plus signed message." />
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Core pillars"
          title="Built for measurable work, not vanity metrics"
          description="The MVP focuses on a thin but coherent loop: authenticate, submit effort, calculate score, persist evidence, and expose a public profile."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card key={pillar.title} className="bg-white/5">
                <div className="mb-5 inline-flex rounded-2xl bg-primary/15 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
