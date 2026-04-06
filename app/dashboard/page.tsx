import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  BookOpenText,
  Flame,
  FolderGit2,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { BreakdownBars } from "@/components/breakdown-bars";
import { PeopleSearch } from "@/components/people-search";
import { Card } from "@/components/ui/card";
import { getDisplayName, getDisplaySubtitle, shortIdentity } from "@/lib/identity";
import { getProfile } from "@/lib/repository";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();
  const profile = await getProfile(userId);
  const proofUploads = profile.activities.filter((item) => item.proofIpfs).length;
  const activeDays = new Set(profile.activities.map((item) => item.createdAt.slice(0, 10))).size;
  const averageScore = profile.activities.length > 0 ? Math.round(profile.totalScore / profile.activities.length) : 0;
  const bestSignal =
    profile.breakdown.slice().sort((a, b) => b.totalScore - a.totalScore)[0]?.type ?? "No activity yet";
  const proofCoverage = profile.activities.length > 0 ? Math.round((proofUploads / profile.activities.length) * 100) : 0;
  const heatmapStats = [
    { label: "Entries", value: `${profile.activities.length}`, hint: "Total work logs recorded." },
    { label: "Active days", value: `${activeDays}`, hint: "Days with at least one contribution." },
    { label: "Best focus", value: bestSignal, hint: "Activity type with the highest score.", capitalize: true },
  ];

  const stats = [
    {
      label: "Total score",
      value: `${profile.totalScore}`,
      hint: "Accumulated from verified work entries.",
      icon: ArrowUpRight,
    },
    {
      label: "Current streak",
      value: `${profile.streak} days`,
      hint: "Consecutive active days in your log.",
      icon: Flame,
    },
    {
      label: "Entries",
      value: `${profile.activities.length}`,
      hint: "Tracked submissions attached to your account.",
      icon: FolderGit2,
    },
    {
      label: "Proof uploads",
      value: `${proofUploads}`,
      hint: "Entries with evidence attached.",
      icon: Upload,
    },
  ];
  const heroMetrics = [
    {
      label: "Total score",
      value: `${profile.totalScore}`,
      hint: "Weighted output",
      icon: ArrowUpRight,
    },
    {
      label: "Proof coverage",
      value: `${proofCoverage}%`,
      hint: "Evidence attached",
      icon: Upload,
    },
    {
      label: "Best focus",
      value: bestSignal,
      hint: "Top-scoring lane",
      icon: Target,
      capitalize: true,
    },
  ];
  const pulseBars = [
    { label: "Consistency", value: Math.max(profile.activities.length > 0 ? 18 : 8, Math.min(100, profile.streak * 16)) },
    { label: "Proof", value: Math.max(profile.activities.length > 0 ? 24 : 10, proofCoverage) },
    { label: "Volume", value: Math.max(profile.activities.length > 0 ? 20 : 9, Math.min(100, profile.activities.length * 9)) },
  ];
  const momentumMessage =
    profile.activities.length === 0
      ? "The surface is ready. Log the first focused entry and let the dashboard start building its own rhythm."
      : profile.streak > 0
        ? "Your streak is active. Keep shipping with proof so the graph, score, and profile trail all strengthen together."
        : "You already have signal in the system. One more clean entry will wake the streak back up.";

  return (
    <div className="space-y-6 pb-2">
      <section className="grid gap-5 xl:grid-cols-12">
        <Card className="relative overflow-hidden border-none bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_26%),linear-gradient(145deg,#0f172a,#111827_42%,#1e293b)] p-0 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] xl:col-span-8">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_26%,transparent)]" />
          <div className="dashboard-glow-a absolute -left-12 top-10 h-48 w-48 rounded-full bg-sky-400/12 blur-3xl" />
          <div className="dashboard-glow-b absolute -right-8 bottom-4 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative grid gap-8 p-7 lg:grid-cols-[minmax(0,1.18fr)_340px] xl:p-8">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-100">
                <Sparkles className="h-3.5 w-3.5 text-sky-300" />
                Command center
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">{getDisplayName(user)}</h1>
                  <p className="mt-3 text-sm text-slate-300">
                    {getDisplaySubtitle(user)} | {shortIdentity(userId)}
                  </p>
                </div>

                <p className="max-w-2xl text-sm leading-8 text-slate-300 md:text-[15px]">
                  A calmer working surface for tracking output, reading contribution rhythm, and keeping your history readable without the dashboard feeling overloaded.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {heroMetrics.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                        <Icon className="h-3.5 w-3.5 text-sky-300" />
                        {item.label}
                      </div>
                      <p className={`mt-4 text-2xl font-semibold text-white ${item.capitalize ? "capitalize" : ""}`}>{item.value}</p>
                      <p className="mt-2 text-sm text-slate-400">{item.hint}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Workspace read</p>
                    <p className="mt-3 text-base leading-8 text-slate-200">{momentumMessage}</p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-slate-100">
                    <Flame className="h-4 w-4 text-amber-300" />
                    {profile.streak} day streak
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-panel-float rounded-[30px] border border-white/12 bg-white/[0.08] p-5 backdrop-blur">
              <div className="flex items-center gap-4">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={getDisplayName(user)}
                    width={72}
                    height={72}
                    className="rounded-[20px] border border-white/15 object-cover shadow-[0_10px_24px_rgba(15,23,42,0.22)]"
                  />
                ) : (
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-white/15 bg-white/10 text-2xl font-semibold text-white">
                    {getDisplayName(user).slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Profile surface</p>
                  <p className="mt-2 truncate text-xl font-semibold text-white">{getDisplayName(user)}</p>
                  <p className="mt-1 truncate text-sm text-slate-300">{getDisplaySubtitle(user)}</p>
                </div>
              </div>

              <div className="mt-5 h-px bg-white/10" />

              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Momentum</p>
                    <div className="mt-3 flex items-end gap-2">
                      <p className="text-5xl font-semibold tracking-tight text-white">{profile.streak}</p>
                      <p className="pb-2 text-sm text-slate-300">days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Average</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{averageScore}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Active days</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{activeDays}</p>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Entries</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{profile.activities.length}</p>
                </div>
              </div>

              <div className="mt-3 rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">Signal mix</p>
                <div className="mt-4 space-y-4">
                  {pulseBars.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/8">
                        <div className="pulse-line h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 xl:col-span-4">
          <PeopleSearch className="h-full" title="People search" description="Jump to another member profile by name, username, or email." />

          <Card className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Operating summary</p>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">Quick read</h2>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-border bg-background px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Proof coverage</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{proofCoverage}%</p>
                <p className="mt-2 text-sm text-muted-foreground">Entries that already include supporting proof.</p>
              </div>
              <div className="rounded-2xl border border-border bg-background px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Output pattern</p>
                <p className="mt-2 text-base font-semibold text-foreground">Quiet, structured, reviewable</p>
                <p className="mt-2 text-sm text-muted-foreground">The layout keeps the dashboard readable even when the dataset is still small.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label} className="rounded-[28px] border-none bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                  <p className="mt-4 text-4xl font-semibold tracking-tight text-foreground">{item.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.hint}</p>
            </Card>
          );
        })}
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-12">
        <Card className="min-w-0 space-y-6 overflow-hidden rounded-[30px] border-none bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] xl:col-span-8">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contribution activity</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">A denser and more balanced activity map</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                The heatmap is now treated like a primary artifact, not an afterthought, so the section reads more like a product dashboard and less like a placeholder card.
              </p>
            </div>
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
              Last 20 weeks
            </div>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="grid gap-3">
              {heatmapStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-background px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                  <p className={`mt-3 text-2xl font-semibold text-foreground ${item.capitalize ? "capitalize" : ""}`}>{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.hint}</p>
                </div>
              ))}
            </div>

            <div className="min-w-0 rounded-[28px] border border-border bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <ActivityHeatmap activities={profile.activities} />
            </div>
          </div>
        </Card>

        <Card className="min-w-0 space-y-6 rounded-[30px] border-none bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] xl:col-span-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Focus areas</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Where your time is going</h2>
          </div>

          <BreakdownBars breakdown={profile.breakdown} />

          <div className="rounded-[26px] border border-border bg-background px-4 py-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BookOpenText className="h-4 w-4 text-muted-foreground" />
              Scoring model
            </div>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <p>Coding = 1.0</p>
              <p>Learning = 0.7</p>
              <p>Watching = 0.4</p>
              <p>Streak bonus = +10% per day, capped at +50%</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-12">
        <Card className="space-y-4 rounded-[30px] border-none bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] xl:col-span-7">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recent activity</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Latest submissions and proof records</h2>
          </div>
          <ActivityFeed activities={profile.activities.slice(0, 8)} />
        </Card>

        <div className="grid gap-5 xl:col-span-5">
          <Card className="overflow-hidden rounded-[30px] border-none bg-[linear-gradient(150deg,#0f172a,#172554)] text-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
            <div className="space-y-5 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Snapshot</p>
              <h2 className="text-3xl font-semibold tracking-tight">A professional dashboard should feel calm before it feels busy.</h2>
              <p className="text-sm leading-8 text-slate-300">
                This version emphasizes hierarchy, symmetry, and breathing room so the page remains useful whether you have zero entries or a long activity history.
              </p>
            </div>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <Card className="rounded-[28px] border-none bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Proof coverage</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{proofCoverage}%</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">How many entries include supporting evidence today.</p>
            </Card>

            <Card className="rounded-[28px] border-none bg-white/90 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Best focus</p>
              <p className="mt-3 text-3xl font-semibold capitalize text-foreground">{bestSignal}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">The lane contributing the highest score right now.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
