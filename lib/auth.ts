import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { NONCE_TTL_MS } from "@/lib/constants";
import { randomId } from "@/lib/id";
import { NonceRecord } from "@/lib/types";
import { readDb, writeDb } from "@/lib/storage";
import { assertSupabaseSuccess, getSupabaseServerClient, isSupabaseConfigured, mapNonceRow } from "@/lib/supabase";

function buildMessage(walletAddress: string, nonce: string) {
  return `Skilltree login
Wallet: ${walletAddress}
Nonce: ${nonce}`;
}

async function issueNonceLocal(walletAddress: string) {
  const db = await readDb();
  const nonce = randomId("nonce");
  const record: NonceRecord = {
    walletAddress,
    nonce,
    expiresAt: Date.now() + NONCE_TTL_MS,
  };

  db.nonces = db.nonces.filter((item) => item.walletAddress !== walletAddress);
  db.nonces.push(record);
  await writeDb(db);

  return {
    nonce,
    message: buildMessage(walletAddress, nonce),
  };
}

async function issueNonceSupabase(walletAddress: string) {
  const supabase = getSupabaseServerClient();
  const nonce = randomId("nonce");

  const { error } = await supabase.from("nonces").upsert(
    {
      wallet_address: walletAddress,
      nonce,
      expires_at: Date.now() + NONCE_TTL_MS,
    },
    { onConflict: "wallet_address" },
  );

  assertSupabaseSuccess(error, "Failed to persist wallet nonce");

  return {
    nonce,
    message: buildMessage(walletAddress, nonce),
  };
}

export async function issueNonce(walletAddress: string) {
  if (!isSupabaseConfigured()) {
    return issueNonceLocal(walletAddress);
  }

  return issueNonceSupabase(walletAddress);
}

async function verifyWalletSignatureLocal(input: {
  walletAddress: string;
  nonce: string;
  signatureBase64: string;
}) {
  const db = await readDb();
  const record = db.nonces.find(
    (item) => item.walletAddress === input.walletAddress && item.nonce === input.nonce,
  );

  if (!record || record.expiresAt < Date.now()) {
    return { ok: false as const, reason: "Nonce expired or not found" };
  }

  let verified = false;

  try {
    const message = buildMessage(input.walletAddress, input.nonce);
    verified = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      Buffer.from(input.signatureBase64, "base64"),
      new PublicKey(input.walletAddress).toBytes(),
    );
  } catch {
    verified = false;
  }

  if (!verified) {
    return { ok: false as const, reason: "Signature verification failed" };
  }

  db.nonces = db.nonces.filter((item) => !(item.walletAddress === input.walletAddress && item.nonce === input.nonce));
  await writeDb(db);

  return { ok: true as const };
}

async function verifyWalletSignatureSupabase(input: {
  walletAddress: string;
  nonce: string;
  signatureBase64: string;
}) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("nonces")
    .select("wallet_address, nonce, expires_at")
    .eq("wallet_address", input.walletAddress)
    .eq("nonce", input.nonce)
    .maybeSingle();

  assertSupabaseSuccess(error, "Failed to fetch wallet nonce");

  const record = data ? mapNonceRow(data) : null;
  if (!record || record.expiresAt < Date.now()) {
    return { ok: false as const, reason: "Nonce expired or not found" };
  }

  let verified = false;

  try {
    const message = buildMessage(input.walletAddress, input.nonce);
    verified = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      Buffer.from(input.signatureBase64, "base64"),
      new PublicKey(input.walletAddress).toBytes(),
    );
  } catch {
    verified = false;
  }

  if (!verified) {
    return { ok: false as const, reason: "Signature verification failed" };
  }

  const { error: deleteError } = await supabase
    .from("nonces")
    .delete()
    .eq("wallet_address", input.walletAddress)
    .eq("nonce", input.nonce);

  assertSupabaseSuccess(deleteError, "Failed to delete consumed nonce");

  return { ok: true as const };
}

export async function verifyWalletSignature(input: {
  walletAddress: string;
  nonce: string;
  signatureBase64: string;
}) {
  if (!isSupabaseConfigured()) {
    return verifyWalletSignatureLocal(input);
  }

  return verifyWalletSignatureSupabase(input);
}
