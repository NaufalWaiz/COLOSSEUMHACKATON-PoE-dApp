import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Compass,
  GitBranchPlus,
  LayoutDashboard,
  Network,
  Orbit,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { TypewriterHeadline } from "@/components/typewriter-headline";

const highlights = [
  "Clerk-based sign-in",
  "GitHub-style contribution dashboard",
  "Private profile, submissions, and leaderboard",
];

const previewNav = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: GitBranchPlus, label: "New entry" },
  { icon: CheckCircle2, label: "Profile" },
];

const designMoments = [
  {
    icon: Workflow,
    title: "Log",
    description: "Capture meaningful work quickly, with enough structure to stay readable later.",
  },
  {
    icon: Target,
    title: "Read the signal",
    description: "Contribution history, streaks, and score help the product surface momentum without feeling noisy.",
  },
  {
    icon: Search,
    title: "Move across people",
    description: "Search teammates, open profiles, and keep the entire workspace connected.",
  },
];

const dynamicSignals = [
  {
    icon: ShieldCheck,
    title: "Private by default",
    description: "The public face stays clean while the real working surface lives behind authentication.",
  },
  {
    icon: BarChart3,
    title: "Signals that move",
    description: "Score, streaks, proof coverage, and contribution rhythm create a dashboard that feels responsive.",
  },
  {
    icon: Clock3,
    title: "Light enough to repeat",
    description: "The loop stays small enough to become a habit instead of another neglected tool.",
  },
];

const atlasPoints = [
  {
    icon: Compass,
    title: "A cleaner entry point",
    description: "The first screen tells a coherent story before the user ever signs in.",
  },
  {
    icon: Network,
    title: "A connected workspace",
    description: "Profiles, search, contribution rhythm, and effort history now feel like one system.",
  },
  {
    icon: Orbit,
    title: "Subtle motion, not noise",
    description: "Animation is used to guide the eye, not to compete with the content.",
  },
];

const atlasSteps = [
  {
    label: "Layer 01",
    title: "Capture real work",
    description: "Write down what changed, attach proof, and keep the log readable enough to revisit later.",
  },
  {
    label: "Layer 02",
    title: "Read momentum at a glance",
    description: "Contribution rhythm, streaks, and output shape form a dashboard that surfaces signal quickly.",
  },
  {
    label: "Layer 03",
    title: "Move through people and history",
    description: "Search teammates, inspect their profile, and keep the product feeling connected instead of fragmented.",
  },
];

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "Search people", href: "/profile" },
      { label: "Contribution rhythm", href: "/dashboard" },
      { label: "Clerk docs", href: "https://clerk.com/docs" },
    ],
  },
  {
    title: "Philosophy",
    links: [
      { label: "Quiet landing page", href: "/" },
      { label: "Private working surface", href: "/dashboard" },
      { label: "Readable activity history", href: "/profile" },
    ],
  },
];

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-12">
      <div className="grid min-h-[calc(100vh-120px)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Personal activity workspace
          </div>

          <div className="space-y-4">
            <TypewriterHeadline
              as="h1"
              className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
              segments={[
                { text: "Keep the public page " },
                { text: "quiet", className: "text-[#FF7F00]" },
                { text: ". Keep the work log honest." },
              ]}
            />
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Signed-out visitors only see this landing page. Signed-in members get a clean GitHub-inspired dashboard to log work, attach proof, and review momentum over time.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="inline-flex items-center rounded-lg bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90">
                Login with Clerk
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </SignInButton>
            <Link
              href="https://clerk.com/docs"
              className="inline-flex items-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Clerk docs
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item} className="rounded-xl border border-border bg-card px-4 py-4 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-border bg-muted px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-[220px_1fr]">
            <div className="border-b border-border bg-card p-5 md:border-b-0 md:border-r">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Workspace</p>
              <div className="mt-4 space-y-2">
                {previewNav.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-start justify-between rounded-xl border border-border bg-card px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Dashboard</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Track streaks, submissions, and recent proof uploads in one place.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Live</span>
              </div>

              <div className="rounded-xl border border-border bg-card px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Contribution rhythm</p>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {Array.from({ length: 42 }).map((_, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-sm border border-black/5 ${
                        index % 7 === 0
                          ? "bg-[#9be9a8]"
                          : index % 5 === 0
                            ? "bg-[#40c463]"
                            : index % 3 === 0
                              ? "bg-[#ebedf0]"
                              : "bg-[#216e39]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Recent work</p>
                  <span className="text-xs text-muted-foreground">2 entries today</span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    "Connected Clerk sign-in flow",
                    "Added Supabase persistence",
                    "Refined the dashboard layout",
                  ].map((item) => (
                    <div key={item} className="rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="relative overflow-hidden border-none bg-[linear-gradient(145deg,#0f172a,#172554)] p-0 text-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative space-y-6 p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              Designed for deliberate progress
            </div>

            <div className="space-y-4">
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                An elegant system for people who want calm structure, not a noisy feed.
              </h2>
              <p className="max-w-xl text-sm leading-8 text-slate-300">
                Skilltree is at its best when it feels measured and intentional. This section exists to make that philosophy visible before a user ever signs in.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {designMoments.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                    <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3 text-sky-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-lg font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="rounded-[28px] border-none bg-[linear-gradient(180deg,#ffffff,#f8fafc)] shadow-[0_20px_56px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
            <div className="flex gap-4 lg:flex-col">
              {["01", "02", "03"].map((item, index) => (
                <div key={item} className="flex items-center gap-3 lg:block">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-sm font-semibold text-foreground shadow-sm">
                    {item}
                  </div>
                  {index < 2 ? <div className="hidden h-12 w-px bg-border lg:mx-auto lg:block" /> : null}
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">A calmer flow</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">From landing page to daily habit</h3>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-white px-5 py-5 shadow-sm">
                  <p className="text-sm font-semibold text-foreground">See the promise clearly</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    The landing page shows a product with taste and restraint, not a cluttered marketing shell.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-white px-5 py-5 shadow-sm">
                  <p className="text-sm font-semibold text-foreground">Enter a focused dashboard</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Once signed in, users move into a workspace built around contribution rhythm, profile clarity, and discoverability.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-white px-5 py-5 shadow-sm">
                  <p className="text-sm font-semibold text-foreground">Keep the habit lightweight</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Logging work stays simple enough to repeat, which is what turns the product into a real personal system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Dynamic surface
          </div>

          <div className="space-y-4">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              A landing page that feels alive, without trying too hard.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
              This section adds motion in a restrained way. Panels drift softly, bars breathe, and the composition hints at a living product instead of a flat screenshot wall.
            </p>
          </div>

          <div className="grid gap-3">
            {dynamicSignals.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-2xl border border-border bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Card className="relative min-h-[520px] overflow-hidden rounded-[32px] border-none bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_22%),linear-gradient(180deg,#ffffff,#f8fafc)] shadow-[0_24px_64px_rgba(15,23,42,0.08)]">
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-sky-300/20 blur-2xl" />
          <div className="absolute bottom-10 right-8 h-28 w-28 rounded-full bg-emerald-300/20 blur-2xl" />

          <div className="relative h-full">
            <div className="float-card-a absolute left-6 top-12 w-[250px] rounded-[28px] border border-border bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Search people</p>
                <Search className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-4 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                Search by name, username, or email
              </div>
              <div className="mt-4 space-y-2">
                {["Naufal Waiz", "Alya Pramesti", "Rizky Aditya"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                      <p className="text-xs text-muted-foreground">@member_{index + 1}</p>
                    </div>
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="float-card-b absolute right-6 top-24 w-[240px] rounded-[28px] border border-slate-900 bg-slate-950 p-5 text-white shadow-[0_20px_44px_rgba(15,23,42,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Contribution rhythm</p>
              <p className="mt-4 text-3xl font-semibold">86%</p>
              <p className="mt-1 text-sm text-slate-300">Consistency signal this week</p>
              <div className="mt-5 space-y-3">
                {[68, 82, 91].map((value, index) => (
                  <div key={value + index}>
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                      <span>Track {index + 1}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10">
                      <div className="pulse-line h-2.5 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="float-card-c absolute bottom-12 left-1/2 w-[290px] -translate-x-1/2 rounded-[30px] border border-border bg-white/92 p-6 shadow-[0_20px_48px_rgba(15,23,42,0.1)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Live dashboard</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">Calm, readable, high-signal</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {["Entries", "Streak", "Proof"].map((item, index) => (
                  <div key={item} className="rounded-2xl border border-border bg-background px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item}</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{[42, 18, 91][index]}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-10 gap-1.5">
                {Array.from({ length: 40 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-3.5 w-3.5 rounded-[4px] border border-black/5 ${
                      index % 8 === 0
                        ? "bg-[#9be9a8]"
                        : index % 5 === 0
                          ? "bg-[#40c463]"
                          : index % 3 === 0
                            ? "bg-[#30a14e]"
                            : "bg-[#ebedf0]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <Orbit className="h-3.5 w-3.5 text-primary" />
            Workflow atlas
          </div>

          <div className="space-y-4">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              A sharper section with real hierarchy, cleaner spacing, and motion that supports the layout.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
              This section is intentionally more structured. It reads like product architecture: calm left column, guided narrative on the right, and a moving beam that quietly suggests flow through the system.
            </p>
          </div>

          <div className="grid gap-3">
            {atlasPoints.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-2xl border border-border bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-foreground shadow-sm ring-1 ring-border">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Card className="relative min-h-[560px] overflow-hidden rounded-[34px] border-none bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_20%),linear-gradient(180deg,#ffffff,#f8fafc)] shadow-[0_28px_72px_rgba(15,23,42,0.1)]">
          <div className="relative h-full p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="atlas-chip-a rounded-full border border-border bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground shadow-sm">
                Structured flow
              </div>
              <div className="atlas-chip-b rounded-full border border-border bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground shadow-sm">
                Motion with restraint
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[72px_1fr]">
              <div className="relative hidden lg:block">
                <div className="absolute left-1/2 top-4 h-[calc(100%-32px)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                <div className="atlas-beam absolute left-1/2 top-6 h-20 w-[6px] -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-400 via-primary to-emerald-400 blur-[1px]" />
              </div>

              <div className="space-y-5">
                {atlasSteps.map((step, index) => (
                  <div key={step.label} className="grid gap-3 lg:grid-cols-[72px_1fr] lg:items-start">
                    <div className="flex lg:justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-slate-950 text-sm font-semibold text-white shadow-sm">
                        0{index + 1}
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-border bg-white/92 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
                      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{step.label}</p>
                          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
                        </div>

                        <div className="rounded-2xl border border-border bg-[linear-gradient(180deg,#ffffff,#fbfdff)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                          <div className="space-y-3">
                            <div className="h-2.5 rounded-full bg-slate-100">
                              <div
                                className="pulse-line h-2.5 rounded-full bg-gradient-to-r from-sky-400 via-primary to-emerald-400"
                                style={{ width: `${72 + index * 9}%` }}
                              />
                            </div>
                            <div className="grid grid-cols-8 gap-1.5">
                              {Array.from({ length: 24 }).map((_, dotIndex) => (
                                <div
                                  key={`${step.label}-${dotIndex}`}
                                  className={`h-3 w-3 rounded-[4px] border border-black/5 ${
                                    dotIndex % (index + 3) === 0
                                      ? "bg-[#40c463]"
                                      : dotIndex % 2 === 0
                                        ? "bg-[#ebedf0]"
                                        : "bg-[#9be9a8]"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {index === 0
                                ? "The input layer stays simple, so adding work never feels heavy."
                                : index === 1
                                  ? "The dashboard layer turns scattered activity into a readable pattern."
                                  : "The navigation layer keeps people, profiles, and contribution history connected."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <footer className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_22%),linear-gradient(160deg,#0f172a,#111827_42%,#172554)] text-white shadow-[0_28px_72px_rgba(15,23,42,0.18)]">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid gap-8 px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              Skilltree footer
            </div>

            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
                A calmer product deserves a cleaner ending.
              </h2>
              <p className="max-w-2xl text-sm leading-8 text-slate-300">
                Skilltree is designed as a focused surface for growth logs, contribution rhythm, and searchable member profiles. The footer keeps that tone intact instead of collapsing into generic link clutter.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90">
                  Login and open dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </SignInButton>
              <Link
                href="https://clerk.com/docs"
                className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Read the docs
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Private flow", value: "Landing → Dashboard" },
                { label: "Signals", value: "Score, streak, proof" },
                { label: "Discovery", value: "Searchable profiles" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                  <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {footerColumns.map((column) => (
                <div key={column.title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{column.title}</p>
                  <div className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block text-sm text-slate-200 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Live status</p>
                  <p className="mt-2 text-xl font-semibold text-white">Quiet outside, high-signal inside.</p>
                </div>
                <div className="w-full max-w-[220px]">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Interface clarity</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10">
                    <div className="pulse-line h-2.5 rounded-full bg-gradient-to-r from-sky-400 via-primary to-emerald-400" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Clerk auth", "Supabase ready", "Search people", "Contribution dashboard"].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 px-6 py-4 md:px-8">
          <div className="flex flex-col gap-2 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>Skilltree. A cleaner way to track growth, signal, and contribution.</p>
            <p>Built for makers who prefer clarity over noise.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
