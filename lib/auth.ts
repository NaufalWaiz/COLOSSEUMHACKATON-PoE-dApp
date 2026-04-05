import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { NONCE_TTL_MS } from "@/lib/constants";
import { randomId } from "@/lib/id";
import { NonceRecord } from "@/lib/types";
import { readDb, writeDb } from "@/lib/storage";

function buildMessage(walletAddress: string, nonce: string) {
  return `Proof of Effort login
Wallet: ${walletAddress}
Nonce: ${nonce}`;
}

export async function issueNonce(walletAddress: string) {
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

export async function verifyWalletSignature(input: {
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
