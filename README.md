# Skilltree

Skilltree is a work-tracking MVP with a simple public landing page, Clerk authentication, a GitHub-inspired private dashboard, and Supabase-backed persistence.

## What is implemented

- Next.js App Router frontend with signed-out landing page plus authenticated dashboard, submit form, profile, and leaderboard
- Clerk authentication for protected pages and API routes
- Rule-based effort scoring for coding, learning, and watching activities
- Supabase-backed repository adapter with automatic local JSON fallback
- Local proof storage adapter that generates deterministic IPFS-like proof references
- Solana-ready blockchain adapter plus Anchor program scaffold under `programs/poe`

## Local architecture

```text
Frontend (Next.js)
  -> API routes
  -> Supabase or local JSON repository (.storage/poe-db.json fallback)
  -> Local proof files (.storage/uploads)
  -> Mock chain record adapter
```

The app is wired so it can run locally without requiring a live Pinata or Solana program deployment. When `SUPABASE_URL` and a Supabase key are configured, persistence moves to Supabase automatically; otherwise it falls back to the local JSON adapter. Replace the adapters in `lib/ipfs.ts` and `lib/blockchain.ts` when you are ready to connect production services.

## Environment

Copy `.env.example` to `.env.local` and update values as needed.

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk frontend key
- `CLERK_SECRET_KEY`: Clerk backend key
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC endpoint, default is Devnet
- `NEXT_PUBLIC_POE_PROGRAM_ID`: program id used by the client and Anchor scaffold
- `SESSION_SECRET`: only needed for legacy wallet-auth files that are no longer used by the main app flow
- `MOCK_EXTERNAL_ADAPTERS`: keep `true` for local mock mode
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: server-side key used by API routes to read and write tables
- `SUPABASE_ANON_KEY`: optional fallback key if the service role key is not set

## Clerk setup

1. Create a Clerk application.
2. In Clerk, enable the sign-in methods you want to use.
3. Copy `.env.example` to `.env.local`.
4. Fill in `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
5. Restart `npm run dev`.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
5. Restart `npm run dev`.

## Run

```bash
npm install
npm run dev
```

## API surface

- `POST /api/upload` - upload a proof file and receive an IPFS-like cid
- `POST /api/effort` - submit a new effort activity
- `GET /api/profile` - fetch the authenticated profile or a specific member profile
- `GET /api/leaderboard?range=daily|weekly|all` - fetch leaderboard data

## Data model

The repository keeps the same high-level shapes described in the SDD:

- `users`
- `activities`
- `scores`
- `nonces`
- `chainRecords`

With Supabase configured, these shapes live in Postgres tables. Without it, the same data is written to `.storage/poe-db.json` during development.

## Verification status

I verified:

- `npx tsc --noEmit`
- `npm run lint`

The local `next build` attempt in this environment is blocked by a broken native SWC binary from the machine setup (`@next/swc-win32-x64-msvc` failed to load as a valid Win32 application). The application code itself passed TypeScript and ESLint checks.

## Next integration steps

1. Replace `lib/ipfs.ts` with Pinata or Web3.Storage.
2. Replace `lib/blockchain.ts` with a real client for the Anchor program once the program is deployed.
3. Add richer anti-cheat rules and analytics once the MVP loop is stable.
