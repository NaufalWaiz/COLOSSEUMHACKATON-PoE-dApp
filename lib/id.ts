import crypto from "crypto";

export function randomId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

export function sha256(value: string | Buffer) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
