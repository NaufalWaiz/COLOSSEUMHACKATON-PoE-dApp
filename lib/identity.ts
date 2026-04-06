import { PersonSummary } from "@/lib/types";

type DisplayUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  imageUrl?: string | null;
  primaryEmailAddress?: {
    emailAddress?: string | null;
  } | null;
};

export function getDisplayName(user: DisplayUser | null) {
  if (!user) return "Anonymous";

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (user.username) return user.username;
  if (user.primaryEmailAddress?.emailAddress) return user.primaryEmailAddress.emailAddress;
  return shortIdentity(user.id);
}

export function getDisplaySubtitle(user: DisplayUser | null) {
  if (!user) return "No account details";
  if (user.username) return `@${user.username}`;
  if (user.primaryEmailAddress?.emailAddress) return user.primaryEmailAddress.emailAddress;
  return shortIdentity(user.id);
}

export function shortIdentity(value: string) {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function memberLabel(identity: string) {
  return `member-${identity.slice(-6).toLowerCase()}`;
}

export function toPersonSummary(user: DisplayUser | null): PersonSummary {
  return {
    id: user?.id ?? "unknown",
    displayName: getDisplayName(user),
    subtitle: getDisplaySubtitle(user),
    imageUrl: user?.imageUrl ?? null,
  };
}
