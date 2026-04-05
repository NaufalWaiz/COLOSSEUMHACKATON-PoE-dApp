# Proof of Effort

Proof of Effort is a Web3 reputation MVP that records user activity, computes an effort score, stores proof references, and prepares immutable records for Solana.

## What is implemented

- Next.js App Router frontend with landing page, dashboard, submit form, profile, and leaderboard
- Wallet authentication flow using Phantom connect plus signed message verification
- Rule-based effort scoring for coding, learning, and watching activities
- Local repository adapter that mirrors a Supabase/PostgreSQL style data model
- Local proof storage adapter that generates deterministic IPFS-like proof references
- Solana-ready blockchain adapter plus Anchor program scaffold under `programs/poe`

## Local architecture

```text
Frontend (Next.js)
  -> API routes
  -> Local JSON repository (.storage/poe-db.json)
  -> Local proof files (.storage/uploads)
  -> Mock chain record adapter
```

The current project is wired so the MVP can run locally without requiring a live Supabase, Pinata, or Solana program deployment. Replace the adapters in `lib/repository.ts`, `lib/ipfs.ts`, and `lib/blockchain.ts` when you are ready to connect production services.

## Environment

Copy `.env.example` to `.env.local` and update values as needed.

- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC endpoint, default is Devnet
- `NEXT_PUBLIC_POE_PROGRAM_ID`: program id used by the client and Anchor scaffold
- `SESSION_SECRET`: backend secret used to sign the wallet session cookie
- `MOCK_EXTERNAL_ADAPTERS`: keep `true` for local mock mode

## Run

```bash
npm install
npm run dev
```

## API surface

- `POST /api/auth/nonce` - issue login nonce for a wallet
- `POST /api/auth/verify` - verify signed wallet message and create session cookie
- `POST /api/auth/logout` - clear session
- `POST /api/upload` - upload a proof file and receive an IPFS-like cid
- `POST /api/effort` - submit a new effort activity
- `GET /api/profile` - fetch the authenticated profile or a specific wallet profile
- `GET /api/leaderboard?range=daily|weekly|all` - fetch leaderboard data

## Data model

The local repository keeps the same high-level shapes described in the SDD:

- `users`
- `activities`
- `scores`
- `nonces`
- `chainRecords`

All data is written to `.storage/poe-db.json` during development.

## Verification status

I verified:

- `npx tsc --noEmit`
- `npm run lint`

The local `next build` attempt in this environment is blocked by a broken native SWC binary from the machine setup (`@next/swc-win32-x64-msvc` failed to load as a valid Win32 application). The application code itself passed TypeScript and ESLint checks.

## Next integration steps

1. Replace `lib/storage.ts` and `lib/repository.ts` with Supabase or PostgreSQL persistence.
2. Replace `lib/ipfs.ts` with Pinata or Web3.Storage.
3. Replace `lib/blockchain.ts` with a real client for the Anchor program once the program is deployed.
4. Add richer anti-cheat rules and analytics once the MVP loop is stable.
