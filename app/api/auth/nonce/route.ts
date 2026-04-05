import { NextResponse } from "next/server";
import { issueNonce } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const walletAddress = body.walletAddress as string | undefined;

  if (!walletAddress) {
    return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
  }

  const payload = await issueNonce(walletAddress);
  return NextResponse.json(payload);
}
