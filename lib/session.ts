import crypto from "crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/constants";
import { serverEnv } from "@/lib/server-env";

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf-8");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", serverEnv.sessionSecret).update(payload).digest("base64url");
}

export function createSessionToken(walletAddress: string) {
  const payload = JSON.stringify({
    walletAddress,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const encoded = base64UrlEncode(payload);
  return `${encoded}.${sign(encoded)}`;
}

export function readSessionToken(token: string | undefined) {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  if (sign(encoded) !== signature) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as {
      walletAddress: string;
      expiresAt: number;
    };
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return readSessionToken(token);
}
