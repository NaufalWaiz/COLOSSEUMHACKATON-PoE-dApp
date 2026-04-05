import { ActivityFeed } from "@/components/activity-feed";
import { BreakdownBars } from "@/components/breakdown-bars";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile } from "@/lib/repository";
import { getSession } from "@/lib/session";

export default async function ProfilePage() {
  const session = getSession();
  const profile = session ? await getProfile(session.walletAddress) : null;

  if (!profile) {
    return (
      <Card className="bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-foreground">No authenticated profile</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Connect and sign your wallet. This page then renders your effort history, score breakdown, and streak summary.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Profile"
        title="Portable effort reputation"
        description="Your wallet address becomes the identity anchor. The profile aggregates score, effort history, and category-level output."
      />

      <section className="grid gap-4 lg:grid-cols-[0.65fr_1.35fr]">
        <Card className="space-y-4 bg-white/5">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Wallet identity</p>
          <p className="break-all text-xl font-semibold text-foreground">{profile.walletAddress}</p>
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total score</p>
              <p className="mt-2 text-3xl font-semibold text-primary">{profile.totalScore}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Streak</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{profile.streak} days</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Logged activities</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{profile.activities.length}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-5 bg-white/5">
          <h3 className="text-xl font-semibold text-foreground">Activity mix</h3>
          <BreakdownBars breakdown={profile.breakdown} />
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="History"
          title="Complete activity feed"
          description="The feed below is the raw history currently attached to your authenticated wallet."
        />
        <ActivityFeed activities={profile.activities} />
      </section>
    </div>
  );
}
