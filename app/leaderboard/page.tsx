"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { LeaderboardEntry } from "@/lib/types";
import { formatRelativeDayLabel } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

export default function LeaderboardPage() {
  const { leaderboardRange, setLeaderboardRange } = useAppStore();
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void fetch(`/api/leaderboard?range=${leaderboardRange}`)
      .then((response) => response.json())
      .then((payload) => setRows(payload.entries ?? []))
      .finally(() => setLoading(false));
  }, [leaderboardRange]);

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Leaderboard"
        title="Rank effort, not clout"
        description="Optional MVP module that ranks users by transparent effort score. Filters keep the board useful for both recent momentum and all-time output."
      />

      <div className="flex flex-wrap gap-3">
        {(["daily", "weekly", "all"] as const).map((range) => (
          <Button
            key={range}
            variant={leaderboardRange === range ? "primary" : "outline"}
            onClick={() => setLeaderboardRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>

      <Card className="bg-white/5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Current window</p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">{formatRelativeDayLabel(leaderboardRange)}</h3>
          </div>
          <Crown className="h-6 w-6 text-primary" />
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No entries yet for this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <tr>
                  <th className="pb-4">Rank</th>
                  <th className="pb-4">Wallet</th>
                  <th className="pb-4">Score</th>
                  <th className="pb-4">Streak</th>
                  <th className="pb-4">Activities</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.walletAddress} className="border-t border-white/10">
                    <td className="py-4 font-semibold text-primary">#{row.rank}</td>
                    <td className="py-4 text-foreground">{row.walletAddress}</td>
                    <td className="py-4 text-foreground">{row.totalScore}</td>
                    <td className="py-4 text-foreground">{row.streak} days</td>
                    <td className="py-4 text-muted-foreground">{row.activityCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
