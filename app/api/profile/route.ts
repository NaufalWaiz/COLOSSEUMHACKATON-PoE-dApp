import { NextResponse } from "next/server";
import { getProfile } from "@/lib/repository";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = getSession();
  const url = new URL(request.url);
  const walletAddress = url.searchParams.get("wallet") ?? session?.walletAddress;

  if (!walletAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile(walletAddress);
  return NextResponse.json(profile);
}
