import { ACTIVITY_WEIGHTS } from "@/lib/constants";
import { Activity, ActivityType } from "@/lib/types";

export function calculateStreak(activities: Activity[]) {
  if (activities.length === 0) return 0;

  const distinctDays = Array.from(
    new Set(
      activities
        .map((activity) => new Date(activity.createdAt).toISOString().slice(0, 10))
        .sort()
        .reverse(),
    ),
  );

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const day of distinctDays) {
    const isoDay = cursor.toISOString().slice(0, 10);
    if (day !== isoDay) {
      if (streak === 0) {
        const yesterday = new Date(cursor);
        yesterday.setDate(yesterday.getDate() - 1);
        if (day !== yesterday.toISOString().slice(0, 10)) break;
        cursor = yesterday;
      } else {
        break;
      }
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function calculateConsistencyMultiplier(previousActivities: Activity[]) {
  const streak = calculateStreak(previousActivities);
  const multiplier = 1 + Math.min(streak * 0.1, 0.5);
  return Number(multiplier.toFixed(2));
}

export function calculateEffortScore(
  activityType: ActivityType,
  duration: number,
  consistencyMultiplier: number,
) {
  return Math.round(duration * ACTIVITY_WEIGHTS[activityType] * consistencyMultiplier);
}

export function buildBreakdown(activities: Activity[]) {
  const base = Object.keys(ACTIVITY_WEIGHTS).map((type) => ({
    type: type as ActivityType,
    totalMinutes: 0,
    totalScore: 0,
  }));

  for (const activity of activities) {
    const item = base.find((entry) => entry.type === activity.activityType);
    if (!item) continue;
    item.totalMinutes += activity.duration;
    item.totalScore += activity.score;
  }

  return base;
}
