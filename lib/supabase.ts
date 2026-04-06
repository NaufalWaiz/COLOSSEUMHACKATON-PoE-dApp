import "server-only";

import { createClient } from "@supabase/supabase-js";
import { Activity, BlockchainRecord, NonceRecord, ScoreSnapshot, User } from "@/lib/types";
import { serverEnv } from "@/lib/server-env";

type UserRow = {
  id: string;
  wallet_address: string;
  created_at: string;
};

type ActivityRow = {
  id: string;
  user_id: string;
  wallet_address: string;
  activity_type: Activity["activityType"];
  duration: number;
  description: string;
  proof_ipfs: string;
  effort_hash: string;
  score: number;
  consistency_multiplier: number | string;
  created_at: string;
  chain_tx_id: string;
};

type ScoreRow = {
  user_id: string;
  total_score: number;
  updated_at: string;
};

type NonceRow = {
  wallet_address: string;
  nonce: string;
  expires_at: number | string;
};

type ChainRecordRow = {
  tx_id: string;
  wallet_address: string;
  effort_hash: string;
  score: number;
  timestamp: number | string;
  network: string;
};

type Database = {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserRow;
        Update: Partial<UserRow>;
        Relationships: [];
      };
      activities: {
        Row: ActivityRow;
        Insert: ActivityRow;
        Update: Partial<ActivityRow>;
        Relationships: [];
      };
      scores: {
        Row: ScoreRow;
        Insert: ScoreRow;
        Update: Partial<ScoreRow>;
        Relationships: [];
      };
      nonces: {
        Row: NonceRow;
        Insert: NonceRow;
        Update: Partial<NonceRow>;
        Relationships: [];
      };
      chain_records: {
        Row: ChainRecordRow;
        Insert: ChainRecordRow;
        Update: Partial<ChainRecordRow>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
  };
};

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export function isSupabaseConfigured() {
  return Boolean(serverEnv.supabaseUrl && (serverEnv.supabaseServiceRoleKey || serverEnv.supabaseAnonKey));
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  if (!supabaseClient) {
    const key = serverEnv.supabaseServiceRoleKey ?? serverEnv.supabaseAnonKey;
    supabaseClient = createClient<Database>(serverEnv.supabaseUrl!, key!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseClient;
}

export function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    createdAt: row.created_at,
  };
}

export function mapActivityRow(row: ActivityRow): Activity {
  return {
    id: row.id,
    userId: row.user_id,
    walletAddress: row.wallet_address,
    activityType: row.activity_type,
    duration: row.duration,
    description: row.description,
    proofIpfs: row.proof_ipfs,
    effortHash: row.effort_hash,
    score: row.score,
    consistencyMultiplier: Number(row.consistency_multiplier),
    createdAt: row.created_at,
    chainTxId: row.chain_tx_id,
  };
}

export function mapScoreRow(row: ScoreRow): ScoreSnapshot {
  return {
    userId: row.user_id,
    totalScore: row.total_score,
    updatedAt: row.updated_at,
  };
}

export function mapNonceRow(row: NonceRow): NonceRecord {
  return {
    walletAddress: row.wallet_address,
    nonce: row.nonce,
    expiresAt: Number(row.expires_at),
  };
}

export function mapChainRecordRow(row: ChainRecordRow): BlockchainRecord {
  return {
    txId: row.tx_id,
    walletAddress: row.wallet_address,
    effortHash: row.effort_hash,
    score: row.score,
    timestamp: Number(row.timestamp),
    network: row.network,
  };
}

export function assertSupabaseSuccess(error: { message: string } | null, context: string) {
  if (error) {
    const hint =
      error.message.includes("fetch failed")
        ? " Check SUPABASE_URL, project availability, and network access."
        : "";
    throw new Error(`${context}: ${error.message}${hint}`);
  }
}
