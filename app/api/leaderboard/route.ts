import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/repository";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rangeValue = url.searchParams.get("range");
  const range = rangeValue === "daily" || rangeValue === "weekly" ? rangeValue : "all";
  const entries = await getLeaderboard(range);
  return NextResponse.json({ entries, range });
}
