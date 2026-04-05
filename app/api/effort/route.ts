import { NextResponse } from "next/server";
import { ACTIVITY_WEIGHTS } from "@/lib/constants";
import { createEffortActivity } from "@/lib/repository";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const activityType = body.activityType as keyof typeof ACTIVITY_WEIGHTS;
  const duration = Number(body.duration);
  const description = body.description as string | undefined;
  const proofIpfs = body.proofIpfs as string | undefined;

  if (!activityType || !(activityType in ACTIVITY_WEIGHTS)) {
    return NextResponse.json({ error: "Invalid activityType" }, { status: 400 });
  }

  if (!description || !proofIpfs || Number.isNaN(duration)) {
    return NextResponse.json({ error: "duration, description, and proofIpfs are required" }, { status: 400 });
  }

  try {
    const payload = await createEffortActivity({
      walletAddress: session.walletAddress,
      activityType,
      duration,
      description,
      proofIpfs,
    });

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit effort" },
      { status: 400 },
    );
  }
}
