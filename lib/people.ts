import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import { toPersonSummary } from "@/lib/identity";
import { PersonSummary } from "@/lib/types";

export async function getPersonById(userId: string): Promise<PersonSummary | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return toPersonSummary(user);
  } catch {
    return null;
  }
}

export async function searchPeople(query: string, options?: { excludeUserId?: string; limit?: number }) {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return [] as PersonSummary[];
  }

  const client = await clerkClient();
  const response = await client.users.getUserList({
    query: trimmed,
    limit: options?.limit ?? 6,
  });

  return response.data
    .map(toPersonSummary)
    .filter((person) => person.id !== options?.excludeUserId);
}
