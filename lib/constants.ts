export const ACTIVITY_WEIGHTS = {
  coding: 1,
  learning: 0.7,
  watching: 0.4,
} as const;

export const ACTIVITY_OPTIONS = [
  { value: "coding", label: "Coding", hint: "Build features, fix bugs, ship code" },
  { value: "learning", label: "Learning", hint: "Study docs, read papers, take courses" },
  { value: "watching", label: "Watching", hint: "Watch tutorials, demos, or lectures" },
] as const;

export const MIN_ACTIVITY_DURATION = 5;
export const SESSION_COOKIE = "poe_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
export const NONCE_TTL_MS = 1000 * 60 * 10;
