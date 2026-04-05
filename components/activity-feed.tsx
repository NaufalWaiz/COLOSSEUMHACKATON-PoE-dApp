import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Activity } from "@/lib/types";

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <Card className="bg-white/5">
        <p className="text-sm text-muted-foreground">No effort submitted yet. Start by logging one activity.</p>
        <Link href="/submit" className="mt-4 inline-flex text-sm font-semibold text-primary">
          Go to submit page
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="bg-white/5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{activity.activityType}</Badge>
                <Badge className="bg-emerald-400/10 text-emerald-200">{activity.duration} min</Badge>
                <Badge className="bg-primary/10 text-primary">+{activity.score} score</Badge>
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{activity.description}</p>
                <p className="mt-2 text-sm text-muted-foreground">Proof: {activity.proofIpfs}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground md:text-right">
              <p>{formatDate(activity.createdAt)}</p>
              <p className="mt-2">Chain ref: {activity.chainTxId}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
