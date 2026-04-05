import fs from "fs/promises";
import path from "path";
import { randomId, sha256 } from "@/lib/id";

const uploadDir = path.join(process.cwd(), ".storage", "uploads");

export async function storeProofFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const hash = sha256(buffer);
  const cid = `poe_${hash.slice(0, 24)}`;
  await fs.mkdir(uploadDir, { recursive: true });
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "-");
  await fs.writeFile(path.join(uploadDir, `${cid}-${sanitizedName}`), buffer);
  return {
    cid,
    uri: `ipfs://${cid}`,
    localRef: randomId("proof"),
  };
}
