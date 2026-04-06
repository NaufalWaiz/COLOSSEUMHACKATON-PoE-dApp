import { randomId } from "@/lib/id";
import { serverEnv } from "@/lib/server-env";
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
    network: serverEnv.mockAdapters ? "solana-devnet-mock" : "solana-devnet",
  };
}
