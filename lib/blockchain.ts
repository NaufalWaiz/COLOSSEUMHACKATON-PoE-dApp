import { env } from "@/lib/env";
import { randomId } from "@/lib/id";
import { BlockchainRecord } from "@/lib/types";

export async function recordEffortOnChain(input: {
  walletAddress: string;
  effortHash: string;
  score: number;
}): Promise<BlockchainRecord> {
  return {
    txId: randomId("tx"),
    walletAddress: input.walletAddress,
    effortHash: input.effortHash,
    score: input.score,
    timestamp: Date.now(),
    network: env.mockAdapters ? "solana-devnet-mock" : "solana-devnet",
  };
}
