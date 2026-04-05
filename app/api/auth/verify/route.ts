import { NextResponse } from "next/server";
import { ensureUser } from "@/lib/repository";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/constants";
import { verifyWalletSignature } from "@/lib/auth";
import { createSessionToken } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json();
  const walletAddress = body.walletAddress as string | undefined;
  const nonce = body.nonce as string | undefined;
  const signature = body.signature as string | undefined;

  if (!walletAddress || !nonce || !signature) {
    return NextResponse.json({ error: "walletAddress, nonce, and signature are required" }, { status: 400 });
  }

  const verification = await verifyWalletSignature({
    walletAddress,
    nonce,
    signatureBase64: signature,
  });

  if (!verification.ok) {
    return NextResponse.json({ error: verification.reason }, { status: 401 });
  }

  await ensureUser(walletAddress);
  const response = NextResponse.json({ ok: true, walletAddress });
  response.cookies.set(SESSION_COOKIE, createSessionToken(walletAddress), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
