import Image from "next/image";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Eye, UserRound } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { BreakdownBars } from "@/components/breakdown-bars";
import { Card } from "@/components/ui/card";
import { shortIdentity, toPersonSummary } from "@/lib/identity";
import { getPersonById } from "@/lib/people";
import { getProfile } from "@/lib/repository";

type ProfilePageProps = {
  searchParams?: {
    identity?: string | string[];
  };
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const requestedIdentity = Array.isArray(searchParams?.identity) ? searchParams?.identity[0] : searchParams?.identity;
  const identity = requestedIdentity ?? userId;
  const isOwnProfile = identity === userId;
  const viewer = await currentUser();
  const person = isOwnProfile ? toPersonSummary(viewer) : await getPersonById(identity);

  if (!person) {
    notFound();
  }

  const profile = await getProfile(identity);

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-none bg-[linear-gradient(135deg,rgba(9,105,218,0.08),rgba(255,255,255,0.96),rgba(15,23,42,0.04))] p-0 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-4 p-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="space-y-4">
            {!isOwnProfile ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm">
                <Eye className="h-3.5 w-3.5" />
                Viewing member profile
              </div>
            ) : null}

            <div className="flex items-center gap-4">
              {person.imageUrl ? (
                <Image
                  src={person.imageUrl}
                  alt={person.displayName}
                  width={80}
                  height={80}
                  className="rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                  <UserRound className="h-5 w-5" />
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Account</p>
                <h1 className="mt-2 text-3xl font-semibold text-foreground">{person.displayName}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{person.subtitle}</p>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {isOwnProfile
                ? "This is your private activity profile. Use it to review your score, contribution balance, and full entry timeline."
                : "You are viewing another member's activity profile. The page shows their score, cadence, and recorded entries."}
            </p>
          </div>

          {!isOwnProfile ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/85 px-4 py-2 text-sm font-medium text-foreground no-underline transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to my profile
            </Link>
          ) : null}
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <Card className="space-y-4">
          <div className="grid gap-3 rounded-2xl border border-border bg-background p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Member ID</p>
              <p className="mt-2 text-sm font-medium text-foreground">{shortIdentity(identity)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total score</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{profile.totalScore}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Streak</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{profile.streak} days</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Entries</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{profile.activities.length}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Breakdown</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">Where the effort is concentrated</h2>
          </div>
          <BreakdownBars breakdown={profile.breakdown} />
        </Card>
      </section>

      <Card className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Full activity history</h2>
          <p className="text-sm text-muted-foreground">
            {isOwnProfile ? "Every submission currently attached to your Clerk account." : `Recorded submissions for ${person.displayName}.`}
          </p>
        </div>
        <ActivityFeed activities={profile.activities} />
      </Card>
    </div>
  );
}
