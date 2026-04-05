import { ProgressBar } from "@/components/ui/progress-bar";
import { formatNumber } from "@/lib/utils";
import { ProfilePayload } from "@/lib/types";

export function BreakdownBars({ breakdown }: Pick<ProfilePayload, "breakdown">) {
  const maxScore = Math.max(...breakdown.map((item) => item.totalScore), 1);

  return (
    <div className="space-y-4">
      {breakdown.map((item) => (
        <div key={item.type} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium capitalize text-foreground">{item.type}</span>
            <span className="text-muted-foreground">
              {formatNumber(item.totalMinutes)} min / {formatNumber(item.totalScore)} pts
            </span>
          </div>
          <ProgressBar value={(item.totalScore / maxScore) * 100} />
        </div>
      ))}
    </div>
  );
}
