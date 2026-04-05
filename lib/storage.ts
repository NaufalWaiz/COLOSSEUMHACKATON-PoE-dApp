import fs from "fs/promises";
import path from "path";
import { DatabaseShape } from "@/lib/types";

const dataDir = path.join(process.cwd(), ".storage");
const dbFile = path.join(dataDir, "poe-db.json");

const emptyDb: DatabaseShape = {
  users: [],
  activities: [],
  scores: [],
  nonces: [],
  chainRecords: [],
};

async function ensureDbFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbFile);
  } catch {
    await fs.writeFile(dbFile, JSON.stringify(emptyDb, null, 2), "utf-8");
  }
}

export async function readDb() {
  await ensureDbFile();
  const raw = await fs.readFile(dbFile, "utf-8");
  return JSON.parse(raw) as DatabaseShape;
}

export async function writeDb(data: DatabaseShape) {
  await ensureDbFile();
  await fs.writeFile(dbFile, JSON.stringify(data, null, 2), "utf-8");
}
