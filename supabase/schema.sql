create table if not exists users (
  id text primary key,
  wallet_address text not null unique,
  created_at timestamptz not null
);

create table if not exists scores (
  user_id text primary key references users(id) on delete cascade,
  total_score integer not null default 0,
  updated_at timestamptz not null
);

create table if not exists nonces (
  wallet_address text primary key,
  nonce text not null,
  expires_at bigint not null
);

create table if not exists chain_records (
  tx_id text primary key,
  wallet_address text not null,
  effort_hash text not null,
  score integer not null,
  timestamp bigint not null,
  network text not null
);

create table if not exists activities (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  wallet_address text not null,
  activity_type text not null,
  duration integer not null,
  description text not null,
  proof_ipfs text not null,
  effort_hash text not null,
  score integer not null,
  consistency_multiplier numeric(4, 2) not null,
  created_at timestamptz not null,
  chain_tx_id text not null
);

create index if not exists activities_wallet_address_idx on activities (wallet_address);
create index if not exists activities_created_at_idx on activities (created_at desc);
create index if not exists activities_wallet_created_idx on activities (wallet_address, created_at desc);
