import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { Activity } from "@/lib/types";

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-background px-5 py-6">
        <p className="text-sm text-muted-foreground">No work entries yet. Start by logging one activity.</p>
        <Link href="/submit" className="mt-4 inline-flex text-sm font-semibold text-primary">
          Go to submit page
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{activity.activityType}</Badge>
                <Badge className="bg-[#e6ffec] text-[#216e39]">{activity.duration} min</Badge>
                <Badge className="bg-[#ddf4ff] text-[#0969da]">+{activity.score} score</Badge>
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{activity.description}</p>
                <p className="mt-2 text-sm text-muted-foreground">Proof: {activity.proofIpfs}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground md:text-right">
              <p>{formatDateTime(activity.createdAt)}</p>
              <p className="mt-2">Chain ref: {activity.chainTxId}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
