import { ACTIVITY_WEIGHTS } from "@/lib/constants";

export type ActivityType = keyof typeof ACTIVITY_WEIGHTS;

export type User = {
  id: string;
  walletAddress: string;
  createdAt: string;
};

export type Activity = {
  id: string;
  userId: string;
  walletAddress: string;
  activityType: ActivityType;
  duration: number;
  description: string;
  proofIpfs: string;
  effortHash: string;
  score: number;
  consistencyMultiplier: number;
  createdAt: string;
  chainTxId: string;
};

export type ScoreSnapshot = {
  userId: string;
  totalScore: number;
  updatedAt: string;
};

export type BlockchainRecord = {
  txId: string;
  walletAddress: string;
  effortHash: string;
  score: number;
  timestamp: number;
  network: string;
};

export type NonceRecord = {
  walletAddress: string;
  nonce: string;
  expiresAt: number;
};

export type DatabaseShape = {
  users: User[];
  activities: Activity[];
  scores: ScoreSnapshot[];
  nonces: NonceRecord[];
  chainRecords: BlockchainRecord[];
};

export type ProfilePayload = {
  walletAddress: string;
  totalScore: number;
  streak: number;
  activities: Activity[];
  breakdown: Array<{ type: ActivityType; totalMinutes: number; totalScore: number }>;
};

export type LeaderboardEntry = {
  rank: number;
  walletAddress: string;
  totalScore: number;
  streak: number;
  activityCount: number;
};

export type PersonSummary = {
  id: string;
  displayName: string;
  subtitle: string;
  imageUrl: string | null;
};
