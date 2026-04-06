import { MIN_ACTIVITY_DURATION } from "@/lib/constants";
import { recordEffortOnChain } from "@/lib/blockchain";
import { randomId, sha256 } from "@/lib/id";
import { buildBreakdown, calculateConsistencyMultiplier, calculateEffortScore, calculateStreak } from "@/lib/scoring";
import { readDb, writeDb } from "@/lib/storage";
import {
  assertSupabaseSuccess,
  getSupabaseServerClient,
  isSupabaseConfigured,
  mapActivityRow,
  mapUserRow,
} from "@/lib/supabase";
import { Activity, ActivityType, LeaderboardEntry, ProfilePayload, User } from "@/lib/types";

function filterActivitiesByRange(activities: Activity[], range: "daily" | "weekly" | "all") {
  if (range === "all") return activities;
  const now = Date.now();
  const threshold = range === "daily" ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60 * 24 * 7;
  return activities.filter((activity) => now - new Date(activity.createdAt).getTime() <= threshold);
}

async function ensureUserLocal(walletAddress: string): Promise<User> {
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

async function ensureUserSupabase(walletAddress: string): Promise<User> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, wallet_address, created_at")
    .eq("wallet_address", walletAddress)
    .maybeSingle();

  assertSupabaseSuccess(error, "Failed to fetch user");

  if (data) {
    return mapUserRow(data);
  }

  const createdAt = new Date().toISOString();
  const userId = randomId("user");
  const { data: inserted, error: insertError } = await supabase
    .from("users")
    .insert({
      id: userId,
      wallet_address: walletAddress,
      created_at: createdAt,
    })
    .select("id, wallet_address, created_at")
    .single();

  if (insertError) {
    const { data: existing, error: refetchError } = await supabase
      .from("users")
      .select("id, wallet_address, created_at")
      .eq("wallet_address", walletAddress)
      .maybeSingle();

    assertSupabaseSuccess(refetchError, "Failed to refetch user after insert");
    if (existing) {
      return mapUserRow(existing);
    }

    throw new Error(`Failed to create user: ${insertError.message}`);
  }

  const { error: scoreError } = await supabase.from("scores").upsert(
    {
      user_id: inserted.id,
      total_score: 0,
      updated_at: createdAt,
    },
    { onConflict: "user_id" },
  );

  assertSupabaseSuccess(scoreError, "Failed to initialize score snapshot");

  return mapUserRow(inserted);
}

export async function ensureUser(walletAddress: string): Promise<User> {
  if (!isSupabaseConfigured()) {
    return ensureUserLocal(walletAddress);
  }

  return ensureUserSupabase(walletAddress);
}

async function createEffortActivityLocal(input: {
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

  const normalizedDescription = input.description.trim();
  const duplicate = db.activities.find(
    (activity) =>
      activity.walletAddress === input.walletAddress &&
      activity.activityType === input.activityType &&
      activity.duration === input.duration &&
      activity.description.trim().toLowerCase() === normalizedDescription.toLowerCase() &&
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
    `${input.walletAddress}:${input.activityType}:${input.duration}:${normalizedDescription}:${input.proofIpfs}:${timestamp}`,
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
    description: normalizedDescription,
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

async function createEffortActivitySupabase(input: {
  walletAddress: string;
  activityType: ActivityType;
  duration: number;
  description: string;
  proofIpfs: string;
}) {
  if (input.duration < MIN_ACTIVITY_DURATION) {
    throw new Error(`Minimum activity duration is ${MIN_ACTIVITY_DURATION} minutes.`);
  }

  const supabase = getSupabaseServerClient();
  const user = await ensureUserSupabase(input.walletAddress);
  const normalizedDescription = input.description.trim();

  const { data: duplicateRows, error: duplicateError } = await supabase
    .from("activities")
    .select(
      "id, user_id, wallet_address, activity_type, duration, description, proof_ipfs, effort_hash, score, consistency_multiplier, created_at, chain_tx_id",
    )
    .eq("wallet_address", input.walletAddress)
    .eq("activity_type", input.activityType)
    .eq("duration", input.duration)
    .eq("proof_ipfs", input.proofIpfs);

  assertSupabaseSuccess(duplicateError, "Failed to inspect duplicate activity");

  const duplicate = (duplicateRows ?? [])
    .map(mapActivityRow)
    .find((activity) => activity.description.trim().toLowerCase() === normalizedDescription.toLowerCase());

  if (duplicate) {
    throw new Error("Potential duplicate effort detected. Change the proof or description.");
  }

  const { data: previousRows, error: previousError } = await supabase
    .from("activities")
    .select(
      "id, user_id, wallet_address, activity_type, duration, description, proof_ipfs, effort_hash, score, consistency_multiplier, created_at, chain_tx_id",
    )
    .eq("wallet_address", input.walletAddress)
    .order("created_at", { ascending: false });

  assertSupabaseSuccess(previousError, "Failed to fetch user activities");

  const userActivities = (previousRows ?? []).map(mapActivityRow);
  const consistencyMultiplier = calculateConsistencyMultiplier(userActivities);
  const score = calculateEffortScore(input.activityType, input.duration, consistencyMultiplier);
  const timestamp = new Date().toISOString();
  const effortHash = sha256(
    `${input.walletAddress}:${input.activityType}:${input.duration}:${normalizedDescription}:${input.proofIpfs}:${timestamp}`,
  );
  const chainRecord = await recordEffortOnChain({
    walletAddress: input.walletAddress,
    effortHash,
    score,
  });

  const activityRow = {
    id: randomId("act"),
    user_id: user.id,
    wallet_address: input.walletAddress,
    activity_type: input.activityType,
    duration: input.duration,
    description: normalizedDescription,
    proof_ipfs: input.proofIpfs,
    effort_hash: effortHash,
    score,
    consistency_multiplier: consistencyMultiplier,
    created_at: timestamp,
    chain_tx_id: chainRecord.txId,
  };

  const { error: activityError } = await supabase.from("activities").insert(activityRow);
  assertSupabaseSuccess(activityError, "Failed to insert activity");

  const { error: chainError } = await supabase.from("chain_records").insert({
    tx_id: chainRecord.txId,
    wallet_address: chainRecord.walletAddress,
    effort_hash: chainRecord.effortHash,
    score: chainRecord.score,
    timestamp: chainRecord.timestamp,
    network: chainRecord.network,
  });

  assertSupabaseSuccess(chainError, "Failed to insert chain record");

  const totalScore = userActivities.reduce((sum, activity) => sum + activity.score, 0) + score;
  const { error: scoreError } = await supabase.from("scores").upsert(
    {
      user_id: user.id,
      total_score: totalScore,
      updated_at: timestamp,
    },
    { onConflict: "user_id" },
  );

  assertSupabaseSuccess(scoreError, "Failed to update score snapshot");

  return {
    activity: mapActivityRow(activityRow),
    chainRecord,
    totalScore,
  };
}

export async function createEffortActivity(input: {
  walletAddress: string;
  activityType: ActivityType;
  duration: number;
  description: string;
  proofIpfs: string;
}) {
  if (!isSupabaseConfigured()) {
    return createEffortActivityLocal(input);
  }

  return createEffortActivitySupabase(input);
}

async function getProfileLocal(walletAddress: string): Promise<ProfilePayload> {
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

async function getProfileSupabase(walletAddress: string): Promise<ProfilePayload> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("activities")
    .select(
      "id, user_id, wallet_address, activity_type, duration, description, proof_ipfs, effort_hash, score, consistency_multiplier, created_at, chain_tx_id",
    )
    .eq("wallet_address", walletAddress)
    .order("created_at", { ascending: false });

  assertSupabaseSuccess(error, "Failed to fetch profile activities");

  const activities = (data ?? []).map(mapActivityRow);
  const totalScore = activities.reduce((sum, activity) => sum + activity.score, 0);

  return {
    walletAddress,
    totalScore,
    streak: calculateStreak(activities),
    activities,
    breakdown: buildBreakdown(activities),
  };
}

export async function getProfile(walletAddress: string): Promise<ProfilePayload> {
  if (!isSupabaseConfigured()) {
    return getProfileLocal(walletAddress);
  }

  return getProfileSupabase(walletAddress);
}

async function getLeaderboardLocal(range: "daily" | "weekly" | "all"): Promise<LeaderboardEntry[]> {
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

async function getLeaderboardSupabase(range: "daily" | "weekly" | "all"): Promise<LeaderboardEntry[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("activities")
    .select(
      "id, user_id, wallet_address, activity_type, duration, description, proof_ipfs, effort_hash, score, consistency_multiplier, created_at, chain_tx_id",
    );

  assertSupabaseSuccess(error, "Failed to fetch leaderboard activities");

  const activities = (data ?? []).map(mapActivityRow);
  const byWallet = new Map<string, Activity[]>();

  for (const activity of activities) {
    const list = byWallet.get(activity.walletAddress) ?? [];
    list.push(activity);
    byWallet.set(activity.walletAddress, list);
  }

  return Array.from(byWallet.entries())
    .map(([walletAddress, walletActivities]) => {
      const ranged = filterActivitiesByRange(walletActivities, range);
      return {
        walletAddress,
        totalScore: ranged.reduce((sum, activity) => sum + activity.score, 0),
        streak: calculateStreak(walletActivities),
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

export async function getLeaderboard(range: "daily" | "weekly" | "all"): Promise<LeaderboardEntry[]> {
  if (!isSupabaseConfigured()) {
    return getLeaderboardLocal(range);
  }

  return getLeaderboardSupabase(range);
}
