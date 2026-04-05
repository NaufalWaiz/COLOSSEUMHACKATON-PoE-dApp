import { MIN_ACTIVITY_DURATION } from "@/lib/constants";
import { recordEffortOnChain } from "@/lib/blockchain";
import { randomId, sha256 } from "@/lib/id";
import { buildBreakdown, calculateConsistencyMultiplier, calculateEffortScore, calculateStreak } from "@/lib/scoring";
import { readDb, writeDb } from "@/lib/storage";
import { Activity, ActivityType, LeaderboardEntry, ProfilePayload, User } from "@/lib/types";

export async function ensureUser(walletAddress: string): Promise<User> {
  const db = await readDb();
  let user = db.users.find((item) => item.walletAddress === walletAddress);

  if (!user) {
    user = {
      id: randomId("user"),
      walletAddress,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    db.scores.push({
      userId: user.id,
      totalScore: 0,
      updatedAt: new Date().toISOString(),
    });
    await writeDb(db);
  }

  return user;
}

export async function createEffortActivity(input: {
  walletAddress: string;
  activityType: ActivityType;
  duration: number;
  description: string;
  proofIpfs: string;
}) {
  if (input.duration < MIN_ACTIVITY_DURATION) {
    throw new Error(`Minimum activity duration is ${MIN_ACTIVITY_DURATION} minutes.`);
  }

  const db = await readDb();
  const user = db.users.find((item) => item.walletAddress === input.walletAddress) ?? {
    id: randomId("user"),
    walletAddress: input.walletAddress,
    createdAt: new Date().toISOString(),
  };

  if (!db.users.some((item) => item.walletAddress === input.walletAddress)) {
    db.users.push(user);
  }

  const duplicate = db.activities.find(
    (activity) =>
      activity.walletAddress === input.walletAddress &&
      activity.activityType === input.activityType &&
      activity.duration === input.duration &&
      activity.description.trim().toLowerCase() === input.description.trim().toLowerCase() &&
      activity.proofIpfs === input.proofIpfs,
  );

  if (duplicate) {
    throw new Error("Potential duplicate effort detected. Change the proof or description.");
  }

  const userActivities = db.activities.filter((activity) => activity.walletAddress === input.walletAddress);
  const consistencyMultiplier = calculateConsistencyMultiplier(userActivities);
  const score = calculateEffortScore(input.activityType, input.duration, consistencyMultiplier);
  const timestamp = new Date().toISOString();
  const effortHash = sha256(
    `${input.walletAddress}:${input.activityType}:${input.duration}:${input.description}:${input.proofIpfs}:${timestamp}`,
  );
  const chainRecord = await recordEffortOnChain({
    walletAddress: input.walletAddress,
    effortHash,
    score,
  });

  const activity: Activity = {
    id: randomId("act"),
    userId: user.id,
    walletAddress: input.walletAddress,
    activityType: input.activityType,
    duration: input.duration,
    description: input.description.trim(),
    proofIpfs: input.proofIpfs,
    effortHash,
    score,
    consistencyMultiplier,
    createdAt: timestamp,
    chainTxId: chainRecord.txId,
  };

  db.activities.unshift(activity);
  db.chainRecords.unshift(chainRecord);

  const totalScore = db.activities
    .filter((item) => item.walletAddress === input.walletAddress)
    .reduce((sum, item) => sum + item.score, 0);

  const snapshot = db.scores.find((item) => item.userId === user.id);
  if (snapshot) {
    snapshot.totalScore = totalScore;
    snapshot.updatedAt = timestamp;
  } else {
    db.scores.push({ userId: user.id, totalScore, updatedAt: timestamp });
  }

  await writeDb(db);
  return { activity, chainRecord, totalScore };
}

export async function getProfile(walletAddress: string): Promise<ProfilePayload> {
  const db = await readDb();
  const activities = db.activities.filter((activity) => activity.walletAddress === walletAddress);
  const totalScore = activities.reduce((sum, activity) => sum + activity.score, 0);

  return {
    walletAddress,
    totalScore,
    streak: calculateStreak(activities),
    activities,
    breakdown: buildBreakdown(activities),
  };
}

function filterActivitiesByRange(activities: Activity[], range: "daily" | "weekly" | "all") {
  if (range === "all") return activities;
  const now = Date.now();
  const threshold = range === "daily" ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60 * 24 * 7;
  return activities.filter((activity) => now - new Date(activity.createdAt).getTime() <= threshold);
}

export async function getLeaderboard(range: "daily" | "weekly" | "all"): Promise<LeaderboardEntry[]> {
  const db = await readDb();
  const byWallet = new Map<string, Activity[]>();

  for (const activity of db.activities) {
    const list = byWallet.get(activity.walletAddress) ?? [];
    list.push(activity);
    byWallet.set(activity.walletAddress, list);
  }

  return Array.from(byWallet.entries())
    .map(([walletAddress, activities]) => {
      const ranged = filterActivitiesByRange(activities, range);
      return {
        walletAddress,
        totalScore: ranged.reduce((sum, activity) => sum + activity.score, 0),
        streak: calculateStreak(activities),
        activityCount: ranged.length,
      };
    })
    .filter((entry) => entry.activityCount > 0)
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
}
