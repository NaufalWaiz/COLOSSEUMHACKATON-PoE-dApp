export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Proof of Effort",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  solanaRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
  programId: process.env.NEXT_PUBLIC_POE_PROGRAM_ID ?? "Fg6PaFpoGXkYsidMpWxTWqkZq8ShWm6ihcK3a8bJc7UU",
  sessionSecret: process.env.SESSION_SECRET ?? "dev-only-secret-change-me",
  mockAdapters: process.env.MOCK_EXTERNAL_ADAPTERS !== "false",
};
