import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { searchPeople } from "@/lib/people";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const results = await searchPeople(query, {
    excludeUserId: userId,
    limit: 7,
  });

  return NextResponse.json({ results });
}
