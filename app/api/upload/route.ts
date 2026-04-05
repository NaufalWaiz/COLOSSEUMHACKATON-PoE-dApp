import { NextResponse } from "next/server";
import { storeProofFile } from "@/lib/ipfs";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const payload = await storeProofFile(file);
  return NextResponse.json(payload, { status: 201 });
}
