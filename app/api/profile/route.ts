import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getProfile } from "@/lib/repository";

export async function GET(request: Request) {
  const { userId } = await auth();
  const url = new URL(request.url);
  const identity = url.searchParams.get("identity") ?? userId;

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile(identity);
  return NextResponse.json(profile);
}
